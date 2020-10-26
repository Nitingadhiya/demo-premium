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
const addSystemEndPoint = (
  itemType,
  systemType,
  systemName,
  userName,
  businessType,
) =>
  `AddSystem?ItemType=${itemType}&SystemType=${systemType}&SystemName=${systemName}&Username=${userName}&BusinessType=${businessType}&ServiceTag=`;
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
const getLocationListEndPoint = 'GetLocationList';
const updateLatLongEndPoint = 'UpdateLatLong';
const complaintTaskListEndPoint = userName =>
  `UserDashboard?Username=${userName}`;
const changePasswordEndPoint = (userName, oldPassword, newPassword) =>
  `ChangePassword?Username=${userName}&OldPassword=${oldPassword}&NewPassword=${newPassword}`;
const insertWishCartEndPoint = (productNo, userName, type) =>
  `InsertWishCart?ProductNo=${productNo}&Username=${userName}&WishCart=${type}`;
const removeWishCartEndPoint = (productNo, userName, type) =>
  `RemoveWishCart?ProductNo=${productNo}&Username=${userName}&WishCart=${type}`;
// const getOrderReadyEndPoint = userName => `GetOrderList?Username=${userName}`;
const getPolicyEndPoint = 'GetPolicyList';
const uploadSignatureEndPoint = 'UploadSignatureImage';
const forgotPasswordendPoint = mobileNo =>
  `ForgotPassword?Username=${mobileNo}`;
const getAntivirusListEndPoint = 'GetAntivirusList';
const complaintCompleteEndPoint = (
  complaintId,
  userName,
  closeRemarkText,
  systemtag,
  antivirusCheckbox,
  selectAntivirus,
  antivirusKey,
) =>
  `ComplaintComplete?ComplainId=${complaintId}&CompleteBy=${userName}&CloseRemark=${closeRemarkText}&SystemTag=${systemtag}&IsAntivirus=${antivirusCheckbox}&Antivirus=${selectAntivirus}&AntivirusKey=${antivirusKey}`;
const getPartFromSerialNoEndPoint = tag =>
  `/GetPartFromSerialNo?SerialNo=${tag}`;
const getPartFromSystemTagNoEndPoint = tag =>
  `GetPartFromSystemTag?SystemTag=${tag}`;
const userCheckEndPoint = mobileNo => `UserCheck?MobileNo=${mobileNo}`;
const getLandMarksEndPoint = 'GetLandMarks';
const getAreasEndPoint = 'GetAreas';
const getRoadsEndPoint = 'GetRoads';
const uploadUserImageEndPoint = 'UploadUserImage';
const updateAddressEndPoint = 'UpdateAddress';
const systemAddressUpdateEndPoint = 'SystemAddressUpdate';
const getAreaFromRoadEndPoint = road => `GetAreaFromRoad?Road=${road}`;
const getAreaFromPincodeEndPoint = pincode =>
  `GetAreaFromPincode?Pincode=${pincode}`;
const getPartFromSerialNoForHandOverEndPoint = serialNo =>
  `GetPartFromSerialNoForHandOver?SerialNo=${serialNo}`;
const getUsersForHandOverEndPoint = 'getUsersForHandOver';
const inHandlInventoryOTPRequestEndPoint = `InhandInventoryOTPRequest`;
const ItemHandOverSubmitEndPoint = 'ItemHandOverSubmit';
const InhandResponsibleInventoryEndPoint = username =>
  `InhandResponsibleInventory?LoginUser=${username}`;
const getOTPListForInhandInventoryEndPoint = username =>
  `GetOTPListForInhandInventory?LoginUser=${username}`;
const getRestockHandoverPartFromSerialNoEndPoint = (username, serialNo) =>
  `GetRestockHandoverPartFromSerialNo?SerialNo=${serialNo}&LoginUser=${username}`;
const restockInhandInventoryEndPoint = 'RestockInhandInventory';
const getPartFromSerialNoForOrderEndPoint = serialNo =>
  `GetPartFromSerialNoForOrder?SerialNo=${serialNo}`;
const orderEditSubmitEndPoint = `orderEditSubmit`;
const getSystemFromSystemTagEndPoint = sysTag =>
  `GetSystemFromSystemTag?SystemTag=${sysTag}`;

