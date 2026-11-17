"""Tests for vtt_to_text.py. Run: python3 -I -m unittest discover -s <scripts dir> -p 'test_*.py'"""
import os
import subprocess
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vtt_to_text import caption_lines, paragraphs  # noqa: E402

SCRIPT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vtt_to_text.py")


def vtt(*cues):
    """cues: (start, end, text) with times like '00:00:01.000'."""
    return "WEBVTT\n\n" + "\n\n".join(f"{s} --> {e}\n{t}" for s, e, t in cues) + "\n"


def youtube(*lines):
    """Rolling auto-captions as YouTube writes them: each new line carries
    word-timing tags, the previous line is repeated above it, and a 10 ms cue
    repeats the new line on its own."""
    cues, prev = [], " "
    for i, line in enumerate(lines):
        t, words = i * 3, line.split()
        tagged = words[0] + "".join(f"<00:00:{t:02d}.{k}00><c> {w}</c>" for k, w in enumerate(words[1:], 1))
        cues.append((f"00:00:{t:02d}.000", f"00:00:{t + 2:02d}.990", f"{prev}\n{tagged}"))
        cues.append((f"00:00:{t + 2:02d}.990", f"00:00:{t + 3:02d}.000", f"{line}\n "))
        prev = line
    return vtt(*cues)


def text(lines):
    return " ".join(line for _, line in lines)


class CaptionLines(unittest.TestCase):
    def test_prefix_is_compared_by_words_not_characters(self):
        # "a" then "and then 10" must not become "a nd then 10".
        lines = caption_lines(vtt(("00:00:01.000", "00:00:02.000", "a"),
                                  ("00:00:02.000", "00:00:04.000", "and then 10")))
        self.assertEqual(text(lines), "a and then 10")

    def test_repeated_figure_is_kept_in_manual_captions(self):
        lines = caption_lines(vtt(("00:00:01.000", "00:00:02.000", "foram 10"),
                                  ("00:00:02.000", "00:00:04.000", "10 mil")))
        self.assertEqual(text(lines), "foram 10 10 mil")

    def test_repeated_figure_is_kept_in_rolling_captions(self):
        lines = caption_lines(youtube("foram 10", "10 mil pessoas"))
        self.assertEqual(text(lines), "foram 10 10 mil pessoas")

    def test_rolling_repeats_are_dropped(self):
        lines = caption_lines(youtube("querido povo brasileiro", "amanhã 7 de setembro", "é dia de celebrar"))
        self.assertEqual(text(lines), "querido povo brasileiro amanhã 7 de setembro é dia de celebrar")
        self.assertEqual([s for s, _ in lines], [0, 3, 6])

    def test_identical_consecutive_manual_lines_are_kept(self):
        lines = caption_lines(vtt(("00:00:01.000", "00:00:02.000", "Não."),
                                  ("00:00:02.000", "00:00:03.000", "Não.")))
        self.assertEqual(text(lines), "Não. Não.")

    def test_note_and_style_blocks_do_not_leak(self):
        body = ("WEBVTT\n\nSTYLE\n::cue { color: red }\n\n"
                "00:00:01.000 --> 00:00:02.000\nprimeira linha\nNOTE comentário colado\n\n"
                "NOTE bloco separado\n\n"
                "2\n00:00:02.000 --> 00:00:03.000\nsegunda <i>linha</i> &amp; fim\n")
        self.assertEqual(text(caption_lines(body)), "primeira linha segunda linha & fim")

    def test_hours_and_milliseconds(self):
        lines = caption_lines(vtt(("01:02:03.500", "01:02:05.000", "tarde")))
        self.assertEqual(lines, [(3723.5, "tarde")])


class Paragraphs(unittest.TestCase):
    def test_every_zero_keeps_each_line_and_its_own_time(self):
        # Cues 0.5 s apart must not be merged: the &t= timestamp would be wrong.
        lines = caption_lines(vtt(("00:00:10.000", "00:00:10.500", "um"),
                                  ("00:00:10.500", "00:00:11.000", "dois"),
                                  ("00:00:11.000", "00:00:12.000", "três")))
        self.assertEqual(paragraphs(lines, 0), [(10.0, "um"), (10.5, "dois"), (11.0, "três")])

    def test_unpunctuated_paragraphs_are_about_every_seconds(self):
        lines = [(t, f"palavra{t}") for t in range(0, 120, 5)]
        starts = [s for s, _ in paragraphs(lines, 30)]
        self.assertEqual(starts, [0, 30, 60, 90])


class Cli(unittest.TestCase):
    def run_cli(self, body, *args):
        with tempfile.NamedTemporaryFile("w", suffix=".vtt", delete=False, encoding="utf-8") as f:
            f.write(body)
        try:
            return subprocess.run([sys.executable, "-I", SCRIPT, f.name, *args], capture_output=True, text=True)
        finally:
            os.unlink(f.name)

    def test_output_format(self):
        result = self.run_cli(vtt(("00:01:05.000", "00:01:06.000", "olá")), "--every", "0")
        self.assertEqual(result.returncode, 0)
        self.assertEqual(result.stdout, "[01:05] olá\n")

    def test_not_a_vtt_file(self):
        result = self.run_cli("isto não é uma legenda\n")
        self.assertEqual(result.returncode, 1)
        self.assertIn("No caption text found", result.stderr)


if __name__ == "__main__":
    unittest.main()
