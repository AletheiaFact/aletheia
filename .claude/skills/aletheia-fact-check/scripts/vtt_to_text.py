#!/usr/bin/env python3
"""Turn a WebVTT caption file into a clean, timestamped transcript.

Usage: python3 -I vtt_to_text.py captions.vtt [--every SECONDS]

Prints one line per caption block: "[mm:ss] text". YouTube auto-captions
repeat the previous words in each cue ("rolling" captions); those repeats
are removed so every word appears once. Inline tags (<c>, <00:00:01.000>)
and markup are stripped. Lines are merged into paragraphs of about
--every seconds (default 30) so the transcript stays readable.

Standard library only. Reads the file; writes nothing but stdout.
"""
import argparse
import html
import re
import sys

TIME = re.compile(r"(?:(\d+):)?(\d{2}):(\d{2})[.,](\d{3})\s+-->")
TAG = re.compile(r"<[^>]+>")


def seconds(match):
    h, m, s, _ = match.groups()
    return int(h or 0) * 3600 + int(m) * 60 + int(s)


def stamp(total):
    h, rest = divmod(int(total), 3600)
    m, s = divmod(rest, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"


def cues(text):
    """Yield (start_seconds, [lines]) for each cue."""
    start, lines = None, []
    for raw in text.splitlines():
        line = raw.strip()
        match = TIME.match(line)
        if match:
            if start is not None and lines:
                yield start, lines
            start, lines = seconds(match), []
        elif start is not None and line:
            clean = html.unescape(TAG.sub("", line)).strip()
            if clean:
                lines.append(clean)
        elif not line and start is not None and lines:
            yield start, lines
            start, lines = None, []
    if start is not None and lines:
        yield start, lines


def new_words(previous, current):
    """Return the part of `current` not already said at the end of `previous`."""
    if not previous:
        return current
    if current.startswith(previous):
        return current[len(previous):].strip()
    prev_words, cur_words = previous.split(), current.split()
    for size in range(min(len(prev_words), len(cur_words)), 0, -1):
        if prev_words[-size:] == cur_words[:size]:
            return " ".join(cur_words[size:])
    return current


def transcript(text, every):
    paragraphs, start, words, previous = [], None, [], ""
    for cue_start, lines in cues(text):
        for line in lines:
            fresh = new_words(previous, line)
            previous = line
            if not fresh:
                continue
            # Auto-captions have no punctuation: start a new paragraph after
            # 2 x `every` seconds (or a long pause) so the stamp stays accurate.
            if words and cue_start - start >= max(2 * every, 1):
                paragraphs.append((start, " ".join(words)))
                start, words = None, []
            if start is None:
                start = cue_start
            words.append(fresh)
            # Otherwise break at a sentence end once `every` seconds have passed.
            if cue_start - start >= every and fresh.endswith((".", "?", "!")):
                paragraphs.append((start, " ".join(words)))
                start, words = None, []
    if words:
        paragraphs.append((start, " ".join(words)))
    return paragraphs


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("vtt")
    parser.add_argument("--every", type=int, default=30,
                        help="approximate paragraph length in seconds (0 = one line per cue)")
    args = parser.parse_args()
    with open(args.vtt, encoding="utf-8", errors="replace") as handle:
        text = handle.read()
    if "-->" not in text:
        sys.exit("Not a WebVTT file (no cue timings found).")
    for start, para in transcript(text, args.every):
        print(f"[{stamp(start)}] {para}")


if __name__ == "__main__":
    main()
