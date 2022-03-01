let searchInput = '';           // to save search key
let totalResults = 0;           // total number of results
let maxDisplayResults = 0;      // max number of results to display
let noOfResultDisplaying = 0;   // number of results showing in display

// if clicked on 'Search' button
document.getElementById('search-button').addEventListener('click', () => {
    stateInitialize();          // clear previous data
    const input = document.getElementById('search-input');
    if (input.value) {
        maxDisplayResults = 20; // max 20 results for search
        searchInput = input.value;
        loadSearchData(searchInput.toLowerCase());  // call search api
    }
    else {
        // error message for no input value
        showErrorMessage('Type something to search');
    }
    input.value = '';
});

// if click on 'Show All' button
document.getElementById('all-results-button').addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        stateInitialize();      // clear previous data
        maxDisplayResults = totalResults;   // setting max number to total number od results
        loadSearchData(searchInput.toLowerCase());  // call search api
    }
});

// cleaning unnecessary data
const stateInitialize = () => {
    emptyElement('search-results');
    elementDisplayState('search-summary', 'none');
    elementDisplayState('all-results-button', 'none');
    elementDisplayState('result-spinner', 'none');
};
// load search data
const loadSearchData = async searchKey => {
    elementDisplayState('result-spinner', 'block'); // display spinner
    const searchURL = `https://openapi.programming-hero.com/api/phones?search=${searchKey}`;    // search api URL
    const data = await fetchData(searchURL);
    // show results for status true or show error
    data.status ? showSearchResults(data.data) : showErrorMessage(`No phone found for '${searchInput}'`);
    elementDisplayState('result-spinner', 'none');  // hide spinner

};
// fetch data
const fetchData = async fetchURL => {
    const response = await fetch(fetchURL);
    const data = await response.json();
    return data;
}
// display results
const showSearchResults = phones => {
    if (phones.length) {
        totalResults = phones.length;   // store total number of results
        noOfResultDisplaying = 0;
        while (noOfResultDisplaying < totalResults) {
            createCardForPhone(phones[noOfResultDisplaying++]);
            if (noOfResultDisplaying === maxDisplayResults) { break; }  // display only max number of results
        }
        // display results summary
        document.getElementById('search-summary').innerText = `Showing ${noOfResultDisplaying} out of ${totalResults} results`;
        elementDisplayState('search-summary', 'block');

        if (totalResults > noOfResultDisplaying) {  // to display 'Show All' button
            elementDisplayState('all-results-button', 'block');
        }
    }
    else {
        // error message for no results
        showErrorMessage(`No phone found for '${searchInput}'`);
    }
};
// create and display each result in card
const createCardForPhone = ({ brand, image, phone_name, slug }) => { // result destructuring
    const phoneDiv = document.createElement('div');
    phoneDiv.className = "col-md-6 col-lg-4 col-xl-3 col-8 mb-3";
    phoneDiv.innerHTML = `<div class="card border border-secondary border-3 rounded-3">
        <img src="${image}" class="card-img-top w-50 mx-auto mt-2" alt="${phone_name}">
        <div class="card-body ms-5">
            <h5 class="card-title">${phone_name}</h5>
            <h6 class="card-text">Brand: ${brand}</h6>
            <button type="button" class="btn btn-outline-primary fw-bold" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="loadPhoneData('${slug}')">Show Details</button>
        </div>
    </div>`;
    document.getElementById('search-results').appendChild(phoneDiv);
};

const loadPhoneData = async id => {
    // erase previous data
    emptyElement('exampleModalLabel');
    elementDisplayState('modal-phone-image', 'none');
    emptyElement('modal-phone-details');

    elementDisplayState('modal-spinner', 'block');  // display spinner
    const phoneURL = `https://openapi.programming-hero.com/api/phone/${id}`; // phone api URL
    const data = await fetchData(phoneURL);
    // for status true show phone details or show error message
    data.status ? showPhoneDetail(data.data) : setInnerText('exampleModalLabel', "No phone found");
    elementDisplayState('modal-spinner', 'none');   // hide spinner
};
// show phone details
const showPhoneDetail = phone => {
    setInnerText('exampleModalLabel', phone.name);      // display phone name
    document.getElementById('modal-phone-image').src = phone.image; // set phone image
    elementDisplayState('modal-phone-image', 'block');  // display phone image
    document.getElementById('modal-phone-details').appendChild(createTable(phone)); // display phone details
};
// create table and it's row
const createTable = value => {
    const table = document.createElement('table');
    table.className = 'table';
    // for all keys of value create row
    Object.keys(value).forEach(key => {
        if (!(key === 'slug' || key === 'name' || key === 'image')) {   // name, image and slug is outside 
            const row = createRow(key, value[key]);
            table.appendChild(row);
        }
    });
    return table;
};
// create row and column for a given key and value
const createRow = (key, value) => {
    const row = document.createElement('tr');
    const cell_1 = document.createElement('th');
    const cell_2 = document.createElement('td');
    cell_1.scope = 'row';
    cell_1.innerText = key.toUpperCase();
    if (value === '') value = 'Not Available';      // if value is empty string. Ex- for release date
    else if (Array.isArray(value)) value = value.join(', ');    // if value is an array. Ex - for sensors
    else if (typeof value === 'object') {           // if value is an object create nested table.
        value = createTable(value).outerHTML;
    }
    cell_2.innerHTML = value;
    row.appendChild(cell_1);
    row.appendChild(cell_2);
    return row;
};
// display error message
const showErrorMessage = message => {
    const errorH2 = document.createElement('h2');
    errorH2.innerText = message;
    errorH2.className = 'text-danger text-center fst-italic';

    document.getElementById('search-results').appendChild(errorH2);
}
// change innerText of HTML element
const setInnerText = (elementID, text) => {
    document.getElementById(elementID).innerText = text;
};
// clean innerHTML of HTML element
const emptyElement = elementID => {
    document.getElementById(elementID).innerHTML = '';
};
// set HTML element display property
const elementDisplayState = (destination, visibility) => {
    document.getElementById(destination).style.display = visibility;
};

stateInitialize();      // clear unnecessary data