/**
 * If the date is February 28th, then if it's a leap year, return the next day, otherwise return March
 * 1st. If the date is December 31st, return January 1st of the next year. If the date is the last day
 * of any other month, return the first day of the next month. Otherwise, return the next day
 * @param data - the date in the format of YYYY-MM-DD
 * @returns The next day's date in the format YYYY-MM-DD
 */
exports.leapYearCheck = function(data) {
    let r = new RegExp('-31$|-30$|02-29');
    let feb = new RegExp('02-28');
    let newyeareve = new RegExp('12-31');
    let leap_flag = false;

    let ret = '';

    
    if (feb.test(data)) {
        ret = data.split('-').map((e,i)=>{
        if (i===0) {
            if (parseInt(e)%100===0 ) {
                if (parseInt(e)%400===0) leap_flag = true;
            } else {
                if (parseInt(e)%4===0) leap_flag = true;
            }
            return e
        } else if (i === 1) {
            if (leap_flag) {return e} else {return ('00'+(parseInt(e)+1)).slice(-2)};
        } else if (i === 2) {
            if (leap_flag) {return '29'} else {return '01'}
        }
        }).join('-');

    } else if(newyeareve.test(data)) {
        ret = data.split('-').map((e,i)=>i==0?parseInt(e)+1:'01').join('-');

    } else if (r.test(data)) {
        ret = data.split('-').map((e,i)=>i===1?('00'+(parseInt(e)+1)).slice(-2):i===2?'01':e).join('-');

    } else {
        ret = data.split('-').map((e,i)=>i===2?('00'+(parseInt(e)+1)).slice(-2):e).join('-');
    }

    return ret
};

exports.getNextDate = function (data) {

    let dateobj = new Date(data);
    dateobj.setDate(dateobj.getDate()+1);

    let ret = dateobj.getFullYear() +'-'+ ('00'+(dateobj.getMonth()+1)).slice(-2) +'-'+ ('00'+dateobj.getDate()).slice(-2);
    return ret
};
exports.getBeforeDate = function (data) {

    let dateobj = new Date(data);
    dateobj.setDate(dateobj.getDate()-1);

    let ret = dateobj.getFullYear() +'-'+ ('00'+(dateobj.getMonth()+1)).slice(-2) +'-'+ ('00'+dateobj.getDate()).slice(-2);
    return ret
};
exports.getTwoWeekDate = function (data) {

    let dateobj = new Date(data);
    dateobj.setDate(dateobj.getDate()+14);

    let ret = dateobj.getFullYear() +'-'+ ('00'+(dateobj.getMonth()+1)).slice(-2) +'-'+ ('00'+dateobj.getDate()).slice(-2);
    return ret
};