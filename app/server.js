


/** Modules */  
const express = require('express');
const app = express();
const url = require('url');
const lyc = require('./modules/leapyearchk');
const query = require('./modules/query');

// sqlite
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');


app.get('/api', async (req, res) => {
    let param = new URLSearchParams(url.parse(req.url).query);
    let key = param.get('date');
    let lastkey = lyc.getNextDate(key);
    

    const dataset = {};

    try {
        const db = await sqlite.open({
            filename: '../db/tide.db',
            driver: sqlite3.Database
        });

        /* The above code is getting the hourly data, high tide data, and low 
           tide data from the database. */
        const hourlyset = await query.getHourly(db, key, lastkey);
        hourlyset[hourlyset.length-1]['time'] = '24:00';
        const kaihohourlyset =  await query.getKaihoHourly(db, key, lastkey);
        kaihohourlyset[kaihohourlyset.length-1]['time'] = '24:00';
        const highTideSet = await query.getHighTide(db, key);
        const lowTideSet = await query.getLowTide(db, key);
        
        const westCommutationSet = await query.getWestCommutation(db, key);
        const eastCommutationSet = await query.getEastCommutation(db, key);
        const kaiholowTideSet = await query.getLowTideKaiho(db, key);
        const kaihohighTideSet = await query.getHighTideKaiho(db, key);
        const weatherSet = await query.getWeather(db, key);
        const kaihoTideName = await query.getTideNameKaiho(db, key);
        // console.log(await query.getmonthly(db, key, 'moon_age')); 
        // await query.getmonthly(db, key, 'moon_age')

        row = await db.get(`select
                moonrise_moonset.date,
                sunrise_sunset.sunrise, sunrise_sunset.sunset, 
                moonrise_moonset.moon_age
                from moonrise_moonset 
                inner join sunrise_sunset on moonrise_moonset.date=sunrise_sunset.date 
                where moonrise_moonset.date= ?`,
            [key]);
            
            dataset[key] = {
                date: row['date'],
                sun: {
                    sunrise: row['sunrise'],
                    sunset: row['sunset']
                },
                moon: {
                    moon_age: row['moon_age']
                }
            }

            dataset[key]['hourly'] = hourlyset;
            dataset[key]['kaihohourly'] = kaihohourlyset;
            dataset[key]['hightide'] = highTideSet;
            dataset[key]['lowtide'] = lowTideSet;
            dataset[key]['westCommutation'] = westCommutationSet;
            dataset[key]['eastCommutation'] = eastCommutationSet;
            dataset[key]['kaiholowtide'] = kaiholowTideSet;
            dataset[key]['kaihohightide'] = kaihohighTideSet;
            dataset[key]['weather'] = weatherSet;
            dataset[key]['kaihoTideName'] = kaihoTideName;

            // console.dir(dataset, {depth:3});
            res.end(JSON.stringify(dataset));
            // console.log(key);
    } catch (err) {
        console.log(err);
        res.end(JSON.stringify({ 'message': '死にました' }));
    }

});

app.get('/tidename', async (req, res) => {
    const db = await sqlite.open({
        filename: '../db/tide.db',
        driver: sqlite3.Database
    });

    let param = new URLSearchParams(url.parse(req.url).query);
    let key = param.get('date');
    let days = new Date(key.split('-')[0], key.split('-')[1],0);
    let ret = await query.getTideNameKaiho(db, param.get('date').slice(0,7), days.getDate())
    // console.log(ret);

    res.end(JSON.stringify(ret));

    

    const dataset = {};
});

app.use(express.static('img'));

app.use(express.static('public'));

app.listen(8000, () => {
    console.log('Running server...')
});

/** end of file */