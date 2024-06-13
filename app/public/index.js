
/** import modules */
import {createMoonIcon} from './modules/moon.js';
import {drawLine, drawGraph, wind, drawSunLine, notEnoughData} from './modules/graph.js';
// import {setNextButton} from './modules/button.js';
import {getBeforeDate, getNextDate, parseDate} from './modules/date.js';
import { showProcess } from './modules/calendar.js';


/** Grobal variable */
let [button] = document.getElementsByClassName('button');


let [result] = document.getElementsByClassName('result');
let [param_start] = document.getElementsByClassName('param_start');
let [Graph_svg] = document.getElementsByClassName('svgg');
let [gl_svg] = document.getElementsByClassName('men');

// Initialize Settings
(() => {
    let today = new Date();    /* get today's date */
    let today_value = parseDate(today);
    let [date_text] = document.getElementsByClassName('today');
    
    /** get Element */
    const [month_cal] = document.getElementsByClassName('month_cal');
    const [daily_tide] = document.getElementsByClassName('daily_tide');
    const [board] = document.getElementsByClassName('board-daiy');
    const [board_month] = document.getElementsByClassName('board-month');
    param_start.value = today_value;
    date_text.value = today_value;

    /** Add function: mode change daily to month */
    month_cal.addEventListener('click', () => {
        const value = new Date(param_start.value)
        
        /** hide tide graph */
        month_cal.classList.add('hide');
        board.classList.add('hide');
        daily_tide.classList.remove('hide');
        board_month.classList.remove('hide');
       
        /** show calendar */
        showProcess(value)
    });

    /** Add function
     *  mode change monthly to daily */
    daily_tide.addEventListener('click', () => {
        
        /** hide calendar and show graph */
        month_cal.classList.remove('hide');
        board.classList.remove('hide');
        daily_tide.classList.add('hide');
        board_month.classList.add('hide');
    });
    
    button.addEventListener('click', () => {
        getinfo(param_start.value);
    });
    
    /** set before day button */
    let [before] = document.getElementsByClassName('before-date');
    setBeforeButton(before, param_start);
    
    /** set next day button */
    let [next] = document.getElementsByClassName('next-date');
    setNextButton(next, param_start);


    getinfo(param_start.value);

})();


async function getinfo(param) {
    let url = '';
    param != '' ? url = '/api?date=' + param : url = '/api?date=2023-01-01';
    try {
        const response = await fetch(url);
        const data = await response.json();

        formatdata(data, result);

    }
    catch (err) {
        console.log(err);
    }
}



function formatdata(rows, result){

    let [headline] = document.getElementsByClassName('headline');
    let [date_text] = document.getElementsByClassName('today');
    const JMA_data = {'resource':'JMA'};
    const JCG_data = {'resource':'JCG'};
    const Sun = {}
    const weatherData = {};
    let moon_age = 0;

    const [conf] = document.getElementsByClassName('container');
    const [moonIcon] = document.getElementsByClassName('moonIcon');
    const summry = document.createElement('div');

    try {

        for (let x of Object.values(rows)){
            
            moon_age = x.moon.moon_age;
            
            /* Creating a graph data. */
            JMA_data['hourly'] = x.hourly.map((e) => [e.time, parseInt(e.tide, 10)]);
            JMA_data['lowtide'] = x.lowtide.map((e) => [e.time, parseInt(e.tide, 10)]);
            JMA_data['hightide'] = x.hightide.map((e) => [e.time, parseInt(e.tide, 10)]);
            
            
            const p = new RegExp('^([0-2][0-9]):([0-5][0-9])$');
            JCG_data['hourly'] = x.kaihohourly.map((e) => [e.time, parseInt(e.tide, 10)]);
            JCG_data['lowtide'] = x.kaiholowtide.map((e) => [e.time, parseInt(e.tide, 10)]);
            JCG_data['hightide'] = x.kaihohightide.map((e) => [e.time, parseInt(e.tide, 10)]);
            JCG_data['westCommutation'] = x.westCommutation.filter((e) => p.test(e.commutation_time)).map(e => [e.commutation_time, 'west']);
            JCG_data['eastCommutation'] = x.eastCommutation.filter((e) => p.test(e.commutation_time)).map(e => [e.commutation_time, 'east']);
            
            Sun['rise'] = x.sun.sunrise;
            Sun['set'] = x.sun.sunset;
            
            weatherData['weather'] = x.weather;
            
            /* Creating a headline. */
            /** 配列では引数にならないのでスプレッド構文で展開 */
            test(x.date)
            let tmp = new Date(x.date);
            
            date_text.innerHTML = parseDate(tmp, 'text') + `<p class="tidename">${x.kaihoTideName.map(e => e.name).pop()}</p>`;
            date_text.value = parseDate(tmp, 'key');
            
        }
        
        
        for (let x of Object.values(JCG_data['lowtide'])) summry.textContent += x[0]
        for (let x of Object.values(JCG_data['hightide'])) summry.textContent += x[0]
        for (let x of Object.values(JCG_data['westCommutation'])) summry.textContent += x[0]
        for (let x of Object.values(JCG_data['eastCommutation'])) summry.textContent += x[0]
        
        
        
        if (moonIcon) moonIcon.remove();
        // conf.prepend(createMoonIcon(moon_age));
        conf.appendChild(createMoonIcon(moon_age));
        
        createSummry(JCG_data['lowtide'],JCG_data['hightide'],JCG_data['westCommutation'],JCG_data['eastCommutation']);
        drawLine(gl_svg, JMA_data);
        drawLine(gl_svg, JCG_data);
        drawSunLine(Sun);
        drawGraph(gl_svg, JCG_data);
        wind(gl_svg, weatherData)
    } catch (error) {
        console.log('hoge')
        notEnoughData()
    }

}


