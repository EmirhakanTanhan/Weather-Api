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

    const onInput = async (event) => {
        const items = await fetchCityNames(event.target.value);
        console.log(items);

        results.innerHTML = '';
        dropdown.classList.add('is-active');

        items.map((item) => {
            const option = document.createElement('a');


            option.classList.add('dropdown-item');
            option.innerHTML = `${item.matching_full_name}`;

            option.addEventListener('click', (event) => {
                searchBar.value = inputValue(item);
                dropdown.classList.remove('is-active');

                const onSelect = async (item) => {
                    const cityLocationInfo = await fetchGeoLocation(item._links['city:item'].href);
                    console.log(cityInfo);

                    const weatherData = await fetchWeather_OneCallApi(cityLocationInfo);
                    console.log(weatherData);
                }


                onSelect(item);
            });

            results.appendChild(option);
        });
    };

    searchBar.addEventListener('input', debounce(onInput, 500));

    document.addEventListener('click', (event) => {
        if (!root.contains(event.target)) dropdown.classList.remove('is-active');
    });
};