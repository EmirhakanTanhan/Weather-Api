const createAutoComplete = () => {
    const searchBar = document.querySelector('#weatherSearch');

    const onInput = async (event) => {
        const items = await fetchCityNames(event.target.value);
        console.log(items);
    };

    searchBar.addEventListener('input', debounce(onInput, 500));
};