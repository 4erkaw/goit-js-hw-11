import api from './ApiService';
import * as storage from './localStorage';
import { prepareData, makeMovieList } from './movieList';

const refs = {
  searchForm: document.querySelector('.search__form'),
  searchBtn: document.querySelector('.search__btn'),
  input: document.querySelector('.search__input'),
  list: document.querySelector('.movies'),
  error: document.querySelector('.search__fail'),
};

let inputValue = '';

refs.searchForm.addEventListener('submit', searchFilms);

async function searchFilms(e) {
  e.preventDefault();

  inputValue = refs.input.value.trim();
  api.searchQuery = inputValue;
  if (!inputValue) {
    return;
  }
  loadMoviesByKeyWord();
}

async function loadMoviesByKeyWord() {
  try {
    const movies = await api.fetchMovieByKeyword();

    if (!movies.results.length) {
      refs.error.textContent = 'Search result not successful. Enter the correct movie name';
      return;
    }

    const moviesDatalist = prepareData(movies.results);
    storage.save('moviesData', moviesDatalist);
    refs.list.innerHTML = '';
    makeMovieList(moviesDatalist);
  } catch (error) {
    console.error(error);
    api.resetPage();
  }
}