import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchImages } from './components/get-images';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import BtnService from './components/interactive-btn';

const refs = {
  searchForm: document.querySelector('#search-form'),
  searchInput: document.querySelector('input[name="searchQuery"]'),
  gallery: document.querySelector('.gallery'),
  //   loadMoreBtn: document.querySelector('.load-more'),
};

const btn = new BtnService({ selector: '.load-more', hidden: true });

refs.searchForm.addEventListener('submit', searchPictures);

let inputValue = '';
let page = 1;

async function searchPictures(e) {
  e.preventDefault();

  inputValue = refs.searchInput.value.trim();

  if (!inputValue) {
    clearPage();
    Notify.info('Please enter key word');
    return;
  }

  resetPage();
  try {
    const res = await fetchImages(inputValue, page);
    clearPage();
    btn.show();
    btn.disable();
    renderGallery(res.hits);
    btn.enable();
    Notify.success('Hooray! We found totalHits images.');
  } catch (error) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    clearPage()
    btn.hide()
  }
}

function renderGallery(arr) {
  const markup = arr
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="img-card">
      <a class="img-href" href="${webformatURL}">
      <img src="${webformatURL}" alt="${tags}" loading="load">
      </a>
      <div class='img-info'>
      <p class='info-item'>
      <b>Likes ${likes}
      </p>
      <p class='info-item'>
      <b>Views ${views}
      </p>
      <p class='info-item'>
      <b>Comments ${comments}
      </p>
      <p class='info-item'>
      <b>Downloads ${downloads}
      </p>
      </div>
      </div>`;
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}


btn.refs.button.addEventListener('click', loadMoreImg);

async function loadMoreImg() {
  page += 1;
  btn.disable();
  const response = await fetchImages(inputValue, page);
  try {
    renderGallery(response.hits);
    btn.enable();
    Notify.success('Hooray! We found totalHits images.');
  } catch (error) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }
}

function clearPage() {
  refs.gallery.innerHTML = '';
}

function resetPage() {
  page = 1;
}



// refs.gallery.addEventListener('click', onGalleryElemClick)

// let lightbox = new SimpleLightbox('.gallery a', {captionsData: "alt", captionDelay: 250});

// function onGalleryElemClick(e) {
//     e.preventDefault();
//     console.log("f")
// }

