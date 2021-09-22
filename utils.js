const debounce = (func, delay = 1000) => {
    let timeOutId;

    return (...args) => {
        if (timeOutId)
            clearTimeout(timeOutId);

        timeOutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

const fetchCityNames = async (searchTerm) => {
    const response = await axios.get('https://api.teleport.org/api/cities/', {
        params: {
            search: searchTerm,
        }
    });

    return response.data._embedded['city:search-results'];
};

const fetchGeoLocation = async (cityLink) => {
    const response = await axios.get(cityLink);

    return response.data.location.latlon;
};

const fetchWeather_OneCallApi = async (cityLocation) => {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/onecall', {
        params: {
            appid: 'ad22990229a1c9ca7cc9f10334915871',
            lat: cityLocation.latitude.toFixed(2),
            lon: cityLocation.longitude.toFixed(2),
            exclude: 'minutely',
            units: 'metric',
        }
    });

    if (cityLocation.current_country) response.data.current_country = cityLocation.current_country;
    if (cityLocation.current_city) response.data.current_city = cityLocation.current_city;
    if (cityLocation.current_region) response.data.current_region = cityLocation.current_region;

    return response.data
};

const fetchClientLocation = async () => {
    const response = await axios.get('http://www.geoplugin.net/json.gp');

    console.log(response)

    return {
        'current_city': response.data.geoplugin_city,
        'current_region': response.data.geoplugin_region,
        'current_country': response.data.geoplugin_countryName,
        'latitude': Number(response.data.geoplugin_latitude),
        'longitude': Number(response.data.geoplugin_longitude),
    };
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const weatherCases = {
    '2': {
        '200': 'MixRainfall.png',
        '201': 'MixRainfall.png',
        '202': 'MixRainfall.png',
        '210': 'ScatteredThunderstorm.png',
        '211': 'ScatteredThunderstorm.png',
        '212': 'SevereThunderstorm.png',
        '221': 'SevereThunderstorm.png',
        '230': 'MixRainfall.png',
        '231': 'MixRainfall.png',
        '232': 'MixRainfall.png',
    },
    '3': {
        '300': 'Drizzle.png',
        '301': 'Drizzle.png',
        '302': 'Drizzle.png',
        '310': 'Drizzle.png',
        '311': 'Drizzle.png',
        '312': 'Drizzle.png',
        '313': 'Rain.png',
        '314': 'HeavyRain.png',
        '321': 'Drizzle.png',
    },
    '5': {
        '500': 'Drizzle.png',
        '501': 'Rain.png',
        '502': 'Rain.png',
        '503': 'HeavyRain.png',
        '504': 'HeavyRain.png',
        '511': 'HeavyRain.png',
        '520': 'HeavyRain.png',
        '521': 'HeavyRain.png',
        '522': 'HeavyRain.png',
        '531': 'HeavyRain.png',
    },
    '6': {
        '600': 'Snow.png',
        '601': 'Snow.png',
        '602': 'Blizzard.png',
        '611': 'Sleet.png',
        '612': 'Sleet.png',
        '613': 'Sleet.png',
        '615': 'Sleet.png',
        '616': 'Sleet.png',
        '620': 'Blizzard.png',
        '621': 'Blizzard.png',
        '622': 'Blizzard.png',
    },
    '7': {
        '701': 'Haze.png',
        '711': 'Smoke.png',
        '721': 'Haze.png',
        '731': 'Dust.png',
        '741': 'Fog.png',
        '751': 'Dust.png',
        '761': 'Dust.png',
        '762': 'Dust.png',
        '771': 'MostlyCloudy.png',
        '781': 'Tornado.png',
    },
    '8': {
        '800': 'Sunny.png',
        '801': 'PartyCloudy.png',
        '802': 'PartyCloudy.png',
        '803': 'MostlyCloudy.png',
        '804': 'MostlyCloudy.png',
    },
}

const renderTabComponent = (weatherData) => {
    const root = document.querySelector('#tabContent');
    const inputValue = document.querySelector('#weatherSearch').value;

    console.log(weatherData.daily)

    root.innerHTML = `
        ${weatherData.daily.map((item, index) => {
            const day = new Date((item.dt + weatherData.timezone_offset) * 1000);
            
            const weather = item.weather[0].id.toString();
            let weatherClass = 'cloud';
            if (weather === '800' || weather === '701' || weather === '721' || weather === '731' || weather === '751' || weather === '761' || weather === '762') {
                weatherClass = 'sunny';
            }
            
            return `
            <a class="list-item" data-tab="${index}">
                <p>${days[day.getUTCDay()]}</p>
                <p class="humidity" title="Humidity"><img src="doc/other/drop2-24px.png"> ${item.humidity}%</p>
                <p class="weather-icon" title="${item.weather[0].description.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}">
                    <img class="${weatherClass}" src="doc/weatherIcons/${weatherCases[weather.charAt(0)][weather]}">
                </p>
                <p>${item.temp.min.toFixed(0)} Co ------------------------------- ${item.temp.max.toFixed(0)} Co</p>
            </a>
            `
        }).join('')}
    `;

    const tabs = document.querySelectorAll('[data-tab]');

    tabs[0].classList.add('tab-active');
    renderCurrentComponent(weatherData, tabs[0].dataset.tab, inputValue);

    tabs.forEach(tab => tab.addEventListener('click', () => {
        tabs.forEach(tab => {
            tab.classList.remove('tab-active');
        });
        tab.classList.add('tab-active');

        renderCurrentComponent(weatherData, tab.dataset.tab, inputValue)
    }));

};

const renderCurrentComponent = (weatherData, tabNum, inputValue) => {
    const root = document.querySelector('#currentComponent');
    const currentDay = weatherData.daily[tabNum];

    const day = new Date((currentDay.dt + weatherData.timezone_offset) * 1000);
    const currentTime = new Date((weatherData.current.dt + weatherData.timezone_offset) * 1000);
    const sunrise = new Date((currentDay.sunrise + weatherData.timezone_offset) * 1000);
    const sunset = new Date((currentDay.sunset + weatherData.timezone_offset) * 1000);
    const weather = currentDay.weather[0].id.toString();

    renderChartComponent(weatherData, tabNum);

    root.innerHTML = `
        <div class="top is-flex">
            <div class="img">
                <img title="${currentDay.weather[0].description.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}" 
                    src="doc/weatherIcons/${weatherCases[weather.charAt(0)][weather]}"/>
            </div>
            <div class="date">
                <h1 class="is-size-3">${tabNum === '0' ? 'Today' : days[day.getUTCDay()]}</h1>
                <p class="subtitle is-size-5">${day.getDate() + ' ' + monthsShort[day.getUTCMonth()] + ', ' + 
                    currentTime.getUTCHours().toString().padStart(2, '0') + ':' + currentTime.getUTCMinutes().toString().padStart(2, '0')}</p>
            </div>
        </div>
        <div class="mid">
            <div class="temp">
                <span class="temp-num">${currentDay.temp.day.toFixed(0)}</span>
                <span class="celcius">c</span>
            </div>
            <div class="location">
                <p>${inputValue}</p>
            </div>
            <div class="meta-data">
                <p class="temp-feels-like" style="justify-self: right">Feels like ${currentDay.feels_like.day.toFixed(0)}</p>
                <p class="middle-dot">&#9679</p>
                <p style="justify-self: left">Precipitation: ${(currentDay.pop * 100).toFixed(0) + '%'}</p>
            </div>
            <div class="meta-data">
                <p style="justify-self: right">Humidity: ${currentDay.humidity + '%'}</p>
                <p class="middle-dot">&#9679</p>
                <p style="justify-self: left">Wind: ${(currentDay.wind_speed * 3.6).toFixed(0) + ' km/h'}</p>
            </div>
            <div class="meta-data">
                <p style="justify-self: right">Sunrise ${sunrise.getUTCHours().toString().padStart(2, '0') + ':' + sunrise.getUTCMinutes().toString().padStart(2, '0')}</p>
                <p class="middle-dot">&#9679</p>
                <p style="justify-self: left">Sunset ${sunset.getUTCHours().toString().padStart(2, '0') + ':' + sunset.getUTCMinutes().toString().padStart(2, '0')}</p>
            </div>
        </div>
    `
};

const renderChartComponent = (weatherData, tabNum) => {
    const root = document.querySelector('#chartComponent');
    const currentDay = new Date((weatherData.current.dt + weatherData.timezone_offset) * 1000);

    let labels = [];
    if (tabNum === '0') {
        let oldLabel = currentDay.getUTCHours();

        for (let i = 0; i < 8; i++) {
            labels.push(oldLabel.toString().padStart(2, '0') + ':00');
            oldLabel += 3;
            if (oldLabel >= 24) oldLabel -= 24;
        }
    } else {
        labels = ['01:00', '04:00', '07:00', '10:00', '13:00', '16:00', '19:00', '22:00'];
    }

    let hourlyWeather = [];
    if (tabNum === '0') {
        for (let i = 0; i < 8; i++) {
            hourlyWeather.push(weatherData.hourly[i*3].temp.toFixed(0));
        }
    } else {
        const startingIndex = 25 - currentDay.getUTCHours();

        for (let i = 0; i < 8; i++) {
            hourlyWeather.push(weatherData.hourly[startingIndex + i*3].temp.toFixed(0));
        }
    }


    root.innerHTML = `
        <canvas id="weatherChart" width="450" height="130"></canvas>
    `
    const chart = document.getElementById('weatherChart').getContext('2d');

    let weatherChart = new Chart(chart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '',
                data: hourlyWeather,
                borderColor: 'rgba(248,197,0,1)',
                fill: true,
                backgroundColor: 'rgba(248,197,0,0.3)',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
            }]
        },
        options: {
            elements: {
                point: {
                    hitRadius: 0,
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false,
                },
            },
            scales: {
                y: {
                    suggestedMin: Number(weatherData.daily[tabNum].temp.min.toFixed(0)) - 1,
                    suggestedMax: Number(weatherData.daily[tabNum].temp.max.toFixed(0)) + 1,
                    ticks: {
                        // forces step size to be 50 units
                        stepSize: 3,
                        color: '#B3B3C1',
                        font: {
                            size: 14,
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                },
                x: {
                    ticks: {
                        color: '#B3B3C1',
                        font: {
                            size: 14,
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false,
                    }
                }
            }
        }
    });
};
