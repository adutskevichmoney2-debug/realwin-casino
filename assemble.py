#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Assemble RealWin single-file site: inline CSS/JS parts + base64 images."""
import base64, json, os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')
TILES = os.path.join(ROOT, 'tiles')
BANNERS = os.path.join(ROOT, 'banners')
OUT = os.path.join(ROOT, 'index.html')

def read(p):
    with open(p, 'r', encoding='utf-8') as f:
        return f.read()

def b64(path, mime='image/webp'):
    with open(path, 'rb') as f:
        return 'data:%s;base64,%s' % (mime, base64.b64encode(f.read()).decode('ascii'))

# ---- collect images ----
imgs, bans = {}, {}
if os.path.isdir(TILES):
    for fn in sorted(os.listdir(TILES)):
        if fn.endswith('.webp'):
            slug = fn[:-5]
            imgs[slug] = b64(os.path.join(TILES, fn))
if os.path.isdir(BANNERS):
    for fn in sorted(os.listdir(BANNERS)):
        if fn.endswith('.webp'):
            bans[fn[:-5]] = b64(os.path.join(BANNERS, fn))

images_js = 'const IMG=' + json.dumps(imgs) + ';\nconst BAN=' + json.dumps(bans) + ';\n'

parts_css = [read(os.path.join(SRC, 'base.css')), read(os.path.join(SRC, 'pages.css'))]
parts_js = [images_js] + [read(os.path.join(SRC, f)) for f in ('core.js', 'ui.js', 'views.js', 'games.js', 'boot.js')]

html = []
html.append(read(os.path.join(SRC, 'head.html')))
html.append('<style>\n' + '\n'.join(parts_css) + '\n</style>\n</head>\n')
html.append(read(os.path.join(SRC, 'body.html')))
html.append('<script>\n' + '\n\n'.join(parts_js) + '\n</script>\n</body>\n</html>\n')

doc = ''.join(html)
with open(OUT, 'w', encoding='utf-8') as f:
    f.write(doc)

print('tiles embedded: %d  banners: %d' % (len(imgs), len(bans)))
print('missing tiles are rendered as branded CSS fallbacks by the app')
print('total size: %.2f MB (%d bytes)' % (len(doc.encode('utf-8')) / 1048576.0, len(doc.encode('utf-8'))))
