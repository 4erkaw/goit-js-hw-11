const API_KEY = 'key=25784131-d2971e411192c7c57d85795af';
const MAIN_DOMAIN = 'https://pixabay.com/api';
const PARAMETERS = 'image_type=photo&orientation=horizontal';
const PER_PAGE = 'per_page=40';

const fetchImages = (value, page) => {
  return fetch(`${MAIN_DOMAIN}/?${API_KEY}&q=${value}&${PARAMETERS}&page=${page}&${PER_PAGE}`).then(
    res => {
      if (!res.ok) {
        throw new Error(res.message);
      }
      return res.json();
    },
  );
};

export { fetchImages };
