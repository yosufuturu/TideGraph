import requests
import json

API_KEY = 'Your_API_KEY'

# 公園の位置情報
lat = 33.947671116567534
lon = 130.81158291379234

url = f'https://api.openweathermap.org/data/2.5/forecast/?lat={lat}&lon={lon}&appid={API_KEY}'


res = requests.get(url).content
data = json.loads(res.decode('utf-8'))

