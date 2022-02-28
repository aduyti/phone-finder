let searchInput = '';
document.getElementById('search-button').addEventListener('click', () => {
    const input = document.getElementById('search-input');
    if (input.value) {
        searchInput = input.value;
        console.log(searchInput.toLowerCase());
    }
    else {
        console.log('Type something to search');
    }
    input.value = '';
});