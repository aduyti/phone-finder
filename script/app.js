let searchInput = '';
let totalResults = 0;
let maxDisplayResults = 0;
let displayResults = 0;
document.getElementById('search-button').addEventListener('click', () => {
    emptyElement('search-results');
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
        showErrorMessage('Type something to search');
    }
    input.value = '';
});

const loadSearchData = async (searchKey) => {
    elementDisplayState('result-spinner', 'block');

    const response = await fetch(`https://openapi.programming-hero.com/api/phones?search=${searchKey}`);
    const data = await response.json();

    data.status ? showSearchResults(data.data) : showErrorMessage(`No phone found for '${searchInput}'`);
    elementDisplayState('result-spinner', 'none');
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
        showErrorMessage(`No phone found for '${searchInput}'`);
        console.log(`No phone found for '${searchInput}'`);
    }
};

const createCardForPhone = ({ brand, image, phone_name, slug }) => {
    const phoneDiv = document.createElement('div');
    phoneDiv.className = "col-md-6 col-lg-4 col-xl-3 col-8 mb-3";
    phoneDiv.innerHTML = `<div class="card">
        <img src="${image}" class="card-img-top w-50 mx-auto mt-2" alt="${phone_name}">
        <div class="card-body ms-5">
            <h5 class="card-title">${phone_name}</h5>
            <h6 class="card-text">Brand: ${brand}</h6>
            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="loadPhoneData('${slug}')">Show Details</button>
        </div>
    </div>`;
    document.getElementById('search-results').appendChild(phoneDiv);
};

const loadPhoneData = async id => {
    emptyElement('exampleModalLabel');
    elementDisplayState('modal-phone-image', 'none');
    emptyElement('modal-phone-details');

    elementDisplayState('modal-spinner', 'block');

    const response = await fetch(`https://openapi.programming-hero.com/api/phone/${id}`);
    const data = await response.json();
    data.status ? showPhoneDetail(data.data) : setInnerText('exampleModalLabel', "No phone found");
    elementDisplayState('modal-spinner', 'none');
};

const showPhoneDetail = phone => {
    setInnerText('exampleModalLabel', phone.name);
    document.getElementById('modal-phone-image').src = phone.image;
    elementDisplayState('modal-phone-image', 'block');
    document.getElementById('modal-phone-details').appendChild(createTable(phone));
};
const createRow = (key, value) => {
    const row = document.createElement('tr');
    const cell_1 = document.createElement('th');
    const cell_2 = document.createElement('td');
    cell_1.scope = 'row';
    cell_1.innerText = key;
    if (value === '') value = 'Not Available';
    else if (Array.isArray(value)) value = value.join(', ');
    else if (typeof value === 'object') {
        value = createTable(value).outerHTML;
    }
    cell_2.innerHTML = value;
    row.appendChild(cell_1);
    row.appendChild(cell_2);
    return row;
};
const createTable = value => {
    const table = document.createElement('table');
    table.className = 'table';
    Object.keys(value).forEach(key => {
        if (!(key === 'slug' || key === 'name' || key === 'image')) {
            const row = createRow(key, value[key]);
            table.appendChild(row);
        }
    });
    return table;
};

const showErrorMessage = message => {

    const errorH2 = document.createElement('h2');
    errorH2.innerText = message;
    errorH2.className = 'text-danger text-center fst-italic';

    document.getElementById('search-results').appendChild(errorH2);
}
const setInnerText = (elementID, text) => {
    document.getElementById(elementID).innerText = text;
};
const emptyElement = elementID => {
    document.getElementById(elementID).innerHTML = '';
};

const elementDisplayState = (destination, visibility) => {
    document.getElementById(destination).style.display = visibility;
};

elementDisplayState('result-spinner', 'none');
elementDisplayState('search-summary', 'none');