const checkVersionEndPoint = 'VersionCheck';
const sliderImagesEndPoint = 'GetSliderImages';
const userLoginEndPoint = (email, password) =>
  `UserLogin?Username=${email}&Password=${password}`;
const updateTokenEndPoint = (userName, token) =>
  `UpdateTokenForUser?Username=${userName}&Token=${token}`;
const userRegistrationEndPoint = 'UserRegisteration';
const getCityEndPoint = 'GetCityList';
const validateOtpEndPoint = (mobileNo, otp) =>
  `ValidateOTP?MobileNo=${mobileNo}&OTP=${otp}`;
const getCategoryListEndPoint = 'GetCategoryList';
const getVersionCodeEndPoint = 'GetVersionCode';
const userDashboardEndPoint = (userName, buildVersion) =>
  `UserDashboard?Username=${userName}&UserVersion=${buildVersion}`;

module.exports = {
  checkVersionEndPoint,
  sliderImagesEndPoint,
  userLoginEndPoint,
  updateTokenEndPoint,
  userRegistrationEndPoint,
  getCityEndPoint,
  validateOtpEndPoint,
  getCategoryListEndPoint,
  getVersionCodeEndPoint,
  userDashboardEndPoint,
};
