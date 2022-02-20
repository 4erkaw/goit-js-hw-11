import axios from 'axios';

const API_KEY = 'key=25784131-d2971e411192c7c57d85795af';
const MAIN_DOMAIN = 'https://pixabay.com/api';
const PARAMETERS = 'image_type=photo&orientation=horizontal';
const PER_PAGE = 'per_page=40';

const fetchImages = async (value, page) => {
  const response = await axios.get(
    `${MAIN_DOMAIN}/?${API_KEY}&q=${value}&${PARAMETERS}&page=${page}&${PER_PAGE}`,
  );
  if (response.data.total === 0) {
    throw new Error(res.message);
  }
  console.log(response.data);
  return response.data;
};

// const fetchImages = (value, page) => {
//   return axios
//     .get(`${MAIN_DOMAIN}/?${API_KEY}&q=${value}&${PARAMETERS}&page=${page}&${PER_PAGE}`)
//     .then(res => {
//       if (res.data.total === 0) {
//         throw new Error(res.message);
//       }
//       return res.data;
//     });
// };

export { fetchImages };
