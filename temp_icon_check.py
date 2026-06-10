from pathlib import Path
path = Path('client/node_modules/react-icons/si/index.d.ts')
text = path.read_text(encoding='utf-8')
keys = [
    'SiPaypal','SiMastercard','SiVisa','SiWesternunion','SiAirtel','SiOrange','SiVodafone','SiWise',
    'SiAmazon','SiApple','SiGoogle','SiSamsung','SiMtn','SiSafaricom','SiEtisalat','SiZain',
    'SiWesternUnion','SiGooglepay','SiApplepay','SiSamsungpay','SiStripe','SiCashapp','SiMastercard',
    'SiVisa', 'SiAmericanexpress', 'SiDiscover'
]
for k in keys:
    if k in text:
        print(k)
