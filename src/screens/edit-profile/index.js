// LIBRARIES
import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  Modal,
  Picker,
  AsyncStorage,
  KeyboardAvoidingView,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import _ from 'lodash';
import DatePicker from 'react-native-datepicker';
// import ImagePicker from 'react-native-image-crop-picker';
import Events from '../../utils/events';
// import DatePicker from 'react-native-datepicker';

import {Images, Color, Matrics} from '../../common/styles';
import {TextInputView, Header} from '../../common/components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import APICaller from '../../utils/api-caller';
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

  componentDidMount() {
    self = this;
    this.year = 2015;
    this.month = 1;
    this.day = 27;

    AsyncStorage.getItem('userInfo').then(res => {
      const result = JSON.parse(res);
      if (result) {
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
        } = result;
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
    });

    this.getLandMark();
    this.getArea();
    this.getRoad();
  }

  setIndicator() {
    const {loader} = getLoader().loader;
    this.setState({
      loadingData: this.state.refreshing ? !loader : loader,
      refreshing: false,
    });
  }

  async updateEditProfile() {
    if (!this.state.FirstName) {
      this.setState({
        validationMsg: 'Please Enter First Name',
      });
      return;
    }
    if (!this.state.LastName) {
      this.setState({
        validationMsg: 'Please Enter Last Name',
      });
      return;
    }
    // if (!this.state.Address) {
    //   this.setState({
    //     validationMsg: 'Please Enter Address',
    //   });
    //   return;
    // }
    if (!this.state.City) {
      this.setState({
        validationMsg: 'Please Enter City',
      });
      return;
    }

    if (!this.state.DateOfBirth) {
      this.setState({
        validationMsg: 'Please Enter Birthdate',
      });
      return;
    }
    if (!this.state.EmailId) {
      this.setState({
        validationMsg: 'Please Enter Email',
      });
      return;
    }
    if (!this.state.MobileNo) {
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
    if (!this.state.landmarkText) {
      this.setState({
        validationMsg: 'Please Enter Landmark',
      });
      return;
    }
    if (!this.state.roadText) {
      this.setState({
        validationMsg: 'Please Enter Road',
      });
      return;
    }
    if (!this.state.areaText) {
      this.setState({
        validationMsg: 'Please Enter Area',
      });
      return;
    }

    if (!this.state.Pincode) {
      this.setState({
        validationMsg: 'Please Enter Pincode',
      });
      return;
    }

    if (!this.state.Divison) {
      this.setState({
        validationMsg: 'Please Enter State',
      });
      return;
    }

    this.imageUpload();
    await APIController.EditProfile(this.state);
    if (!this.state.mediaPath) {
      this.props.navigation.navigate('Home');
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

  // componentWillReceiveProps() {
  //     const setParamsAction = NavigationActions.setParams({
  //         params: { tabBarVisible: true },
  //         key: 'HomeScreen',
  //     });
  //     this.props.navigation.dispatch(setParamsAction)
  // }

  // ------------->>>Controllers/Functions------------>>>>
  //
  // renderViewComment() {
  //   const setParamsAction = NavigationActions.setParams({
  //       params: { tabBarVisible: false },
  //       key: 'HomeScreen',
  //   });
  //   this.props.navigation.dispatch(setParamsAction);
  //   this.props.navigation.navigate('CommentsScreen');
  // }

  //       renderSettings() {
  //         console.log('Clicked Settings');
  //         Alert.alert(
  //             'Alert',
  //             '',
  //             [
  //               {text: 'Edit', onPress: this.renderViewComment.bind(this)},
  //               {text: 'Delete', onPress: () => console.log('Delete')},
  //               {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
  //             ],
  //             { cancelable: false }
  //           )
  //       }
  //

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
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <Header title={'Edit Profile'} left="back" />
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
              <TextInputView
                placeholder="First Name"
                value={this.state.FirstName}
                autoCorrect={false}
                onChangeText={value => this.setState({FirstName: value})}
                blurOnSubmit={false}
              />
              <TextInputView
                placeholder="Last Name"
                value={this.state.LastName}
                autoCorrect={false}
                onChangeText={value => this.setState({LastName: value})}
                blurOnSubmit={false}
              />
              <TextInputView
                placeholder="Email"
                value={this.state.EmailId}
                autoCorrect={false}
                onChangeText={value => this.setState({EmailId: value})}
                blurOnSubmit={false}
              />
              <TextInputView
                placeholder="Phone No"
                value={this.state.MobileNo}
                autoCorrect={false}
                onChangeText={value => this.setState({MobileNo: value})}
                blurOnSubmit={false}
              />
              <View
                style={{
                  height: 50,
                  flex: 1,
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderBottomColor: '#d3d3d3',
                  borderBottomWidth: 1,
                }}>
                <View style={{width: 120}}>
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
                {/* <RadioForm
                  radio_props={radio_props}
                  formHorizontal
                  buttonColor={Color.APP_COLOR}
                  selectedButtonColor={Color.APP_COLOR}
                  buttonSize={14}
                  animation
                  initial={this.state.GenVal}
                  labelStyle={{ marginRight: 10 }}
                  onPress={value => {
                    console.log(value, 'Value');
                    this.setState({ Gender: value });
                  }}
                /> */}
              </View>
              <TextInputView
                placeholder="Company Name"
                value={this.state.CompanyName}
                autoCorrect={false}
                onChangeText={value => this.setState({CompanyName: value})}
                blurOnSubmit={false}
              />
              <TextInputView
                placeholder="GST No."
                value={this.state.GSTNo}
                autoCorrect={false}
                onChangeText={value => this.setState({GSTNo: value})}
                blurOnSubmit={false}
              />
              <TextInputView
                placeholder="Address"
                value={this.state.Address}
                autoCorrect={false}
                onChangeText={value => this.setState({Address: value})}
                blurOnSubmit={false}
              />
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
              <TextInputView
                placeholder="City"
                value={this.state.City}
                autoCorrect={false}
                onChangeText={value => this.setState({City: value})}
                blurOnSubmit={false}
              />
              <TextInputView
                placeholder="Pincode"
                value={this.state.Pincode}
                autoCorrect={false}
                onChangeText={value => this.setState({Pincode: value})}
                blurOnSubmit={false}
              />
              <TextInputView
                placeholder="State"
                value={this.state.Divison}
                autoCorrect={false}
                onChangeText={value => this.setState({Divison: value})}
                blurOnSubmit={false}
              />
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

//= =====STYLES DECLARATION======//

const styles = StyleSheet.create({
  imageView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    width: Dimensions.get('window').width / 5,
    height: Dimensions.get('window').width / 5,
    borderRadius: Dimensions.get('window').width / 10,
  },
  viewStyle: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingLeft: Matrics.ScaleValue(10),
  },
  textStyle: {
    fontSize: Matrics.ScaleValue(18),
    fontWeight: 'bold',
    color: Color.BLACK,
  },
  textStyle1: {
    fontSize: Matrics.ScaleValue(15),
    color: Color.GRAY,
  },
  textStyleLocation: {
    fontSize: Matrics.ScaleValue(13),
    color: Color.GRAY,
  },
  viewStyle1: {
    justifyContent: 'center',
    // backgroundColor: Color.VERY_PALE_ORANGE,
    width: Matrics.ScaleValue(100),
    alignSelf: 'center',
  },
  imageStyle: {
    width: window.width,
    height: Matrics.ScaleValue(265),
  },
  textStyle2: {
    fontSize: Matrics.ScaleValue(19),
    color: Color.BLACK,
    fontWeight: 'bold',
  },
  textStyle3: {
    fontSize: Matrics.ScaleValue(16),
    paddingTop: Matrics.ScaleValue(8),
    color: Color.GRAY,
  },
  viewStyle2: {
    borderBottomWidth: 1,
    borderBottomColor: Color.SILVER,
    paddingBottom: Matrics.ScaleValue(10),
  },
  textStyle4: {
    fontSize: Matrics.ScaleValue(15),
    marginTop: Matrics.ScaleValue(8),
    color: Color.BLACK,
    paddingTop: Matrics.ScaleValue(5),
  },
  textStyle5: {
    fontSize: Matrics.ScaleValue(15),
    marginTop: Matrics.ScaleValue(8),
    color: Color.GRAY,
    padding: Matrics.ScaleValue(5),
    paddingRight: Matrics.ScaleValue(0),
  },
  textStyle6: {
    fontSize: Matrics.ScaleValue(17),
    color: Color.BLACK,
    flex: 1,
  },
  textStyle7: {
    fontSize: Matrics.ScaleValue(14),
    color: Color.GRAY,
  },
  textStyle8: {
    fontSize: Matrics.ScaleValue(15),
    color: Color.GRAY,
  },
  textinputStyle: {
    flexDirection: 'row',
    backgroundColor: Color.WHITE,
    fontWeight: 'bold',
    borderColor: Color.GRAY,
    height: Matrics.ScaleValue(40),
    borderWidth: 1,
    borderRadius: Matrics.ScaleValue(5),
    justifyContent: 'space-between',
  },
  viewCommentAll: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: Matrics.ScaleValue(15),
  },
  commentSettingButton: {
    paddingHorizontal: Matrics.ScaleValue(12),
    paddingVertical: Matrics.ScaleValue(6),
  },
  userCommentView: {
    flexDirection: 'row',
    paddingTop: Matrics.ScaleValue(20),
    paddingBottom: Matrics.ScaleValue(20),
  },
  sendCommentButton: {
    alignSelf: 'center',
    marginRight: Matrics.ScaleValue(15),
  },
  commentSettingButtonView: {
    marginRight: -12,
    marginTop: 2,
  },
  rightDash: {
    width: 60,
    alignItems: 'flex-end',
  },
  mainRightDash: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    height: 20,
  },
  systemProtectedView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width - 40,
    shadowOffset: {width: 2, height: 0},
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    borderRadius: 10,
    margin: 10,
    backgroundColor: '#fff',
  },
  actionTouch: {
    flex: 1,
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    backgroundColor: Color.APP_COLOR,
  },
  protectedSubView: {
    borderWidth: 3,
    width: Dimensions.get('window').width / 7,
    height: Dimensions.get('window').width / 7,
    borderRadius: Dimensions.get('window').width / 14,
    marginHorizontal: Dimensions.get('window').width * 0.01,
    justifyContent: 'center',
    alignItems: 'center',
  },
  protectedDTSubView: {
    width: Dimensions.get('window').width / 6,
    height: Dimensions.get('window').width / 6,
    borderRadius: Dimensions.get('window').width / 12,
    marginHorizontal: Dimensions.get('window').width * 0.01,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNumber: {
    fontSize: 12,
    color: '#000',
  },
  dayText: {
    fontSize: 12,
    color: '#000',
  },
  textdescView: {
    marginTop: 5,
  },
  textdesc: {
    fontSize: 10,
  },
  tcTextView: {
    borderWidth: 3,
    position: 'absolute',
    width: Dimensions.get('window').width / 7,
    height: Dimensions.get('window').width / 7,
    borderRadius: Dimensions.get('window').width / 14,
    borderColor: 'red',
  },
  textInputCss: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flex: 1,
    marginHorizontal: 10,
  },
  offerAcc: {
    flex: 1,
    backgroundColor: '#ff375e',
    borderRadius: 5,
    alignItems: 'center',
    padding: 5,
    margin: 5,
  },
  offerName: {fontWeight: 'bold', fontSize: 14},
  userView: {
    height: Matrics.ScaleValue(120),
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  userImage: {
    height: Matrics.ScaleValue(120),
    width: Matrics.ScaleValue(120),
    borderRadius: Matrics.ScaleValue(120) / 2,
  },
});
