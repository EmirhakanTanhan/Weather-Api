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

    return response.data
};

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
    let root = document.querySelector('#tabContent');

    console.log(weatherData.daily)



    root.innerHTML = `
        ${weatherData.daily.map((item, index) => {
            const day = new Date((item.dt + weatherData.timezone_offset) * 1000);
            
            const weather = item.weather[0].id.toString();
            console.log(weather === '800')
            let weatherClass = 'cloud';
            if (weather === '800' || weather === '701' || weather === '721' || weather === '731' || weather === '751' || weather === '761' || weather === '762') {
                weatherClass = 'sunny';
            }
            
            return `
            <a class="list-item" data-tab="${index}">
                <p>${days[day.getUTCDay()]}</p>
                <p class="humidity"><img src="doc/other/drop2-24px.png"> ${item.humidity}%</p>
                <p class="weather-icon"><img class="${weatherClass}" src="doc/weatherIcons/${weatherCases[weather.charAt(0)][weather]}"></p>
                <p>17 Co ------------------------------- 28 Co</p>
            </a>
            `
        }).join('')}
        
    `;

};

const renderChartComponent = (weatherData) => {

};

const renderCurrentComponent = (weatherData) => {

};

