// LIBRARIES
import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  SafeAreaView,
  Modal,
  Picker,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Appbar} from 'react-native-paper';
import _ from 'lodash';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-crop-picker';
import Events from '../../utils/events';
import {MIcon} from '../../common/assets/vector-icon';
import PickAddressModal from '../../components/pick-address-modal';
import {
  getLandMarksEndPoint,
  getAreasEndPoint,
  getRoadsEndPoint,
  uploadUserImageEndPoint,
  getAreaFromRoadEndPoint,
  getAreaFromPincodeEndPoint,
} from '../../config/api-endpoint';
// import DatePicker from 'react-native-datepicker';

import {Images, Color, Matrics} from '../../common/styles';
import {TextInputView, Header} from '../../common/components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import APICaller from '../../utils/api-caller';
import styles from './styles';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';

// CONSTANTS
const window = Dimensions.get('window');
let self;

//= ===CLASS DECLARATION====//
export default class EditProfile extends Component {
  state = {
    FirstName: null,
    LastName: null,
    MobileNo: null,
    Landmark: null,
    Gold: null,
    Silver: null,
    editProfile: false,
    modalVisible: false,
    Gender: 'Male',
    BusinessType: 'B',
    addressModalVisible: false,
    landmarkList: [],
    filterLandmarkList: [],
    landmarkText: null,
    landmarkSearch: null,
    cityText: null,

    areaList: [],
    filterAreaList: [],
    areaText: null,
    areaSearch: null,

    roadList: [],
    filterRoadList: [],
    roadText: null,
    roadSearch: null,

    modalType: false,

    datePicker: false,
    mediaPath: null,
    GSTNo: null,
    validationMsg: '',
    getRoadValue: false,
    getPincodeValue: false,
  };

