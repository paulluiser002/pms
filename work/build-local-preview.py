"""Embed local assets without creating an archive or touching deployment files."""
from pathlib import Path
import re

source = Path(__file__).resolve().parent.parent / 'performance' / 'dist'
output = source.parent.parent / 'outputs'
html = (source / 'index.html').read_text(encoding='utf-8')
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">',
              lambda m: '<style>' + (source / m[1]).read_text(encoding='utf-8') + '</style>', html)
html = re.sub(r'<script src="([^"]+)"></script>',
              lambda m: '<script>' + (source / m[1]).read_text(encoding='utf-8') + '</script>', html)
(output / 'performance-mvp.html').write_text(html, encoding='utf-8')
for name in ['index.html', 'position-goals.js', 'position-goals.css', 'cycle-workflow.js', 'reviews.js', 'evaluations.js']:
    (output / name).write_bytes((source / name).read_bytes())
print('Local HTML preview updated.')
