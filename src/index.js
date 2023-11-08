import { fetchBreeds, fetchCatByBreed } from './cat-api';
import axios from 'axios';
import { Report } from 'notiflix/build/notiflix-report-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';

axios.defaults.headers.common['x-api-key'] =
  'live_pPYL3lbDv4V92PWnDcUOAawHdYN8hJcWbamLuSa7ZYEnf93LmNNbfNbn3DiS4FP1';

const selectEl = document.querySelector('.breed-select');
const divEl = document.querySelector('.cat-info');
const loaderEl = document.querySelector('.loader');
const errorEl = document.querySelector('.error');

errorEl.style.display = 'none';
loaderEl.hidden = false;
selectEl.style.display = 'none';

selectEl.addEventListener('change', handleSelectChange);

function createMarkup(arr) {
  return arr
    .map(({ id, name }) => `<option value="${id}">${name}</option>`)
    .join('');
}

function createCatMarkup(arr) {
  return arr
    .map(({ url, breeds }) => {
      return `
    <img src="${url}" class='cat-img' width=400>
    <div class="cat-container">
    <h2 class='cat-name'>${breeds[0].name}</h2>
        <p style="font-size: 18px;">${breeds[0].description}</p>
        <p style="font-size: 18px;"><b>Temperament:</b> ${breeds[0].temperament}</p>
        </div>
        
      `;
    })
    .join('');
}

function handleSelectChange() {
  loaderEl.hidden = false;
  divEl.style.display = 'none';
  const selectedValue = selectEl.value;

  fetchCatByBreed(selectedValue)
    .then(response => {
      if (response.data.length === 0) {        
        Report.failure(
          '',
          'Oops! Something went wrong! Try reloading the page!'
        ); 
      loaderEl.hidden = true;
      divEl.style.display = 'flex';
      divEl.innerHTML = createCatMarkup(response.data);
    })
    .catch(error => {
      loaderEl.hidden = true;     
      Report.failure('', 'Oops! Something went wrong! Try reloading the page!');
    });
}

fetchBreeds()
  .then(response => {
    if (response.data.length === 0) {     
      Report.failure('', 'Oops! Something went wrong! Try reloading the page!');
    } 
    loaderEl.hidden = true;
    selectEl.style.display = 'flex';
    selectEl.innerHTML = createMarkup(response.data);
  })
  .catch(error => {
    loaderEl.hidden = true;    
    Report.failure('', 'Oops! Something went wrong! Try reloading the page!');
  });
