import requests
import csv
from bs4 import BeautifulSoup

moon_url = 'https://eco.mtk.nao.ac.jp/koyomi/dni/'#2023/s41'#s4103.html'

year = ['2022','2023']
month = [str(i).zfill(2) for i in range(1,13)]


def createcsv(data, year):
    with open('outputs/'+ year + '_moonrise_moonset.csv', mode='w') as csvfile:

        fieldname = ['date', 'moonrise', 'moonrise_direction', 'culmination', 'altitude', 'moonset', 'moonset_direction', 'moon_age']
        writer = csv.DictWriter(csvfile, fieldname)
        writer.writeheader()

        for a in data:
            writer.writerow({
                    'date':a[0], 'moonrise':a[1], 'moonrise_direction':a[2], 'culmination':a[3], 'altitude':a[4], 'moonset':a[5], 'moonset_direction':a[6], 'moon_age':a[7]
                })  
        csvfile.close()

for y in year:
    ydata = []
    for i in month:
        r = requests.get(moon_url + y + '/m41' + i + '.html')
        soup = BeautifulSoup(r.content, "html.parser")
        
        for e in soup.find_all('tr'):
            items = []
            for j, t in enumerate(e.find_all('td')):
                items.append(str(y) + '-' + str(i) + '-' + t.text.replace(' ','').zfill(2)) if j == 0 else items.append(t.text.replace(' ',''))
            if len(items) != 0: ydata.append(items)
    createcsv(ydata, y)




