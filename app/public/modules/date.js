
function getBeforeDate(data){
    let dateobj = new Date(data);
    dateobj.setDate(dateobj.getDate()-1);
    return dateobj
}

function getNextDate(data){
    let dateobj = new Date(data);
    dateobj.setDate(dateobj.getDate()+1);
    return dateobj
}

function parseDate(dateobj, mode = 'key') {
    if ('key' === mode) {
        return dateobj.getFullYear() +'-'+ ('00'+(dateobj.getMonth()+1)).slice(-2) +'-'+ ('00'+dateobj.getDate()).slice(-2);
    }
    if ('value' === mode) {
        return [dateobj.getFullYear(), ('00'+(dateobj.getMonth()+1)).slice(-2), ('00'+dateobj.getDate()).slice(-2)] 
    }
    if('text' === mode) {
        const weekday = new Intl.DateTimeFormat('ja-JP', {weekday:"short"}).format(dateobj);
        return `${dateobj.getFullYear()}年${(dateobj.getMonth()+1)}月${dateobj.getDate()}日(${weekday}) `;
    }
}

export {getBeforeDate, getNextDate, parseDate}