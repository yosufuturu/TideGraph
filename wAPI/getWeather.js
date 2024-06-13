const fs = require('fs');
const fetch = require('node-fetch');
const cron = require('node-cron');

// sqlite
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

async function callAPI() {
    
    const API_KEY = 'Your_API_KEY';

    // 公園位置情報
    const lat = 33.90569846270197;
    const lon = 130.88351215914946;
    const url = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

const now = new Date()

    try {
        const res = await fetch(url);
        const data = await res.json();

        recordLog('Success API requests: ' + now + '\n');

        const test = data.list.map((x) => {
            let dd = new Date(x.dt * 1000);
            const date = `${dd.getFullYear()}-${('00'+(dd.getMonth()+1)).slice(-2)}-${('00'+dd.getDate()).slice(-2)}`;
            const time = `${('00'+dd.getHours()).slice(-2)}:${('00'+dd.getMinutes()).slice(-2)}`;
            const temp = Math.round(x.main.temp - 273);
            const weather = x.weather.map(e => e.main).join('')
            const weather_icon = x.weather.map(e => e.icon).join('')
            const wind_speed = x.wind.speed;
            const wind_direction = x.wind.deg;
    
            return [date+' '+time, date, time, temp, weather, wind_speed, wind_direction, weather_icon]
        });

        try {
            const db = await sqlite.open({
                filename: '../db/tide.db',
                driver: sqlite3.Database
            });
            
            await registed(db, test);
            
    
        } catch (err) {
            console.log(err);
        }
    
    } catch(err) {
        recordLog('Failed Fetch: ' + now + '\n' + err + '\n');
    }


    


}

async function registed(db, values) {
    try {
        
        const now = new Date()

        for (let i = 0; i < values.length; i++) {
            /** 0: datetime 1:date 2:time 3:temp 
              * 4:weather 5:wind_speed 6:wind_direction */ 
            await db.all(`replace into weather values(?, ?, ?, ?, ?, ?, ?, ?)`,
            [values[i][0], values[i][1], values[i][2], values[i][3],
             values[i][4], values[i][5], values[i][6], values[i][7]]);
        }
        recordLog('Success Data registed: ' + now + '\n');
    } catch (err){
        console.log(err);
        recordLog('Failed Data registed: ' + now + '\n' + err + '\n');
    }

}

function main(){
    const data = callAPI()
}

callAPI()
cron.schedule('0 0 */1 * * *', () => {
    main();
    
});


function recordLog(log) {
    fs.appendFileSync('weatherAPI.log', log, 'utf-8');
}