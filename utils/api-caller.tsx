import axios from 'axios';
import BasicURL from '../config';

const staticPath = BasicURL.path;
// const CancelToken = axios.CancelToken;
// const source = CancelToken.source();
global.cancel = '';
console.log(staticPath);
const APICaller = (endPoint, method, body) =>
  axios({
    method: method || 'get',
    url: `${staticPath}/${endPoint}`,
    data: body && JSON.parse(body),
    headers: {
      // Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    responseType: 'json',
    // cancelToken: new axios.CancelToken(((c) => {
    //   // An executor function receives a cancel function as a parameter
    //   global.cancel = c;
    // })),
  })
    .then(response => {
      console.log(`${staticPath}/${endPoint}`, response);
      return response;
    })
    .catch(error => {
      console.log(error.response.status, 'st');
      if (axios.isCancel(error)) {
        console.log('im canceled');
        return {data: 'cancel'};
      }
      console.log('im server response error');
      console.log(
        `there is an error from ["${staticPath}/${endPoint}] >>`,
        error,
      );
      return {status: error.response.status};
    });

export default APICaller;
