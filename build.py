#!/usr/bin/env python3
"""Build the BH Chabad theme.

  python3 build.py test       -> test/theme.min.css + test/theme.min.js   (seen with ?cc=test)
  python3 build.py promote    -> copy test/ to live/                       (seen by every visitor)
  python3 build.py snippets   -> dist/header.html + dist/footer.html       (old paste-everything method,
                                  kept for rollback if GitHub/jsDelivr ever fails)

The loader in loader/header.html + loader/footer.html (pasted once into ChabadOne) loads
live/ or test/ from jsDelivr: https://cdn.jsdelivr.net/gh/rabbi-dubov/bhchabad-site@main/
After pushing, purge jsDelivr (see README)."""
import re, subprocess, datetime, pathlib, shutil, sys, tempfile

root = pathlib.Path(__file__).parent
ver = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d.%H%M')


def build_css():
    css = (root/'src/theme.css').read_text()
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s*([{};,])\s*', r'\1', css)
    css = re.sub(r'\s*>\s*', '>', css)
    css = css.replace(';}', '}').strip()
    assert '&' not in css and '<' not in css, 'CSS must not contain & or <'
    return css


def build_js():
    with tempfile.TemporaryDirectory() as t:
        out = pathlib.Path(t)/'theme.min.js'
        subprocess.run(['npx', '--yes', 'terser@5', 'src/theme.js', '-c', '-m', '-o', str(out)], cwd=root, check=True)
        js = out.read_text().strip()
    assert ']]>' not in js and '</script' not in js.lower()
    return js


def write_folder(folder):
    d = root/folder
    d.mkdir(exist_ok=True)
    (d/'theme.min.css').write_text(f'/* BH Chabad theme v{ver} */{build_css()}\n')
    (d/'theme.min.js').write_text(f'/* BH Chabad theme v{ver} */{build_js()}\n')
    (d/'VERSION').write_text(ver + '\n')
    print(folder + '/', 'version', ver)


def promote():
    assert (root/'test/theme.min.css').exists(), 'run "build.py test" first'
    (root/'live').mkdir(exist_ok=True)
    for f in ('theme.min.css', 'theme.min.js', 'VERSION'):
        shutil.copyfile(root/'test'/f, root/'live'/f)
    print('live/ now =', (root/'live/VERSION').read_text().strip())


def snippets():
    css, js = build_css(), build_js()
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
    (root/'dist').mkdir(exist_ok=True)
    (root/'dist/theme.min.css').write_text(css)
    (root/'dist/theme.min.js').write_text(js)
    (root/'dist/header.html').write_text(header)
    (root/'dist/footer.html').write_text(footer)
    print('dist/ version', ver, 'header', len(header), 'footer', len(footer))


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'test':
        write_folder('test')
    elif cmd == 'promote':
        promote()
    elif cmd == 'snippets':
        snippets()
    else:
        sys.exit(__doc__)