  async componentDidMount() {
    global.userImageLoad = Math.random();
    self = this;
    this.searchingDelayed = _.debounce(text => {
      this.getAreaFromPincode(text);
    }, 300);
    this.year = 2015;
    this.month = 1;
    this.day = 27;
    this.getUserInfo();
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });
    if (userInfo) {
      const {
        FirstName,
        LastName,
        MobileNo,
        Landmark,
        UserName,
        Coins,
        Gold,
        Silver,
        UserImage,
        EmailId,
        Gender,
        CompanyName,
        Area,
        Road,
        City,
        State,
        DateOfBirth,
        Pincode,
        GSTNo,
        Home,
        BusinessType,
      } = userInfo;
      this.setState({
        areaText: Area,
        roadText: Road,
        cityText: City,
        Divison: State,
        landmarkText: Landmark,
        Pincode,
        DateOfBirth,
        FirstName,
        LastName,
        MobileNo,
        Coins,
        Gold,
        Silver,
        UserImage,
        UserName,
        EmailId,
        Gender,
        CompanyName,
        GSTNo,
        Address: Home,
        BusinessType,
      });
    }
  }

  async updateEditProfile() {
    const {navigation} = this.props;
    const {
      UserName,
      CompanyName,
      FirstName,
      LastName,
      City,
      DateOfBirth,
      EmailId,
      MobileNo,
      landmarkText,
      roadText,
      areaText,
      Pincode,
      Divison,
      GSTNo,
      BusinessType,
      Address,
      Gender,
      cityText,
    } = this.state;

    if (!FirstName) {
      this.setState({
        validationMsg: 'Please Enter First Name',
      });
      return;
    }
    if (!LastName) {
      this.setState({
        validationMsg: 'Please Enter Last Name',
      });
      return;
    }
    if (!cityText) {
      this.setState({
        validationMsg: 'Please Enter City',
      });
      return;
    }

    if (!DateOfBirth) {
      this.setState({
        validationMsg: 'Please Enter Birthdate',
      });
      return;
    }
    if (!EmailId) {
      this.setState({
        validationMsg: 'Please Enter Email',
      });
      return;
    }
    if (!MobileNo) {
      this.setState({
        validationMsg: 'Please Enter Mobile no',
      });
      return;
    }
    // if (!this.state.CompanyName) {
    //   this.setState({
    //     validationMsg: 'Please Enter Company Name',
    //   });
    //   return;
    // }
    // if (!this.state.GSTNo) {
    //   this.setState({
    //     validationMsg: 'Please Enter GSTNo',
    //   });
    //   return;
    // }
    if (!landmarkText) {
      this.setState({
        validationMsg: 'Please Enter Landmark',
      });
      return;
    }
    if (!roadText) {
      this.setState({
        validationMsg: 'Please Enter Road',
      });
      return;
    }
    if (!areaText) {
      this.setState({
        validationMsg: 'Please Enter Area',
      });
      return;
    }

    if (!Pincode) {
      this.setState({
        validationMsg: 'Please Enter Pincode',
      });
      return;
    }

    if (!Divison) {
      this.setState({
        validationMsg: 'Please Enter State',
      });
      return;
    }

    this.imageUpload();

    const endPoint = `UserEdit`;
    const method = 'POST';
    const editProfileData = {
      An_Master_Users: [
        {
          UserName,
          FirstName,
          LastName,
          DateOfBirth,
          Gender,
          Landmark: landmarkText,
          Road: roadText,
          Area: areaText,
          Pincode: Pincode,
          MobileNo: MobileNo,
          EmailId: EmailId,
          CompanyName: CompanyName,
          City: cityText,
          State: Divison,
          BusinessType: BusinessType,
          GSTNo: GSTNo,
          Home: Address,
        },
      ],
    };

    const body = JSON.stringify(editProfileData);
    APICaller(`${endPoint}`, method, body).then(async json => {
      if (json.data.Success === 1 || json.data.Success === '1') {
        const userInfo = json.data.Response;
        await Helper.setLocalStorageItem('userInfo', userInfo);
        global.profileInfo = userInfo;
        if (!this.state.mediaPath) {
          Events.trigger('refreshProfile', 'refreshProfile');
          Events.trigger('refreshDashboard', 'refresh');
          Alert.alert('Profile', 'Profile Updated Successfully.');
          navigation.goBack();
        }
      } else {
        Alert.alert(json.data.Message || 'Something went to wrong');
      }
    });
  }

  openGalleryModal() {
    //  setTimeout(()=> { },1000)
    ImagePicker.openPicker({
      width: 100,
      height: 100,
      //cropping: true,
      includeBase64: true,
      mediaType: 'photo',
      //cropperCircleOverlay: true,
    }).then(image => {
      var media = {
        uri: image.path,
        type: image.mime,
        name: this.state.UserName + '.jpg',
      };
      this.setState({UserImage: image.path, mediaPath: image.data});
    });
  }

  imageUpload() {
    if (!this.state.mediaPath) {
      return;
    }
    const body = {
      FileContents: this.state.mediaPath,
      FileName: this.state.UserName + '.jpg',
    };
    APICaller(uploadUserImageEndPoint, 'POST', JSON.stringify(body)).then(
      json => {
        if (json.data.Success === '1') {
          global.userImageLoad = Math.random();
          this.setState({
            loading: false,
          });
          Events.trigger('refreshDashboard', 'refresh');
          Events.trigger('refreshProfile', 'refreshProfile');
          Alert.alert('Profile', 'Profile Updated Successfully.');
          this.props.navigation.goBack();
        }
      },
    );
  }

  // openCameraModal() {
  //   //  setTimeout(()=> { },1000)
  //   ImagePicker.openCamera({
  //     width: 300,
  //     height: 400,
  //     cropping: true,
  //     mediaType: 'photo',
  //   }).then(image => {
  //     this.setState({modalVisible: !this.state.modalVisible});
  //     var media = {
  //       uri: image.path,
  //       type: image.mime,
  //       name: this.state.UserName + '.jpg',
  //       size: image.size,
  //     };
  //     this.setState({UserImage: image.path});
  //     var formData = new FormData();
  //     formData.append('file', media);

  //     fetch(
  //       'http://appservices.premiumitware.com/AndroidService.svc/UploadUserImage',
  //       {
  //         method: 'post',
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //         body: formData,
  //       },
  //     )
  //       .then(function(r) {
  //         //console.log('Success', r);
  //       })
  //       .catch(function(e) {
  //         //console.log('Error', e);
  //       })
  //       .done();
  //   });
  // }

  selectedModal(type, val) {
    if (type === 'Landmark') {
      this.setState({
        landmarkText: val,
        addressModalVisible: false,
      });
    }
    if (type === 'Area') {
      this.setState({
        areaText: val,
        addressModalVisible: false,
      });
    }
    if (type === 'Road') {
      this.setState({
        roadText: val,
        addressModalVisible: false,
      });
      this.getAreaFromRoad(val);
    }
    if (type === 'City') {
      this.setState({
        cityText: val,
        addressModalVisible: false,
      });
    }
  }

  searchPlaceholder() {
    if (this.state.modalType === 'Landmark') {
      return 'Landmark';
    }
    if (this.state.modalType === 'Area') {
      return 'Area';
    }
    if (this.state.modalType === 'Road') {
      return 'Road';
    }
  }

  getAreaFromRoad(road) {
    this.selectPincode = false;
    APICaller(getAreaFromRoadEndPoint(road), 'GET').then(async json => {
      if (json.data.Success === 1 || json.data.Success === '1') {
        const data = _.get(json, 'data.Response[0]', '');
        if (!data) return;
        this.setState({
          areaText: data.Area,
          cityText: data.City,
          Pincode: data.Pincode,
          Divison: data.State,
          getRoadValue: true,
          loadingData: false,
        });
      } else {
        this.setState({
          getRoadValue: false,
        });
        //Alert.alert('Failed', json.data.Message || 'Failed to save address');
      }
    });
  }

  getAreaFromPincode(pincode) {
    this.setState({
      loadingData: true,
    });
    if (!pincode) return;
    if (pincode.length < 2) return;
    APICaller(getAreaFromPincodeEndPoint(pincode), 'GET').then(async json => {
      if (json.data.Success === 1 || json.data.Success === '1') {
        //Events.trigger('systemAdded'); //this for update address
        const data = _.get(json, 'data.Response[0]', '');
        if (!data) return;
        this.setState({
          areaText: data.Area,
          cityText: data.City,
          roadText: data.Road,
          Divison: data.State,
          getPincodeValue: true,
          loadingData: false,
        });
      } else {
        this.setState({
          getPincodeValue: false,
          loadingData: false,
        });
        //Alert.alert('Failed', json.data.Message || 'Failed to save address');
      }
    });
  }

  pincodeChange(value) {
    this.selectPincode = true;
    this.setState({Pincode: value});
    this.searchingDelayed(value);
  }

  editableState() {
    if (this.selectPincode) {
      return !this.state.getPincodeValue === false ? false : true;
    } else {
      return !this.state.getRoadValue === false ? false : true;
    }
  }

  render() {
    const {
      validationMsg,
      addressModalVisible,
      modalType,
      cityText,
      getRoadValue,
      getPincodeValue,
    } = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <Appbar.Header style={styles.headerBg}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={'Edit Profile'} />
          <Appbar.Action
            icon="check"
            onPress={() => this.updateEditProfile()}
          />
        </Appbar.Header>

        {/* <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.modalVisible}
          transparent
          onRequestClose={() => {
            this.setState({modalVisible: !this.state.modalVisible});
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}>
            <View
              style={{
                shadowOffset: {width: 1, height: 1},
                shadowColor: 'black',
                shadowOpacity: 1.0,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                height: 160,
                width: Dimensions.get('window').width - 100,
                backgroundColor: '#fff',
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => this.openCameraModal()}
                  style={{
                    flex: 1,
                    borderRightWidth: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="camera" size={80} color="#000" />
                  <Text
                    style={{color: '#000', fontWeight: 'bold', fontSize: 16}}>
                    Camera
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.openGalleryModal()}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="photo" size={80} color="#000" />
                  <Text
                    style={{color: '#000', fontWeight: 'bold', fontSize: 16}}>
                    Gallery
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{marginTop: 10, width: '100%'}}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({modalVisible: !this.state.modalVisible})
                  }
                  style={{
                    height: 40,
                    width: '100%',
                    backgroundColor: Color.APP_COLOR,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: -10,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}>
                  <Text
                    style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal> */}

        {addressModalVisible ? (
          <PickAddressModal
            searchPlaceholderText={this.searchPlaceholder()}
            modalType={modalType}
            closeModalPress={(type, item) => {
              this.selectedModal(type, item);
              this.setState({addressModalVisible: false});
            }}
          />
        ) : null}
        {validationMsg ? (
          <View style={styles.validationView}>
            <Text style={styles.errorClass}>{validationMsg}</Text>
          </View>
        ) : null}
        <KeyboardAwareScrollView style={styles.flex1}>
          <View style={styles.flex1}>
            <View style={styles.userView}>
              <View style={styles.imageViewClass}>
                <TouchableOpacity
                  onPress={() => {
                    this.openGalleryModal();
                  }}
                  style={styles.editTouchClass}>
                  <Icon name="edit" size={20} color="#fff" />
                </TouchableOpacity>
                <Image
                  source={{
                    uri: `${this.state.UserImage}?${global.userImageLoad}`,
                  }}
                  style={styles.userImage}
                />
              </View>
            </View>
            <View style={styles.formGroup}>
              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="First Name"
                  value={this.state.FirstName}
                  autoCorrect={false}
                  onChangeText={value => this.setState({FirstName: value})}
                  blurOnSubmit={false}
                  customStyle={styles.customStyle}
                />
              </View>
              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="Last Name"
                  value={this.state.LastName}
                  autoCorrect={false}
                  onChangeText={value => this.setState({LastName: value})}
                  blurOnSubmit={false}
                  customStyle={styles.customStyle}
                />
              </View>
              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="Email"
                  value={this.state.EmailId}
                  autoCorrect={false}
                  onChangeText={value => this.setState({EmailId: value})}
                  blurOnSubmit={false}
                  customStyle={styles.customStyle}
                />
              </View>
              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="Phone No"
                  editable={false}
                  value={this.state.MobileNo}
                  autoCorrect={false}
                  onChangeText={value => this.setState({MobileNo: value})}
                  blurOnSubmit={false}
                  customStyle={styles.customStyle}
                />
              </View>
              <View style={styles.birthdayForm}>
                <View style={styles.birthdayLabel}>
                  <Text style={styles.birthdayLabelText}>Birthday</Text>
                </View>
                <View style={styles.datePickerView}>
                  <DatePicker
                    style={{width: 200}}
                    date={this.state.DateOfBirth}
                    mode="date"
                    placeholder="Birthday"
                    format="YYYY-MM-DD"
                    minDate="1950-05-01"
                    maxDate="2016-06-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    allowFontScaling
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {
                        borderWidth: 0,
                        alignItems: 'flex-start',
                      },
                      dateText: {
                        fontSize: 16,
                      },

                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={date => {
                      this.setState({DateOfBirth: date});
                    }}
                  />
                </View>
              </View>

              <View style={styles.genderForm}>
                <View style={styles.genderLabelView}>
                  <Text style={styles.birthdayLabelText}>Gender</Text>
                </View>
                <View>
                  <Picker
                    selectedValue={this.state.Gender}
                    style={styles.genderPicker}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({Gender: itemValue})
                    }>
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="FeMale" />
                  </Picker>
                </View>
              </View>
              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="Company Name"
                  value={this.state.CompanyName}
                  autoCorrect={false}
                  onChangeText={value => this.setState({CompanyName: value})}
                  blurOnSubmit={false}
                  customStyle={styles.customStyle}
                />
              </View>
              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="GST No."
                  value={this.state.GSTNo}
                  autoCorrect={false}
                  onChangeText={value => this.setState({GSTNo: value})}
                  blurOnSubmit={false}
                  customStyle={styles.customStyle}
                />
              </View>
              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="Address"
                  value={this.state.Address}
                  autoCorrect={false}
                  onChangeText={value => this.setState({Address: value})}
                  blurOnSubmit={false}
                  customStyle={styles.customStyle}
                />
              </View>
              <TouchableOpacity
                style={styles.labelClass}
                onPress={() =>
                  this.setState({
                    addressModalVisible: true,
                    modalType: 'Landmark',
                  })
                }>
                <View style={styles.width120}>
                  <Text style={styles.birthdayLabelText}>Landmark</Text>
                </View>
                <View style={styles.flex1}>
                  {this.state.landmarkText ? (
                    <Text style={styles.font16_333}>
                      {this.state.landmarkText}
                    </Text>
                  ) : (
                    <Text style={styles.font16_999}>Landmark</Text>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.labelClass,
                  {opacity: getPincodeValue ? 0.5 : 1},
                ]}
                disabled={getPincodeValue}
                onPress={() =>
                  this.setState({
                    addressModalVisible: true,
                    modalType: 'Road',
                  })
                }>
                <View style={styles.width120}>
                  <Text style={styles.birthdayLabelText}>Road</Text>
                </View>
                <View style={styles.flex1}>
                  {this.state.roadText ? (
                    <Text style={styles.font16_333}>{this.state.roadText}</Text>
                  ) : (
                    <Text style={styles.font16_999}>Road</Text>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.labelClass,
                  {opacity: getRoadValue || getPincodeValue ? 0.5 : 1},
                ]}
                disabled={getRoadValue || getPincodeValue}
                onPress={() =>
                  this.setState({
                    addressModalVisible: true,
                    modalType: 'Area',
                  })
                }>
                <View style={styles.width120}>
                  <Text style={styles.birthdayLabelText}>Area</Text>
                </View>
                <View style={styles.flex1}>
                  {this.state.areaText ? (
                    <Text style={styles.font16_333}>{this.state.areaText}</Text>
                  ) : (
                    <Text style={styles.font16_999}>Area</Text>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.labelClass,
                  {opacity: getRoadValue || getPincodeValue ? 0.5 : 1},
                ]}
                disabled={getRoadValue || getPincodeValue}
                onPress={() =>
                  this.setState({
                    addressModalVisible: true,
                    modalType: 'City',
                  })
                }>
                <View style={styles.width120}>
                  <Text style={styles.birthdayLabelText}>City</Text>
                </View>
                <View style={styles.flex1}>
                  {cityText ? (
                    <Text style={styles.font16_333}>{cityText}</Text>
                  ) : (
                    <Text style={styles.font16_999}>City</Text>
                  )}
                </View>
              </TouchableOpacity>

              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="Pincode"
                  value={this.state.Pincode}
                  autoCorrect={false}
                  onChangeText={value => this.pincodeChange(value)}
                  blurOnSubmit={false}
                  customStyle={styles.customStyle}
                  editable={!getRoadValue}
                />
              </View>
              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="State"
                  value={this.state.Divison}
                  autoCorrect={false}
                  onChangeText={value => this.setState({Divison: value})}
                  blurOnSubmit={false}
                  customStyle={styles.customStyle}
                  editable={this.editableState()}
                />
              </View>
              <View style={styles.genderForm}>
                <View style={styles.genderLabelView}>
                  <Text style={styles.birthdayLabelText}>Usage Type</Text>
                </View>
                <View>
                  <Picker
                    selectedValue={this.state.BusinessType}
                    style={styles.genderPicker}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({BusinessType: itemValue})
                    }>
                    <Picker.Item label="Business Use" value="B" />
                    <Picker.Item label="Home Use" value="H" />
                  </Picker>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}
