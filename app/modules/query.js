const { getTwoWeekDate } = require('./leapyearchk');
const lyc = require('./leapyearchk');

async function getHourly(db, key, lastkey) {

    const ret = [];

    return ret

}

exports.getLowTide = async function (db, key) {
    return await db.all(`select time, tide from lowtide where date=?`, [key]);
}

exports.getHighTide = async function (db, key) {
    // console.log(await db.all(`select date, time, tide from hightide where date=?`, [key]));
    return await db.all(`select time, tide from hightide where date=?`, [key]);
}

exports.getHourly = async function(db, key, lastkey) {
    return await db.all(`select time, tide from hourly where date=? or date= ? limit 25`,
    [key, lastkey]);
}

exports.getKaihoHourly = async function(db, key, lastkey) {
    return await db.all(`select time, tide from kaiho_hourly where date=? or date= ? limit 25`,
    [key, lastkey]);
}
exports.getWeekly = async function(db, key) {
    const TwoWeeksLater = getTwoWeekDate(key);
    return await db.all(`select date,  where date>=? and date<?`, [key, TwoWeeksLater]);
    
}

exports.getmonthly = async function (db, key, mode='kaiho') {
    const word = key.slice(0,8)+'%'
    if (mode === 'kaiho') return await db.all(`select * from kaiho_tideName where date like ?`, [word]);
    if (mode === 'moon_age') {
        const ages = await db.all(`select date, moon_age from moonrise_moonset where date like ?`, [word]);
        const ret = ages.map(x => {
            const round_down = Math.round(x.moon_age);
            return {'date':x.date, 'name':getName(round_down), 'age':round_down}
        });
        // console.log(ret)
        return ret
    }
}

function getName (age) {
    if ((age <= 2 || age >= 29) ||
        (age >= 14 && age <= 17)) {
        return `大潮`
    }else if ((age >= 3 && age <= 6) ||
            (age >= 12 && age <=13) ||
            (age >= 18 && age <=21) ||
            (age >= 27 && age <= 28)) {
        return `中潮`
    }else if ((age >= 7 && age <= 9) || 
            (age >= 22 && age <= 24)) {
        return `小潮`
    }else if (age == 10 || age == 25) {
        return `長潮`
    }else if (age == 11 || age == 26) {
        return `若潮`
    }
}

exports.getTideNameKaiho = async function (db, key, span = 1) {
    if (1 !== span){
        return await db.all(`select date, name from kaiho_tideName where date>=? limit ?`, [key, span]);
    } else {
        return await db.all(`select date, name from kaiho_tideName where date=? `, [key]);
    }
}

exports.getTideNameKaiho = async function (db, key, span = 1) {
    if (1 !== span){
        console.log(key)
        return await db.all(`select date, name from kaiho_tideName where date>=? and date<=? limit ?`, [key, key+`-${span}`, span]);
    } else {
        return await db.all(`select date, name from kaiho_tideName where date=? `, [key]);
    }
}

exports.getWestCommutation = async function (db, key) {
    return await db.all(`select date, commutation_time, fastest_time, speed from west_commutation where date=?`, [key]);
}

exports.getEastCommutation = async function (db, key) {
    return await db.all(`select date, commutation_time, fastest_time, speed from east_commutation where date=?`, [key]);
}

exports.getLowTideKaiho = async function (db, key) {
    return await db.all(`select time, tide from kaiho_lowtide where date=?`, [key]);
}

exports.getHighTideKaiho = async function (db, key) {
    // console.log(await db.all(`select date, time, tide from hightide where date=?`, [key]));
    return await db.all(`select time, tide from kaiho_hightide where date=?`, [key]);
}

exports.getWeather = async function (db, key) {
    return await db.all(`select time, temp, weather, wind_speed, wind_direction, icon from weather where date=?`, [key]);
}

