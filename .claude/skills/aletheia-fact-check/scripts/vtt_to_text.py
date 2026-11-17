#!/usr/bin/env python3
"""Turn a WebVTT caption file into a clean, timestamped transcript.

Usage: python3 -I vtt_to_text.py captions.vtt [--every SECONDS]

Each caption line is printed once, with the start time of the cue where it
first appeared. By default lines are grouped into paragraphs: a paragraph
starts with its first line's time and takes the following lines until the
next line starts --every seconds (default 30) or more after it.
--every 0 prints every caption line on its own line, with its own time.

YouTube automatic captions are "rolling": each cue repeats the previous line
in full before the new one. When the file has that shape (word-level
<00:00:01.000> timing tags), a line that exactly repeats the line printed
just before it is dropped. Nothing else is removed: words are never merged
or trimmed, so a repeated word or figure ("10, 10 mil") stays as said.

NOTE, STYLE and REGION blocks are skipped. Inline tags and HTML entities are
stripped. Standard library only; reads the file, writes only to stdout.
"""
import argparse
import html
import re
import sys

TIMING = re.compile(r"^(?:(\d+):)?(\d{2}):(\d{2})[.,](\d{3})\s+-->")
TAG = re.compile(r"<[^>]*>")
WORD_TIMING = re.compile(r"<\d{2}:\d{2}[:.]\d{2}")
NON_CUE = re.compile(r"^(NOTE|STYLE|REGION)(\s|$)")


def seconds(match):
    h, m, s, ms = match.groups()
    return int(h or 0) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000


def stamp(total):
    h, rest = divmod(int(total), 3600)
    m, s = divmod(rest, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"


def clean(line):
    return " ".join(html.unescape(TAG.sub("", line)).split())


def cues(text):
    """Yield (start_seconds, [text lines]) for each cue, skipping other blocks."""
    # Blocks end at an empty line. A line holding only spaces is cue text:
    # YouTube puts one right after the timing line of every rolling cue.
    for block in re.split(r"\n\n+", text.replace("\r\n", "\n").replace("\r", "\n")):
        lines = block.split("\n")
        for i, line in enumerate(lines):
            match = TIMING.match(line.strip())
            if match:
                break
        else:
            continue  # header, NOTE, STYLE, REGION or junk: no cue timing
        body = []
        for line in lines[i + 1:]:
            if NON_CUE.match(line):
                break  # a NOTE/STYLE block glued to the cue: stop here
            body.append(line)
        yield seconds(match), body


def caption_lines(text):
    """Return [(start_seconds, line)], each caption line once, in order."""
    rolling = bool(WORD_TIMING.search(text))
    out, last = [], None
    for start, body in cues(text):
        for raw in body:
            line = clean(raw)
            if not line:
                continue
            if rolling and line == last:
                continue  # the rolling repeat of the line just printed
            out.append((start, line))
            last = line
    return out


def paragraphs(lines, every):
    if every <= 0:
        return list(lines)
    result, start, words = [], None, []
    for line_start, line in lines:
        if words and line_start - start >= every:
            result.append((start, " ".join(words)))
            start, words = None, []
        if start is None:
            start = line_start
        words.append(line)
    if words:
        result.append((start, " ".join(words)))
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("vtt")
    parser.add_argument("--every", type=float, default=30,
                        help="paragraph length in seconds (0 = one line per caption line)")
    args = parser.parse_args()
    with open(args.vtt, encoding="utf-8", errors="replace") as handle:
        text = handle.read()
    lines = caption_lines(text)
    if not lines:
        sys.exit("No caption text found (not a WebVTT file, or no cues).")
    for start, para in paragraphs(lines, args.every):
        print(f"[{stamp(start)}] {para}")


if __name__ == "__main__":
    main()
