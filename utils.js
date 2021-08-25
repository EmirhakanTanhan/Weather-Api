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
    const response = await axios.get('https://api.teleport.org/api/cities/',{
        params: {
            search: searchTerm,
        }
    });

    return response.data._embedded;
};