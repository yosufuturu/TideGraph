
const SVG_VER = 'http://www.w3.org/2000/svg';
const Graph_GB = '#2f3136';


function drawLine(e, dataset) {

    const del = document.querySelectorAll(`.${dataset.resource}-line`);
    del.forEach((e) => e.remove());

    let linedata = [];

    dataset.hourly.forEach((e) => linedata.push([e[0].slice(0,2), parseInt(e[1], 10)]));
    
    if ('JMA' === dataset.resource) {
        dataset.lowtide.forEach((e) => linedata.push(e));
        dataset.hightide.forEach((e) => linedata.push(e));
    }

    const gl = document.createElementNS(SVG_VER, 'path');
    gl.setAttribute('class', `${dataset.resource}-line`)
    gl.setAttribute('d', makeGraphLine(linedata.sort()));
    gl.setAttribute('fill', 'none');
    
    e.appendChild(gl);

}

function makeCommutationLine(value) {

    const [h,m] = value.split(':');
    // (parseInt(h, 10)*20)+st+parseInt(m, 10)/3
    return `M ${parseInt(h, 10)*20 + parseInt(m, 10)/3 + 50} 100 V 380`
}

function makeGraphLine(data) {
    const reg = new RegExp(":");
    let st = 50;
    let d = 'M ' + st + ' ';
    let cnt = 1;


    for (const [i, x] of data.entries()) {
        if (i === 0) {
            d+= 320-x[1] + ' '
        } else if (reg.test(x[0])) {
            let [h,m] = x[0].split(':');
            let peakpoint = (parseInt(h, 10)*20)+st+parseInt(m, 10)/3;
            d += 'L '+ peakpoint + ' ' + (320-x[1]) + ' ';
        } else {
            d += 'L ' + ((cnt*20)+st) + ' ' + (320-x[1]) + ' ';
            cnt++;
        }
    }

    return d
}

function drawGraph(e, dataset) {

    
    drawCommutation(e, dataset.westCommutation, dataset.eastCommutation, 'east');


}

function drawCommutation(e, resource, point, dir) {
    const a = [...point, ...resource].sort()
    
    const b = [[50, ''], ...a.map((x) => {
        const [h,m] = x[0].split(':');
        const st = 50 + (parseInt(h, 10)*20)+parseInt(m, 10)/3;
        return [st, x[1]]
    })];

    const c = b.map((x, i) => {
        if (i===0) {
            return [`M 50 300 H ${b[1][0]}`, b[1][0] === 'west' ? 'east' : 'west']
        } else if (i===b.length-1) {
            return [`M ${x[0]} 300 H 530`, x[1]]
        } else {
            return [`M ${x[0]} 300 H ${b[i+1][0]}`, x[1]]
        }
    });

    c.forEach((x) => {
        const bar = document.createElementNS(SVG_VER, 'path');
        bar.setAttribute('class', `${x[1]}-commutation`);
        bar.setAttribute('d', x[0]);
        bar.setAttribute('fill', 'none');
        e.appendChild(bar);
    });
}

function wind(e, dataset) {
    
    const temp_start = 72;

    const weather_items = document.querySelectorAll('.weather_items');
    const hide = document.querySelectorAll('.nodata-hide');
    const [message] = document.querySelectorAll('.message');

    hide.forEach(x => {
        x.classList.remove('hide')
    });
    weather_items.forEach(x => x.remove());

    if (message !== undefined) message.remove();
    

    if (8 === dataset.weather.length) {
        for(let x of Object.values(dataset)) {
            x.forEach((a, i) => {

                const weather_icon = document.querySelector(`.w${i}`);
                weather_icon.setAttribute('xlink:href', getWeatherIcon(a.icon));
                // console.log(a.weather)

                const temp = document.createElementNS(SVG_VER, 'text');
                temp.setAttribute('x', temp_start +(60*i));
                temp.setAttribute('y', 482);
                temp.textContent = `${a.temp}℃`;
                temp.classList.add('text-color');
                temp.classList.add('weather_items');
                e.appendChild(temp);
                
                const wind_speed = document.createElementNS(SVG_VER, 'text');
                wind_speed.setAttribute('x', 72+(60*i));
                wind_speed.setAttribute('y', 518);
                wind_speed.textContent = a.wind_speed+'';
                wind_speed.classList.add('text-color');
                wind_speed.classList.add('weather_items');
                e.appendChild(wind_speed);
                
                const wind_dir = document.querySelector(`.com${i}`);
                wind_dir.setAttribute('transform', `rotate(${a.wind_direction},${81+(60*i)},551)`);
                
                const wind_dir_text = document.createElementNS(SVG_VER, 'text');
                wind_dir_text.setAttribute('x', 59+(60*i));
                wind_dir_text.setAttribute('y', 576);
                wind_dir_text.textContent = getAzimuth(a.wind_direction);
                wind_dir_text.classList.add('text-color');
                wind_dir_text.classList.add('weather_items');
                e.appendChild(wind_dir_text);
                
            })
        }
    } else {
        const nodata = document.createElementNS(SVG_VER, 'text');
        nodata.setAttribute('x', 193);
        nodata.setAttribute('y', 512);
        nodata.setAttribute('font-size', 28);
        nodata.setAttribute('fill', 'RGB(249,249,255)');
        nodata.classList.add('message');
        nodata.textContent = '気象データなし';

        const wind_icon = document.querySelectorAll('.wind_icon');
        const weather_icon = document.querySelectorAll('.weather_icon');

        weather_items.forEach(x => x.classList.add('hide'));
        weather_icon.forEach(x => x.classList.add('hide'));
        wind_icon.forEach(x => x.classList.add('hide'));
        e.appendChild(nodata);
    }

    
}

