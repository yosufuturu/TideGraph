
import { parseDate } from './date.js';
/** Constants */
const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];       /* Define day of week. */
const today = new Date();                                             /* Get today object */
let showDate = new Date(today.getFullYear(), today.getMonth(), 1);    /* Declare a date object to display */


(() => {
    init_addEvents();

})();


async function showProcess(date) {

    let year = date.getFullYear();
    let month = date.getMonth();

    let [calendar] = document.getElementsByClassName('board-month');
    // console.log(calendar)

    let [calObj] = document.getElementsByClassName('cal_object');
    if (calObj) calObj.remove()

    calendar.appendChild(await createProcess(year, month));

}

async function createProcess(year, month) {
    let [param] = document.getElementsByClassName('param_start');
    let [title] = document.getElementsByClassName('month_title');
    title.innerHTML = `${year}年 ${month + 1}月`;


    const calElement = document.createElement('table');
    calElement.classList.add('cal_object');

    /** get week */
    let calendar = "<thead><tr class='dayOfWeek'>";
    for (let i = 0; i < week.length; i++) {
        calendar += "<th>" + week[i] + "</th>";
    }

    calendar += "</tr></thead>";


    let count = 0;
    let days_count = 0;
    let startDayOfWeek = new Date(year, month, 1).getDay();
    let endDate = new Date(year, month + 1, 0).getDate();
    let lastMonthEndDate = new Date(year, month, 0).getDate();
    let row = Math.ceil((startDayOfWeek + endDate) / week.length);


    calendar += '<tbody id="cal_body">';

    let nameList = await getTideNames(parseDate(new Date(year, month, 1)));
    // console.log(nameList)

    if (`NO_DATA` !== nameList) {
        /** */
        for (var i = 0; i < row; i++) {
            calendar += "<tr>";

            for (var j = 0; j < week.length; j++) {
                if (i == 0 && j < startDayOfWeek) {

                    /** Set the date of last month up to 1st in the first line */
                    calendar += `<td><div id="dis_before_day_${lastMonthEndDate - startDayOfWeek + j + 1}" class="disabled">${lastMonthEndDate - startDayOfWeek + j + 1}</div></td>`;
                }
                else if (count >= endDate) {
                    /** After the last day, the date of the next month is displayed */
                    count++;
                    calendar += `<td><div id="dis_next_day_${count - endDate}" class="disabled">${count - endDate}</div></td>`;
                }
                else {
                    count++;
                    /** Set the date of the current month for the day of the week */
                    if (year == today.getFullYear() && month == (today.getMonth()) && count == today.getDate()) {
                        calendar += `<td class="today_effect"><div id="day_"${count}">${count} ${nameList[days_count]['name']}</div></td>`;
                        days_count++
                    }
                    else {
                        calendar += `<td><div id=day_${count} class="days">${count} ${nameList[days_count]['name']}</div></td>`;
                        days_count++
                    }
                }
            }

            calendar += "</tr>";
        }
    } else {
        /** */
        for (var i = 0; i < row; i++) {
            calendar += "<tr>";

            for (var j = 0; j < week.length; j++) {
                if (i == 0 && j < startDayOfWeek) {

                    /** Set the date of last month up to 1st in the first line */
                    calendar += `<td><div id="dis_before_day_${lastMonthEndDate - startDayOfWeek + j + 1}" class="disabled">${lastMonthEndDate - startDayOfWeek + j + 1}</div></td>`;
                }
                else if (count >= endDate) {
                    /** After the last day, the date of the next month is displayed */
                    count++;
                    calendar += `<td><div id="dis_next_day_${count - endDate}" class="disabled">${count - endDate}</div></td>`;
                }
                else {
                    count++;
                    /** Set the date of the current month for the day of the week */
                    if (year == today.getFullYear() && month == (today.getMonth()) && count == today.getDate()) {
                        calendar += `<td class="today_effect"><div id="day_"${count}">${count}</div></td>`;
                        days_count++
                    }
                    else {
                        calendar += `<td><div id=day_${count} class="days">${count}</div></td>`;
                        days_count++
                    }
                }
            }

            calendar += "</tr>";
        }
    }

    calendar += "</tbody>";
    calElement.innerHTML = calendar;


    return calElement;


}

function init_addEvents() {
    /* Adding an event listener to the element with the id of 'beforeMonth'. When the element is
    clicked, the function beforeMonth() is called. */

    const [B_btn] = document.getElementsByClassName('B_month');
    const [N_btn] = document.getElementsByClassName('N_month');

    B_btn.addEventListener('click', () => {
        beforeMonth();
    });

    N_btn.addEventListener('click', () => {
        nextMonth();
    });

}

async function getTideNames(param) {
    let url = '/tidename?date=' + param;
    try {
        const fetchPromise = await fetch(url);
        const data = await fetchPromise.json();

        if (0 === data.length) return 'NO_DATA'
        console.log(data)

        return data

    }
    catch (err) {
        console.log(err);
    }

}

function beforeMonth() {
    showDate.setMonth(showDate.getMonth() - 1);
    showProcess(showDate);
}

function nextMonth() {
    showDate.setMonth(showDate.getMonth() + 1);
    showProcess(showDate);
}

export { showProcess }

