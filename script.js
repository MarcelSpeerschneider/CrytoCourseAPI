const API_KEY_EXCHANGE = "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=EUR&apikey=NOQKRPKJ3N0WC2EF";
const API_KEY_MONTHLY = "https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_MONTHLY&symbol=BTC&market=EUR&apikey=NOQKRPKJ3N0WC2EF";
const Monthly_JSN = "./jsn.json";
let responseJSN = '';
let responseJSNExchange = '';
let responseJSNChart = '';
let courseDates = [];
let coursePrices = [];
let matchedArray = [];

async function init() {
    // await getCurrentCourse();
    // await showCurrentCourse();
   await getMonthlyCourse();
   await getMonthlyPrice();
   await getMonthlyDate();
   await matchDatePrice();
   await getCurrentPrice();
   makeChart();
}

// async function getCurrentCourse() {
//     try {
//         let response = await fetch(API_KEY_EXCHANGE);
//         responseJSN = await response.json();
//     }
//     catch (error) {
//         error.log('Der Fehler ist:', error);
//     }
// }

// async function showCurrentCourse() {
//     if (responseJSN['Realtime Currency Exchange Rate']['5. Exchange Rate']) {
//         let currentCourse = await responseJSN['Realtime Currency Exchange Rate']['5. Exchange Rate'];
//         let currentCourseNumber = Number(currentCourse).toFixed(2);
//         document.getElementById('course').innerHTML = `<b>${currentCourseNumber} EUR</b>`;
//     }
//     else {
//         console.log('Fehler');
//     }

// }


async function getMonthlyCourse() {
    try {
        let response = await fetch(Monthly_JSN);
        responseJSNChart = await response.json();
    }
    catch (error) {
        error.log('Der Fehler ist:', error);
    }
    
}

async function getMonthlyPrice() {
    let CourseHistory = await responseJSNChart['Time Series (Digital Currency Monthly)'];
    let openPrices = [];
    for (let date in CourseHistory) {
        openPrices[date] = CourseHistory[date]['1b. open (USD)'];
        coursePrices.push(openPrices[date]);
    }
}

async function getMonthlyDate() {
    let dates = await responseJSNChart['Time Series (Digital Currency Monthly)'];
    for (let date in dates) {
        courseDates.push(date);
    }
    console.log(courseDates);
  
}

function matchDatePrice() {
    for (let i = 0; i < courseDates.length; i++) {
        let obj = {};
        obj[courseDates[i]] = coursePrices[i];
        matchedArray.push(obj);
    }
}
function getCurrentPrice() {
    document.getElementById('course').innerHTML = `${(Number(coursePrices[0]).toFixed(2))} EUR`;
}

function makeChart() {
    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: courseDates,
            datasets: [{
                label: 'Bitcoin Price',
                data: coursePrices,
                borderColor: '#FF6384',
                borderWidth: 1,
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Bitcoin Kurs',
                        }
                    }
                }
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    // reverse: true
                },
                x: {
                    reverse: true
                }
            }
        }
    });
}