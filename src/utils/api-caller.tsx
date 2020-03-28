import axios from 'axios';
import BasicURL from '../config';

const APICaller = (endPoint, method, body) => {
  return axios({
    method: method || 'get',
    url: `${BasicURL.path}/${endPoint}`,
    data: body && JSON.parse(body),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    responseType: 'json',
  })
    .then(response => {
      console.log(response);
      return response;
    })
    .catch(error => {
      console.log(error.response);
      console.log(
        `there is an error from ["${BasicURL.path}/${endPoint}] >>`,
        error,
      );
      console.log(error.response.status);
      if (axios.isCancel(error)) {
        console.log('im canceled');
        return {data: 'cancel'};
      }

      return {status: error.response.status};
    });
};
export default APICaller;
