import { fetchImages } from './components/get-images';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import BtnService from './components/interactive-btn';

const refs = {
  searchForm: document.querySelector('#search-form'),
  searchInput: document.querySelector('input[name="searchQuery"]'),
  gallery: document.querySelector('.gallery'),
//   loadMoreBtn: document.querySelector('.load-more'),
};

 const btn = new BtnService({ selector: '.load-more',
hidden: true});
 
refs.searchForm.addEventListener('submit', searchPictures);

let inputValue = '';
let page = 1;

function searchPictures(e) {
  e.preventDefault();

  inputValue = refs.searchInput.value.trim();

  if (!inputValue) {
    clearPage();
    Notify.info("Please enter key word")
    return;
  }
  btn.show()
  btn.disable()

  resetPage();

  fetchImages(inputValue, page)
    .then(res => {
      clearPage();
      renderGallery(res.hits);
      btn.enable()
      Notify.success('Hooray! We found totalHits images.');
    })
    .catch(error => {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    });
}

function renderGallery(arr) {
  const markup = arr
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="img-card">
      <img src="${webformatURL}" alt="${tags}" loading="load">
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


function loadMoreImg() {
  page += 1;
  btn.disable()
  fetchImages(inputValue, page)
    .then(res => {
      renderGallery(res.hits);
      btn.enable()
      Notify.success('Hooray! We found totalHits images.');;
    })
    .catch(error => {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    });
}

function clearPage() {
  refs.gallery.innerHTML = '';
}

function resetPage() {
  page = 1;
}
