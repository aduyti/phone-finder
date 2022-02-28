let searchInput = '';
document.getElementById('search-button').addEventListener('click', () => {
    const input = document.getElementById('search-input');
    if (input.value) {
        searchInput = input.value;
        loadSearchData(searchInput.toLowerCase());
    }
    else {
        // error message 
        console.log('Type something to search');
    }
    input.value = '';
});

const loadSearchData = async (searchKey) => {
    // const phoneDetailsURL = "https://openapi.programming-hero.com/api/phone/";
    const dataURL = `https://openapi.programming-hero.com/api/phones?search=${searchKey}`;

    const response = await fetch(dataURL);
    const data = await response.json();
    showSearchResults(data.data);
};
const showSearchResults = phones => {
    if (phones.length) {
        phones.forEach(phone => console.log(phone));
    }
    else {
        console.log('No phone found');
    }
};
