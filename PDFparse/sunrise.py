import requests
import csv
from bs4 import BeautifulSoup

sun_url = 'https://eco.mtk.nao.ac.jp/koyomi/dni/'#2023/s41'#s4103.html'

year = ['2022','2023']
month = [str(i).zfill(2) for i in range(1,13)]


def createcsv(data, year):
    with open('outputs/'+ year + '_sunrise_sunset.csv', mode='w') as csvfile:

        fieldname = ['date', 'sunrise', 'sunrise_direction', 'culmination', 'altitude', 'sunset', 'sunset_direction']
        writer = csv.DictWriter(csvfile, fieldname)
        writer.writeheader()

        for a in data:
            writer.writerow({
                    'date':a[0], 'sunrise':a[1], 'sunrise_direction':a[2], 'culmination':a[3], 'altitude':a[4], 'sunset':a[5], 'sunset_direction':a[6]
                })  
        csvfile.close()

for y in year:
    ydata = []
    for i in month:
        r = requests.get(sun_url + y + '/s41' + i + '.html')
        soup = BeautifulSoup(r.content, "html.parser")
        
        for e in soup.find_all('tr'):
            items = []
            for j, t in enumerate(e.find_all('td')):
                items.append(str(y) + '-' + str(i) + '-' + t.text.replace(' ','').zfill(2)) if j == 0 else items.append(t.text.replace(' ',''))
            if len(items) != 0: ydata.append(items)
    createcsv(ydata, y)




