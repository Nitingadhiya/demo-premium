const checkVersionEndPoint = 'VersionCheck';
const sliderImagesEndPoint = 'GetSliderImages';
const userLoginEndPoint = (email, password) =>
  `UserLogin?Username=${email}&Password=${password}`;
const updateTokenEndPoint = (userName, token) =>
  `UpdateTokenForUser?Username=${userName}&Token=${token}`;
const userRegistrationEndPoint = 'UserRegisteration';
const getCityEndPoint = 'GetCityList';

module.exports = {
  checkVersionEndPoint,
  sliderImagesEndPoint,
  userLoginEndPoint,
  updateTokenEndPoint,
  userRegistrationEndPoint,
  getCityEndPoint,
};
