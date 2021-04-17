import axios from 'axios';
import BasicURL from '../config';
import Helper from './helper';

const APICaller = async (endPoint, method, body) => {
  let apiEnd = endPoint;
  let splitQue = endPoint.split('?');
  const userInfo = await Helper.getLocalStorageItem('userInfo');
  if(userInfo) {
    if(splitQue.length > 0) { 
      endPoint = apiEnd+'&LoginUserId='+userInfo.UserName;
    } else {
      endPoint = apiEnd+'?LoginUserId='+userInfo.UserName;
    }
  }

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
      //console.log(error.response);
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