const forwardOrderEndPoint = (orderNo, userName, orderForUser) =>
  `ForwardOrder?OrderNo=${orderNo}&LoginUser=${userName}&OrderFor=${orderForUser}`;
const orderReadyToDeliverEndPoint = (orderNo, userName, customerUserName) =>
  `OrderReadyToDeliver?OrderNo=${orderNo}&LoginUser=${userName}&CustomerUserName=${customerUserName}`;
const chatListEndPoint = (userName, search, from, size) =>
  `ChatList?Username=${userName}&Search=${search}&From=${from}&size=${size}`;

const contactListEndPoint = (userName, search, from, size) =>
  `ContactList?Username=${userName}&Search=${search}&From=${from}&size=${size}`;

const getChatHistoryEndpoint = (userName, receiver, from, size) =>
  `ChatHistory?Username=${userName}&Receiver=${receiver}&From=${from}&size=${size}`;

/* complaint hold remark */

const complaintOnHoldEndPoint = (complainId, OnHoldBy, OnHoldRemarks) =>
  `ComplaintOnHold?ComplainId=${complainId}&OnHoldBy=${OnHoldBy}&OnHoldRemarks=${OnHoldRemarks}`;

const complaintRevisedEndPoint = (complainId, ReviseBy, RevisedCharges) =>
  `ReviseComplaint?complainId=${complainId}&ReviseBy=${ReviseBy}&RevisedCharges=${RevisedCharges}`;

const complaintConfirmEndPoint = (complainId, ConfirmBy) =>
  `ComplaintConfirm?complainId=${complainId}&ConfirmBy=${ConfirmBy}`;

const messageEndpoint = (FromUser, ToUser, ChatMessage) =>
  `/InsertChat?FromUser=${FromUser}&ToUser=${ToUser}&ChatMessage=${ChatMessage}`;

const resendOTPEndPoint = mobileNo => `ReSendOTP?MobileNo=${mobileNo}`;

const loginWithOTPEndPoint = mobileNo =>
  `UserLoginWithOTP?Username=${mobileNo}`;

const getComplaintMarkerEndpoint = (user) => `GetComplaintForMap?ComplainId=&ComplainType=Assign&ComplaintBy=${user}`

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
  getLocationListEndPoint,
  updateLatLongEndPoint,
  complaintTaskListEndPoint,
  changePasswordEndPoint,
  insertWishCartEndPoint,
  removeWishCartEndPoint,
  // getOrderReadyEndPoint,
  getPolicyEndPoint,
  uploadSignatureEndPoint,
  forgotPasswordendPoint,
  getAntivirusListEndPoint,
  complaintCompleteEndPoint,
  getPartFromSerialNoEndPoint,
  getPartFromSystemTagNoEndPoint,
  userCheckEndPoint,
  getLandMarksEndPoint,
  getAreasEndPoint,
  getRoadsEndPoint,
  uploadUserImageEndPoint,
  updateAddressEndPoint,
  systemAddressUpdateEndPoint,
  getAreaFromRoadEndPoint,
  getAreaFromPincodeEndPoint,
  getPartFromSerialNoForHandOverEndPoint,
  getUsersForHandOverEndPoint,
  inHandlInventoryOTPRequestEndPoint,
  ItemHandOverSubmitEndPoint,
  InhandResponsibleInventoryEndPoint,
  getOTPListForInhandInventoryEndPoint,
  getRestockHandoverPartFromSerialNoEndPoint,
  restockInhandInventoryEndPoint,
  getPartFromSerialNoForOrderEndPoint,
  orderEditSubmitEndPoint,
  getSystemFromSystemTagEndPoint,
  forwardOrderEndPoint,
  orderReadyToDeliverEndPoint,
  chatListEndPoint,
  contactListEndPoint,
  getChatHistoryEndpoint,
  complaintRevisedEndPoint,
  complaintOnHoldEndPoint,
  complaintConfirmEndPoint,
  messageEndpoint,
  resendOTPEndPoint,
  loginWithOTPEndPoint,
  getComplaintMarkerEndpoint
};
