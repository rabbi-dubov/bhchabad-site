#!/usr/bin/env python3
"""Build the two snippets that get pasted into ChabadOne:
   dist/header.html -> Settings > General Settings > Custom Header Code
   dist/footer.html -> Settings > General Settings > Custom Footer Code"""
import re, subprocess, datetime, pathlib
root = pathlib.Path(__file__).parent
ver = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d.%H%M')
css = (root/'src/theme.css').read_text()
css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
css = re.sub(r'\s+', ' ', css)
css = re.sub(r'\s*([{};,])\s*', r'\1', css)
css = re.sub(r'\s*>\s*', '>', css)
css = css.replace(';}', '}').strip()
assert '&' not in css and '<' not in css, 'CSS must not contain & or <'
(root/'dist').mkdir(exist_ok=True)
(root/'dist/theme.min.css').write_text(css)
subprocess.run(['npx','--yes','terser@5','src/theme.js','-c','-m','-o','dist/theme.min.js'], cwd=root, check=True)
js = (root/'dist/theme.min.js').read_text().strip()
assert ']]>' not in js and '</script' not in js.lower()
fonts = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Instrument+Sans:wght@400;500;600;700&display=swap'  # ChabadOne decodes &amp; on save, so store the decoded form
header = f'''<!-- BH CHABAD THEME v{ver} : header (CSS). Source: project docs. Do not edit by hand. -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
<link rel="stylesheet" type="text/css" href="{fonts}" />
<link rel="stylesheet" type="text/css" href="https://w2.Chabad.org/images/Shluchim/minisites/themes/form-redesign/form-style.css" />
<script type="text/javascript" src="https://w2.Chabad.org/images/Shluchim/minisites/themes/form-redesign/form-script.js"></script>
<script type="text/javascript">//<![CDATA[
(function(){{var h=document.documentElement;h.className+=" cc-on";if(location.pathname==="/"||/default\\.asp$/i.test(location.pathname)){{setTimeout(function(){{if(h.className.indexOf("cc-shell-ready")<0){{h.className+=" cc-shell-failed";}}}},4000);}}}})();
//]]></script>
<style type="text/css">{css}</style>
<!-- /BH CHABAD THEME -->'''
footer = f'''<!-- BH CHABAD THEME v{ver} : footer (JS). Source: project docs. Do not edit by hand. -->
<script type="text/javascript">//<![CDATA[
{js}
//]]></script>
<!-- /BH CHABAD THEME -->'''
(root/'dist/header.html').write_text(header)
(root/'dist/footer.html').write_text(footer)
print('version', ver, 'header', len(header), 'footer', len(footer))
