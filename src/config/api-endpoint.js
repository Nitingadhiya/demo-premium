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
const getComplaintImageEndPoint = 'GetComplaintImages';
const getComplaintChargeEndPoint = (systemTag, userName) =>
  `GetComplaintCharges?SystemTag=${systemTag}&BaseUserName=${userName}`;
const getItemTypeListEndPoint = 'GetItemTypeList';
const getSystemTypeListEndPoint = 'GetSystemTypeList';
const addSystemEndPoint = (itemType, systemType, systemName, userName) =>
  `AddSystem?ItemType=${itemType}&SystemType=${systemType}&SystemName=${systemName}&Username=${userName}&ServiceTag=`;
const updateSystemNameEndPoint = (systemName, userName, systemTag) =>
  `AddSystem?SystemName=${systemName}&Username=${userName}&ServiceTag=${systemTag}`;
const getServiceEndPoint = tag => `GetService?SystemTag=${tag}`;
const getBonusEndPoint = tag => `GetBonus?SystemTag=${tag}`;
const getSystemWarrantyEndPoint = tag => `GetSystem?SystemTag=${tag}`;
const getDealerImageEndPoint = 'GetDealerImages';
const fetchProductListEndPoint = userName =>
  `GetProductList?ProductNo=&Username=${userName}&WishCart=`;
const getProductDetailsEndPoint = (id, userName) =>
  `GetProductList?ProductNo=${id}&Username=${userName}&WishCart=`;
const getWishlistEndPoint = userName =>
  `GetProductList?ProductNo=&Username=${userName}&WishCart=WISH`;
const getOrderListEndPoint = userName => `GetOrderList?Username=${userName}`;
const getUserProfileEndPoint = userName => `UserProfile?Username=${userName}`;

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
  getComplaintImageEndPoint,
  getComplaintChargeEndPoint,
  getItemTypeListEndPoint,
  getSystemTypeListEndPoint,
  addSystemEndPoint,
  updateSystemNameEndPoint,
  getServiceEndPoint,
  getBonusEndPoint,
  getSystemWarrantyEndPoint,
  getDealerImageEndPoint,
  fetchProductListEndPoint,
  getProductDetailsEndPoint,
  getWishlistEndPoint,
  getOrderListEndPoint,
  getUserProfileEndPoint,
};
