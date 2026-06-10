from pathlib import Path
p = Path(r'C:\Users\k\OneDrive\Desktop\South Sudanese learning App\client\src\pages\Subscription.jsx')
text = p.read_bytes()
print('bytes', len(text))
print(text[:200])
print(text[200:260])
print(text[260:340])
print(text[340:420])
lines = p.read_text('utf-8').splitlines()
print('lines', len(lines))
for idx in range(105,112):
    print(idx+1, repr(lines[idx]))
    print([ord(ch) for ch in lines[idx]])
