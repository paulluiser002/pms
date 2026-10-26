"""Embed local assets without creating an archive or touching deployment files."""
from pathlib import Path
import re
import base64
import shutil

source = Path(__file__).resolve().parent.parent / 'performance' / 'dist'
output = source.parent.parent / 'outputs'
html = (source / 'index.html').read_text(encoding='utf-8')
def inline_style(name):
    css = (source / name).read_text(encoding='utf-8')
    return re.sub(r"url\('fonts/([^']+)'\)",
                  lambda m: "url('data:font/ttf;base64," + base64.b64encode((source / 'fonts' / m[1]).read_bytes()).decode() + "')", css)
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">',
              lambda m: '<style>' + inline_style(m[1]) + '</style>', html)
html = re.sub(r'<script src="([^"]+)"></script>',
              lambda m: '<script>' + (source / m[1]).read_text(encoding='utf-8') + '</script>', html)
(output / 'performance-mvp.html').write_text(html, encoding='utf-8')
for asset in source.iterdir():
    if asset.is_file():
        (output / asset.name).write_bytes(asset.read_bytes())
    elif asset.is_dir():
        shutil.copytree(asset, output / asset.name, dirs_exist_ok=True)
print('Local HTML preview updated.')
