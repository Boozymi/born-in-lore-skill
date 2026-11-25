"""script_check.py - checks a whole episode script against the measured Born in Lore formula (SCRIPT_FORMULA.md).

Give the voice text files in running order (hook first, then the prologue, chapter I … IX with the ending). Prints the words
and estimated length per piece and in total, the sentence rhythm, and every rule of the voice check with OK / CHECK.
Usage: python script_check.py voice/1_hook.txt voice/0_prologue.txt voice/2_chapter1.txt ... [--wps 2.6]
"""
import re
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
args = [a for a in sys.argv[1:] if not a.startswith('--')]
wps = float(sys.argv[sys.argv.index('--wps') + 1]) if '--wps' in sys.argv else 2.6
if not args:
    sys.exit(__doc__)
texts = [open(p, encoding='utf-8').read().strip() for p in args]
full = ' '.join(texts)
low = full.lower()
sent = lambda t: [s for s in re.split(r'(?<=[.?!])\s+', t) if s.strip()]
words = lambda t: len(t.split())

print(f'{"piece":24s} {"words":>5s} {"≈ s":>6s}')
for p, t in zip(args, texts):
    print(f'{p[-24:]:24s} {words(t):5d} {words(t) / wps:6.1f}')
W = words(full)
cards = (len(texts) - 2) * 1.7 if len(texts) > 2 else 0
print(f'{"total":24s} {W:5d} {W / wps:6.1f}   (+ chapter cards ≈ {cards:.0f} s + end card 12 s ≈ {(W / wps + cards + 12) / 60:.1f} min)')

S = sent(full)
L = [words(s) for s in S]
short = sum(1 for x in L if x <= 5) / len(L)
starts = sum(1 for s in S if re.match(r'(then|and then|so)\b', s.strip().lower())) / len(S)
hook = texts[0].lower()
rest = low[len(hook):]


def rule(name, ok, value):
    print(f'{"OK   " if ok else "CHECK"} {name:52s} {value}')


print()
rule('hook 30–50 words (up to "But right now")', 30 <= words(hook.split('but right now')[0]) <= 50, words(hook.split('but right now')[0]))
rule('hook starts "If you were born as"', hook.startswith('if you were born as'), texts[0][:40])
rule('baby hand-over "But right now, you\'re a baby"', "but right now, you're a baby" in hook, '')
print(f'INFO  length {W} words ≈ {W / wps / 60:.1f} min – no fixed target, the story decides '
      f'(Born in Lore: 1,049–2,197 words, 6:52–14:17; the newest 13–14 min)')
rule('mean sentence length ~9 words', 6 <= sum(L) / len(L) <= 10.5, f'{sum(L) / len(L):.1f}')
rule('≥ 30 % of sentences with ≤ 5 words', short >= 0.30, f'{short:.0%}')
rule('no sentence over 25 words (hook excepted)', max(words(s) for s in sent(' '.join(texts[1:]))) <= 25, max(words(s) for s in sent(' '.join(texts[1:]))))
rule('~13 % of sentences start with Then/So', 0.07 <= starts <= 0.2, f'{starts:.0%}')
rule('"you\'d" only in the hook', "you'd" not in rest.split('not bad for')[0], rest.count("you'd"))
rule('"This time" 1–2× (first six: 2, newest: 1)', 1 <= low.count('this time') <= 2, low.count('this time'))
rule('plants: "Remember that" / "Hold that thought" 2–4×', 2 <= low.count('remember that') + low.count('hold that thought') <= 5,
     low.count('remember that') + low.count('hold that thought'))
rule('"Long story." at least once', 'long story' in low, low.count('long story'))
rule('comment call "Quick pause." once', low.count('quick pause') == 1, low.count('quick pause'))
cta = low.find('quick pause')
rule('comment call at 29–46 % of the words', cta > 0 and 0.29 <= words(low[:cta]) / W <= 0.46, f'{words(low[:cta]) / W:.0%}' if cta > 0 else '-')
rule('ending "Not bad for a …" or the newest form (summary + "So tell me")',
     'not bad for a' in low or re.search(r'so,? (you )?tell me', low) is not None, '')
rule('final question "So, tell me, …?"', re.search(r'so,? (you )?tell me,? [^?]*\?', low) is not None, '')
end = low.split('not bad for')[-1] if 'not bad for' in low else ' '.join(low.split()[-80:])
rule('ending in past tense (killed/lost/gave …)', re.search(r'\byou (\w+ed|lost|gave|won|took|made|built|saw|kept|found|became|let)\b', end) is not None, '')
nums = re.findall(r'\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|fifty|hundred|thousand)\b', low)
print(f'INFO  number words in the text: {len(nums)} (rough: every "one" counts too – check by hand that no lore statistics pile up)')
print('INFO  jokes per minute and joke-free low points cannot be counted by a script – mark them by hand in the shot list.')
