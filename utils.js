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

const renderTabComponent = (weatherData) => {

};

const renderChartComponent = (weatherData) => {

};

const renderCurrentComponent = (weatherData) => {

};

