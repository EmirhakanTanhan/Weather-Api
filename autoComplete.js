const createAutoComplete = ({inputValue}) => {

    const root = document.querySelector('#weatherSearchBar');
    root.innerHTML += `
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">
    
            </div>
        </div>
    </div>
    `;

    const searchBar = document.querySelector('#weatherSearch');
    const dropdown = document.querySelector('.dropdown');
    const results = document.querySelector('.results');

    const onSelect = async (item) => {
        const cityLocationInfo = await fetchGeoLocation(item._links['city:item'].href);

        const weatherData = await fetchWeather_OneCallApi(cityLocationInfo);
        console.log('weather')
        console.log(weatherData);

        renderTabComponent(weatherData);

        const cityImage = await fetchCityImage(cityLocationInfo);
        renderImageComponent(cityImage, weatherData);
    }

    const onInit = async () => {
        const userLocationInfo = await fetchClientLocation();
        console.log('fetchClient');

        const weatherData = await fetchWeather_OneCallApi(userLocationInfo);
        console.log(weatherData);

        renderTabComponent(weatherData);

        const cityImage = await fetchCityImage(userLocationInfo);
        renderImageComponent(cityImage, weatherData);
    }

    const onInput = async (event) => {
        const items = await fetchCityNames(event.target.value);

        results.innerHTML = '';
        dropdown.classList.add('is-active');

        items.map((item) => {
            const option = document.createElement('a');

            option.classList.add('dropdown-item');
            option.innerHTML = `${item.matching_full_name}`;

            option.addEventListener('click', (event) => {
                searchBar.value = inputValue(item);
                dropdown.classList.remove('is-active');

                onSelect(item);
            });

            results.appendChild(option);
        });
    };

    onInit();

    searchBar.addEventListener('input', debounce(onInput, 500));

    document.addEventListener('click', (event) => {
        if (!root.contains(event.target)) dropdown.classList.remove('is-active');
    });
};