function getTideName(moon_age, mode=1) {
    
    const round_down = Math.round(moon_age);

    if (0 === mode) {
        if ((round_down <= 2 || round_down >= 29) ||
            (round_down >= 14 && round_down <= 17)) {
            return `大潮(月齢:${moon_age})`
        }else if ((round_down >= 3 && round_down <= 6) ||
                  (round_down >= 12 && round_down <=13) ||
                  (round_down >= 18 && round_down <= 21) ||
                  (round_down >= 27 && round_down <= 28)) {
            return `中潮(月齢:${moon_age})`
        }else if ((round_down >= 7 || round_down <= 9) || 
                  (round_down >= 22 || round_down <= 24)) {
            return `小潮(月齢:${moon_age})`
        }else if (round_down == 10 || round_down == 25) {
            return `長潮(月齢:${moon_age})`
        }else if (round_down == 11 || round_down == 26) {
            return `若潮(月齢:${moon_age})`
        }
    } else if (1 === mode) {
        if ((round_down <= 2 || round_down >= 29) ||
            (round_down >= 14 && round_down <= 17)) {
            return `大潮`
        }else if ((round_down >= 3 && round_down <= 6) ||
                  (round_down >= 12 && round_down <=13) ||
                  (round_down >= 18 && round_down <= 21) ||
                  (round_down >= 27 && round_down <= 28)) {
            return `中潮`
        }else if ((round_down >= 7 && round_down <= 9) || 
                  (round_down >= 22 && round_down <= 24)) {
            return `小潮`
        }else if (round_down == 10 || round_down == 25) {
            return `長潮`
        }else if (round_down == 11 || round_down == 26) {
            return `若潮`
        }
    }
    
    return 'no data'
}

function createSummry(low, heigh, west, east) {
    let mode = 'fuge';

    if (mode==='fuge') {
        let [low_data] = document.getElementsByClassName('low-time');
        let [heigh_data] = document.getElementsByClassName('high-time');
        let [east_data] = document.getElementsByClassName('east-time');
        let [west_data] = document.getElementsByClassName('west-time');

        low_data.innerHTML = low.map(x => x[0]).reduce((y, x) => y +'<br>'+ x);
        heigh_data.innerHTML = heigh.map(x => x[0]).reduce((y, x) => y +'<br>'+ x);
        east_data.innerHTML = east.length > 0 ? east.map(x => x[0]).reduce((y, x) => y +'<br>'+ x) : '-';
        west_data.innerHTML = west.length > 0 ? west.map(x => x[0]).reduce((y, x) => y +'<br>'+ x) : '-';
    }
}

function setNextButton(next, st) {
    next.addEventListener('click', ()=>{
        let [date_text] = document.getElementsByClassName('today');
        const ndate = parseDate(getNextDate(st.value), 'key');
        st.value = parseDate(getNextDate(st.value), 'key');
        getinfo(ndate);
    });
}

function setBeforeButton(before, st) {
    before.addEventListener('click', ()=>{
        const bdate = parseDate(getBeforeDate(st.value), 'key');
        st.value = parseDate(getBeforeDate(st.value), 'key');
        getinfo(bdate);
    });
}

/** end of file */

function test(a){console.log(a)}
