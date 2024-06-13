import requests
import bs4
import datetime as dt
import re
import csv

getyear = ['2021', '2022', '2023']
AreaCode = ['N1']

def getTideTXT():
    for y in getyear:
        for area in AreaCode:
            url = 'https://www.data.jma.go.jp/gmd/kaiyou/data/db/tide/suisan/txt/'+ y + '/' + area +'.txt'
            file = 'data/' + y + '_' + area + '_TideData.txt'

            urlData = requests.get(url).content

            with open(file, mode='wb') as f:
                f.write(urlData)
                
def getpdf():
    url = 'https://www6.kaiho.mlit.go.jp/kanmon/info/tab/marine_guide_data/2023/marine_01.pdf'

    file = 'data/pdf1.pdf'

def getKaiho(year):
     
    date = dt.date(year, 1, 1)
    days =  (dt.date(year+1, 1, 1) - date).days
    datalist = []
    file = f'outputs_kaiho/hourlytide_{year}.csv'
    for i in range(days):
        url = f'https://www1.kaiho.mlit.go.jp/KANKYO/TIDE/cgi-bin/tide_pred.cgi?area=4012&back=../tide_pred/3.htm&year={date.year}&month={date.month}&day={date.day}&btn=ForAreaWindow_Japanese'


        soup = bs4.BeautifulSoup(requests.get(url).content, 'html.parser')
        element = soup.find_all('table')[1]
        rows = element.find_all('b')

        daily = []
        cnt=0

        for row in rows:
            if bool(re.search(r'\d+', row.text)):                
                [daily.append({'date':date.strftime('%Y-%m-%d'), 'time':f'{cnt:02}:00', 'code':'yahata', 'tide':x}) for x in row.text.split()]
                cnt+=1

        datalist.append(daily)

        date = date + dt.timedelta(days=1)


    FIELD_NAME = ['date','time', 'code', 'tide']
    with open(file, mode='w') as f:
        
        writer = csv.DictWriter(f, FIELD_NAME)
        writer.writeheader()

        for i in datalist:
            [writer.writerow(x) for x in i]

getKaiho(2023)