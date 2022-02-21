import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
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
  btn.disable();
  try {
    const res = await fetchImages(inputValue, page);
    clearPage();
    btn.show();

    renderGallery(res.hits);
    lightbox.refresh();
    btn.enable();
    Notify.success('Hooray! We found totalHits images.');
  } catch (error) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    clearPage();
    btn.hide();
  }
}

function renderGallery(arr) {
  const markup = arr
    .map(({largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
      return `
      <a class="img-href" href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="load">
      </a>
      <div class='img-info'>
      <p class='info-item'>
      Likes ${likes}
      </p>
      <p class='info-item'>
      Views ${views}
      </p>
      <p class='info-item'>
      Comments ${comments}
      </p>
      <p class='info-item'>
      Downloads ${downloads}
      </p>    
      </div>`;
    })
    .join('');

  console.log(markup);

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

btn.refs.button.addEventListener('click', loadMoreImg);

async function loadMoreImg() {
  page += 1;
  btn.disable();
  try {
    const response = await fetchImages(inputValue, page);

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

// refs.gallery.addEventListener('click', onGalleryElemClick);

let lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });

// function onGalleryElemClick(e) {
//   e.preventDefault();
//   console.log('f');
// }