function drawSunLine (data) {
    const [sunline] = document.getElementsByClassName('sun-line');
    const [sun_line_icon] = document.getElementsByClassName('sun-line-icon');
    const [riseTime] = document.getElementsByClassName('sun-rise');
    const [setTime] = document.getElementsByClassName('sun-set');

    const begin = 50 + calcPoint(data.rise);
    const end = 50 + calcPoint(data.set);
    const middle = (end - begin)+50;

    sunline.setAttribute('d', `M ${begin} 90 H ${end} M ${begin} 85 v 10 M ${end} 85 v 10`)
    sun_line_icon.setAttribute('x', middle - 18)

    riseTime.textContent = data.rise;
    // riseTime.setAttribute('x', begin - 40);
    riseTime.setAttribute('x', begin+4);
    riseTime.setAttribute('y', 80);
    
    setTime.textContent = data.set;
    // setTime.setAttribute('x', end + 10);
    setTime.setAttribute('x', end - 40);
    setTime.setAttribute('y', 80);

}

function calcPoint(data){
    const [h,m] = data.split(':');
    return (h*20)+(m*20/60)
}


function getAzimuth(deg) {
    if (11.25 > deg || (348.75 <= deg && 360 > deg)) {return '　北　'}
    else if (11.25 <= deg && 33.75 > deg) {return   '北北東'}
    else if (33.75 <= deg && 56.25 > deg) {return   '北　東'}
    else if (56.25 <= deg && 78.75 > deg) {return   '東北東'}
    else if (78.75 <= deg && 101.25 > deg) {return  '　東　'}
    else if (101.25 <= deg && 123.75 > deg) {return '東南東'}
    else if (123.75 <= deg && 146.25 > deg) {return '南　東'}
    else if (146.25 <= deg && 168.75 > deg) {return '南南東'}
    else if (168.75 <= deg && 191.25 > deg) {return '　南　'}
    else if (191.25 <= deg && 213.75 > deg) {return '南南西'}
    else if (213.75 <= deg && 236.25 > deg) {return '南　西'}
    else if (236.25 <= deg && 258.75 > deg) {return '西南西'}
    else if (258.75 <= deg && 281.25 > deg) {return '　西　'}
    else if (281.25 <= deg && 303.75 > deg) {return '西北西'}
    else if (303.75 <= deg && 326.25 > deg) {return '北　西'}
    else if (326.25 <= deg && 348.75 > deg) {return '北北西'}
    else {return 'err'}
}

function getWeatherIcon(icon) {
    // console.log(icon)
    if ('01d' === icon || '01n' === icon) return 'clear.svg'
    if ('02d' === icon || '02n' === icon) return 'sun_clouds.svg'
    if ('03d' === icon || '03n' === icon) return 'clouds.svg'
    if ('04d' === icon || '04n' === icon) return 'broken_cloud.svg'
    if ('10d' === icon || '10n' === icon
     || '09n' === icon || '09n' === icon) return 'rain.svg'
    if ('11d' === icon || '11n' === icon) return 'thubderstorm.svg'
    if ('13d' === icon || '13n' === icon) return 'snow.svg'

    return 'hatena.svg'
}

function notEnoughData() {

   document.querySelector(`.JMA-line`).remove();
   document.querySelector(`.JCG-line`).remove();

   let [low_data] = document.getElementsByClassName('low-time');
    let [heigh_data] = document.getElementsByClassName('high-time');
    let [east_data] = document.getElementsByClassName('east-time');
    let [west_data] = document.getElementsByClassName('west-time');

    low_data.innerHTML = '-- : --';
    heigh_data.innerHTML = '-- : --';
    east_data.innerHTML = '-- : --';
    west_data.innerHTML = '-- : --';


    const [riseTime] = document.getElementsByClassName('sun-rise'); 
    const [setTime] = document.getElementsByClassName('sun-set');
    riseTime.textContent = '-- : --';
    setTime.textContent = '-- : --';
}

export {drawLine, drawGraph, wind, drawSunLine, notEnoughData}
