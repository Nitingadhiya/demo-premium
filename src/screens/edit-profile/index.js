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
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Appbar} from 'react-native-paper';
import _ from 'lodash';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-crop-picker';
import Events from '../../utils/events';
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
  };

  async componentDidMount() {
    self = this;
    this.year = 2015;
    this.month = 1;
    this.day = 27;
    this.getUserInfo();
    this.getLandMark();
    this.getArea();
    this.getRoad();
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
        City,
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

  setIndicator() {
    const {loader} = getLoader().loader;
    this.setState({
      loadingData: this.state.refreshing ? !loader : loader,
      refreshing: false,
    });
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
    if (!City) {
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
          City: City,
          State: Divison,
          BusinessType: BusinessType,
          GSTNo: GSTNo,
          Home: Address,
        },
      ],
    };
    const body = JSON.stringify(editProfileData);
    APICaller(`${endPoint}`, method, body).then(json => {
      if (json.data.Success === 1 || json.data.Success === '1') {
        const userInfo = json.data.Response;
        // setUser(userInfo);
        Helper.setLocalStorageItem('userInfo', userInfo);
        Events.trigger('refreshProfile', 'refreshProfile');
        Events.trigger('refreshDashboard', 'refresh');
        // const landmarkList = { landmark: json.data.Response};
        // return landmarkList;
        // setLandMark(landmarkList);
      }
      // setLoader({loader: false});
    });
    if (!this.state.mediaPath) {
      navigation.goBack();
      // NavigationHelper.navigate(this.props.navigation, 'Dashboard');
    }
  }

  getLandMark() {
    const endPoint = `GetLandmarks`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      if (json.data.Success === 1 || json.data.Success === '1') {
        let jsonLandmark = json.data.Response;
        let arr = [];
        jsonLandmark.map(res => {
          if (res.Landmark) {
            arr.push(res);
          }
        });
        this.setState({landmarkList: arr, filterLandmarkList: arr});
      }
      setLoader({loader: false});
    });
  }

  getArea() {
    const endPoint = `GetAreas`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      if (json.data.Success === 1 || json.data.Success === '1') {
        const jsonArea = json.data.Response;
        const arr = [];
        jsonArea.map(res => {
          if (res.Area) {
            arr.push(res);
          }
        });
        this.setState({areaList: arr, filterAreaList: arr});
      }
    });
  }

  getRoad() {
    const endPoint = `GetRoads`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      if (json.data.Success === 1 || json.data.Success === '1') {
        const jsonRoad = json.data.Response;
        let arr = [];
        jsonRoad.map(res => {
          if (res.Road) {
            arr.push(res);
          }
        });
        this.setState({roadList: arr, filterRoadList: arr});
      }
    });
  }

  editPress() {
    this.setState({
      editProfile: true,
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
      // this.setState({ modalVisible: !this.state.modalVisible });
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
    const endPoint = 'UploadUserImage';
    const body = {
      FileContents: this.state.mediaPath,
      FileName: this.state.UserName + '.jpg',
    };
    const method = 'POST';
    APICaller(`${endPoint}`, method, JSON.stringify(body)).then(json => {
      global.userImageLoad = Math.random();
      this.setState({
        loading: false,
      });
      Events.trigger('refreshDashboard', 'refresh');
      this.props.navigation.navigate('Home');
    });
  }

  openCameraModal() {
    //  setTimeout(()=> { },1000)
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
    }).then(image => {
      this.setState({modalVisible: !this.state.modalVisible});
      var media = {
        uri: image.path,
        type: image.mime,
        name: this.state.UserName + '.jpg',
        size: image.size,
      };
      this.setState({UserImage: image.path});
      var formData = new FormData();
      formData.append('file', media);

      fetch(
        'http://appservices.premiumitware.com/AndroidService.svc/UploadUserImage',
        {
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      )
        .then(function(r) {
          //console.log('Success', r);
        })
        .catch(function(e) {
          //console.log('Error', e);
        })
        .done();
    });
  }

  selectedModal(type, val) {
    this.setState({
      addressModalVisible: false,
    });
    if (type === 'Landmark') {
      this.setState({
        landmarkText: val,
      });
    }
    if (type === 'Area') {
      this.setState({
        areaText: val,
      });
    }
    if (type === 'Road') {
      this.setState({
        roadText: val,
      });
    }
  }

  loadModalFlatListData() {
    if (this.state.modalType === 'Landmark') {
      return this.state.filterLandmarkList; //this.state.landmarkList;
    }
    if (this.state.modalType === 'Area') {
      return this.state.filterAreaList; //this.state.areaList;
    }
    if (this.state.modalType === 'Road') {
      return this.state.filterRoadList; //this.state.roadList;
    }
  }

  noItemFound = () => {
    return (
      <View
        style={{
          flex: 1,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: 'grey', fontSize: 16}}>No items found</Text>
      </View>
    );
  };

  saveSearchValue() {
    this.setState({addressModalVisible: false});
    if (this.state.modalType === 'Landmark') {
      this.setState({landmarkText: this.state.landmarkSearch});
    }
    if (this.state.modalType === 'Area') {
      this.setState({areaText: this.state.areaSearch});
    }
    if (this.state.modalType === 'Road') {
      this.setState({roadText: this.state.roadSearch});
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

  searchTextValue() {
    if (this.state.modalType === 'Landmark') {
      return this.state.landmarkSearch;
    }
    if (this.state.modalType === 'Area') {
      return this.state.areaSearch;
    }
    if (this.state.modalType === 'Road') {
      return this.state.roadSearch;
    }
  }

  replaceCustomExpression = title => {
    // console.warn(title.replace(/[^a-zA-Z 0-9 | ]/ig, ""));
    const result = title.replace(/  +/g, ' '); // Replace multiple whitespace to a whitespace
    return result.replace(/[^a-zA-Z 0-9 | ]/gi, '').toLowerCase();
  };

  changeTextForsearch(text) {
    if (this.state.modalType === 'Landmark') {
      const epi = this.state.landmarkList.filter(land =>
        this.replaceCustomExpression(land.Landmark).includes(
          this.replaceCustomExpression(text),
        ),
      );
      this.setState({landmarkSearch: text, filterLandmarkList: epi});
    }
    if (this.state.modalType === 'Area') {
      const epi = this.state.areaList.filter(land =>
        this.replaceCustomExpression(land.Area).includes(
          this.replaceCustomExpression(text),
        ),
      );
      this.setState({areaSearch: text, filterAreaList: epi});
    }
    if (this.state.modalType === 'Road') {
      const epi = this.state.roadList.filter(land =>
        this.replaceCustomExpression(land.Road).includes(
          this.replaceCustomExpression(text),
        ),
      );
      this.setState({roadSearch: text, filterRoadList: epi});
    }
  }

  // ----------->>>Render Method-------------->>>

  render() {
    const {validationMsg} = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <Appbar.Header style={{backgroundColor: Color.primary}}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={'Edit Profile'} />
          <Appbar.Action
            icon="check"
            onPress={() => this.updateEditProfile()}
          />
        </Appbar.Header>
        {validationMsg ? (
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              top: 0,
              left: 0,
              justifyContent: 'center',
              width: '100%',
              height: 50,
              backgroundColor: '#fff',
              borderColor: '#ccc',
              borderBottomWidth: 1,
            }}>
            <Text style={{textAlign: 'center', color: 'red'}}>
              {validationMsg}
            </Text>
          </View>
        ) : null}
        <Modal
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
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.addressModalVisible}
          onRequestClose={() => {
            //  Alert.alert('Modal has been closed.');
            this.setState({addressModalVisible: false});
          }}>
          <View style={{marginTop: 22, flex: 1}}>
            <View style={{flexDirection: 'row', padding: 5}}>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 50,
                }}
                onPress={() => {
                  this.setState({addressModalVisible: false});
                }}>
                <Text style={{color: '#000', fontWeight: 'bold'}}>Back</Text>
              </TouchableOpacity>
              <TextInput
                placeholder={this.searchPlaceholder()}
                value={this.searchTextValue()}
                onChangeText={text => this.changeTextForsearch(text)}
                style={{
                  height: 40,
                  width: Dimensions.get('window').width - 110,
                  borderWidth: 1,
                  padding: 0,
                  paddingLeft: 10,
                  borderColor: '#d3d3d3',
                }}
              />
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 50,
                }}
                onPress={() => this.saveSearchValue()}>
                <Text style={{color: '#000', fontWeight: 'bold'}}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
              {this.state.modalType ? (
                <FlatList
                  data={this.loadModalFlatListData()}
                  keyboardShouldPersistTaps={'handled'}
                  contentContainerStyle={{flexGrow: 1}}
                  ListEmptyComponent={() => this.noItemFound()}
                  style={{flex: 1}}
                  extraData={this.state}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={{
                        height: 40,
                        flex: 1,
                        borderTopWidth: 1,
                        justifyContent: 'center',
                        padding: 5,
                        borderColor: '#d3d3d3',
                      }}
                      onPress={() => {
                        if (this.state.modalType === 'Landmark') {
                          this.selectedModal('Landmark', item.Landmark);
                        }
                        if (this.state.modalType === 'Area') {
                          this.selectedModal('Area', item.Area);
                        }
                        if (this.state.modalType === 'Road') {
                          this.selectedModal('Road', item.Road);
                        }
                      }}>
                      <Text style={{color: '#333'}}>
                        {this.state.modalType === 'Area' && item.Area}
                        {this.state.modalType === 'Landmark' && item.Landmark}
                        {this.state.modalType === 'Road' && item.Road}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              ) : null}
            </View>
          </View>
        </Modal>

        <KeyboardAwareScrollView style={{flex: 1}}>
          <View style={{flex: 1}}>
            <View style={styles.userView}>
              <View
                style={{
                  height: Matrics.ScaleValue(120),
                  width: Matrics.ScaleValue(120),
                  backgroundColor: '#d3d3d3',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: Matrics.ScaleValue(120) / 2,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.openGalleryModal(); /*this.setState({ modalVisible: !this.state.modalVisible })*/
                  }}
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    padding: 10,
                    borderRadius: 20,
                  }}>
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
            <View style={{flex: 1, padding: 10}}>
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
                  value={this.state.MobileNo}
                  autoCorrect={false}
                  onChangeText={value => this.setState({MobileNo: value})}
                  blurOnSubmit={false}
                  customStyle={styles.customStyle}
                />
              </View>
              <View
                style={{
                  height: 50,
                  flex: 1,
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderBottomColor: '#d3d3d3',
                  borderBottomWidth: 1,
                }}>
                <View style={{width: 120, paddingLeft: 5}}>
                  <Text style={{color: '#000', fontSize: 14}}>Birthday</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-start',
                  }}>
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

              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderColor: '#ccc',
                  height: 60,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    height: 60,
                    justifyContent: 'center',
                    width: 120,
                    paddingLeft: 5,
                  }}>
                  <Text style={{color: '#333', fontSize: 14}}>Gender</Text>
                </View>
                <View>
                  <Picker
                    selectedValue={this.state.Gender}
                    style={{height: 50, width: 200, marginLeft: -5}}
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
                style={{
                  borderBottomWidth: 1,
                  borderColor: '#d3d3d3',
                  flexDirection: 'row',
                  height: 60,
                  alignItems: 'center',
                }}
                onPress={() =>
                  this.setState({
                    addressModalVisible: true,
                    modalType: 'Landmark',
                  })
                }>
                <View style={{width: 120}}>
                  <Text style={{color: '#333', fontSize: 14}}>Landmark</Text>
                </View>
                {this.state.landmarkText ? (
                  <Text style={{color: '#333', fontSize: 16}}>
                    {this.state.landmarkText}
                  </Text>
                ) : (
                  <Text style={{color: '#999', fontSize: 16}}>Landmark</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  borderBottomWidth: 1,
                  borderColor: '#d3d3d3',
                  flexDirection: 'row',
                  height: 60,
                  alignItems: 'center',
                }}
                onPress={() =>
                  this.setState({
                    addressModalVisible: true,
                    modalType: 'Road',
                  })
                }>
                <View style={{width: 120}}>
                  <Text style={{color: '#333', fontSize: 14}}>Road</Text>
                </View>
                {this.state.roadText ? (
                  <Text style={{color: '#333', fontSize: 16}}>
                    {this.state.roadText}
                  </Text>
                ) : (
                  <Text style={{color: '#999', fontSize: 16}}>Road</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  borderBottomWidth: 1,
                  borderColor: '#d3d3d3',
                  flexDirection: 'row',
                  height: 60,
                  alignItems: 'center',
                }}
                onPress={() =>
                  this.setState({
                    addressModalVisible: true,
                    modalType: 'Area',
                  })
                }>
                <View style={{width: 120}}>
                  <Text style={{color: '#333', fontSize: 14}}>Area</Text>
                </View>
                {this.state.areaText ? (
                  <Text style={{color: '#333', fontSize: 16}}>
                    {this.state.areaText}
                  </Text>
                ) : (
                  <Text style={{color: '#999', fontSize: 16}}>Area</Text>
                )}
              </TouchableOpacity>
              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="City"
                  value={this.state.City}
                  autoCorrect={false}
                  onChangeText={value => this.setState({City: value})}
                  blurOnSubmit={false}
                  customStyle={styles.customStyle}
                />
              </View>
              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="Pincode"
                  value={this.state.Pincode}
                  autoCorrect={false}
                  onChangeText={value => this.setState({Pincode: value})}
                  blurOnSubmit={false}
                  customStyle={styles.customStyle}
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
                />
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderColor: '#ccc',
                  height: 60,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    height: 60,
                    justifyContent: 'center',
                    width: 115,
                  }}>
                  <Text style={{color: '#333', fontSize: 14}}>Usage Type</Text>
                </View>
                <View>
                  <Picker
                    selectedValue={this.state.BusinessType}
                    style={{height: 50, width: 200, marginLeft: -5}}
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
