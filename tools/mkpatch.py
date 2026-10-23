import difflib,json,hashlib,re,subprocess,sys
def tok(s): return re.findall(r'[^};\n]*[};\n]|[^};\n]+$', s)
def pairs_for(a,b):
    A,B=tok(a),tok(b); assert ''.join(A)==a and ''.join(B)==b
    ops=[o for o in difflib.SequenceMatcher(None,A,B,autojunk=False).get_opcodes() if o[0]!='equal']
    P=[]; C=A[:]
    for tag,i1,i2,j1,j2 in reversed(ops):
        k=1
        while ''.join(C).count(''.join(C[max(0,i1-k):i2]))!=1: k+=1
        o=''.join(C[max(0,i1-k):i2]); n=''.join(C[max(0,i1-k):i1])+''.join(B[j1:j2])
        C=C[:i1]+B[j1:j2]+C[i2:]; P.append([o,n])
    assert ''.join(C)==b
    return P
git=lambda p: subprocess.check_output(['git','show','HEAD:'+p]).decode()
out={}
for key,path in (('h','dist/header.html'),('f','dist/footer.html')):
    a=git(path); b=open(path).read()
    out[key]={'P':pairs_for(a,b),'want':hashlib.sha256(b.encode()).hexdigest()[:12],'old':hashlib.sha256(a.encode()).hexdigest()[:12]}
print(json.dumps(out))
