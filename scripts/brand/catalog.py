#!/usr/bin/env python3
"""Catalogue des briques réutilisables (src/brand/*.ts*) pour le skill « la-petite-ide ».

Usage : python3 scripts/brand/catalog.py  → réécrit .claude/skills/la-petite-ide/references/briques.md
Pour chaque fichier : son commentaire d'en-tête, puis chaque export avec la 1re phrase de son commentaire JSDoc.
"""
import glob, os, re

OUT = '.claude/skills/la-petite-ide/references/briques.md'
EXPORT = re.compile(r'^export (?:const|function|type|interface) (\w+)', re.M)


def header(src: str) -> str:
    lines = []
    for line in src.splitlines():
        t = line.strip()
        if t.startswith('//'):
            t = t.lstrip('/').strip()
            if t and not set(t) <= set('─-= '):
                lines.append(t)
        elif t == '' and not lines:
            continue
        else:
            break
    return ' '.join(lines)


def doc_before(src: str, pos: int) -> str:
    before = src[:pos].rstrip()
    if before.endswith('*/'):
        start = before.rfind('/**')
        if start != -1:
            txt = re.sub(r'^\s*\*\s?', '', before[start + 3:-2], flags=re.M)
            txt = ' '.join(txt.split())
            m = re.match(r'(.+?(?<!ex)(?<!cf)\.)(\s+[A-ZÀ-Ý«`]|$)', txt)
            first = m.group(1) if m else txt
            return first if len(first) <= 240 else first[:237].rsplit(' ', 1)[0] + '…'
    return ''


def main():
    out = ['# Briques réutilisables (`src/brand/`)', '',
           'Généré par `python3 scripts/brand/catalog.py` : à relancer après avoir ajouté ou retiré une brique.',
           'Les props exactes sont dans le fichier source (lire le commentaire au-dessus de l\'export).', '']
    for f in sorted(glob.glob('src/brand/*.ts*')):
        src = open(f, encoding='utf-8').read()
        names = [(m.group(1), doc_before(src, m.start())) for m in EXPORT.finditer(src)]
        if not names:
            continue
        out.append(f'## `{os.path.basename(f)}`')
        h = header(src)
        if h:
            out.append(h)
        out.append('')
        for n, d in names:
            out.append(f'- `{n}`' + (f' — {d}' if d else ''))
        out.append('')
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, 'w', encoding='utf-8').write('\n'.join(out))
    print(OUT, sum(1 for l in out if l.startswith('- `')), 'exports')


if __name__ == '__main__':
    main()
