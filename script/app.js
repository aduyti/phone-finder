let searchInput = '';
let totalResults = 0;
let maxDisplayResults = 0;
let displayResults = 0;
document.getElementById('search-button').addEventListener('click', () => {
    const input = document.getElementById('search-input');
    if (input.value) {
        ////////////////////////////////////////////////////////////////
        maxDisplayResults = 5;
        ////////////////////////////////////////////////////////////////
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
    emptyElement('search-results');
    spinnerState('result-spinner', 'block');
    const dataURL = `https://openapi.programming-hero.com/api/phones?search=${searchKey}`;

    const response = await fetch(dataURL);
    const data = await response.json();
    showSearchResults(data.data);
    spinnerState('result-spinner', 'none');
};
const showSearchResults = phones => {
    if (phones.length) {
        totalResults = phones.length;
        for (displayResults = 0; displayResults < totalResults; displayResults++) {
            createCardForPhone(phones[displayResults]);
            if (displayResults + 1 === maxDisplayResults) { break; }
        }
    }
    else {
        console.log(`No phone found for '${searchInput}'`);
    }
};
//  {brand, image, phone_name, slug}
const createCardForPhone = ({ brand, image, phone_name, slug }) => {
    const phoneDiv = document.createElement('div');
    phoneDiv.className = "col-md-6 col-lg-4 col-xl-3 col-8 mb-3";
    phoneDiv.innerHTML = `<div class="card">
        <img src="${image}" class="card-img-top w-50 mx-auto mt-2" alt="${phone_name}">
        <div class="card-body ms-5">
            <h5 class="card-title">${phone_name}</h5>
            <h6 class="card-text">Brand: ${brand}</h6>
            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="loadPhoneData(${slug})">Show Details</button>
        </div>
    </div>`;
    document.getElementById('search-results').appendChild(phoneDiv);
};

const emptyElement = (elementID) => {
    document.getElementById(elementID).innerHTML = '';
}

const spinnerState = (destination, visibility) => {
    document.getElementById(destination).style.display = visibility;
};

spinnerState('result-spinner', 'none');
spinnerState('search-summary', 'none');
// spinnerState('modal-spinner', 'none');