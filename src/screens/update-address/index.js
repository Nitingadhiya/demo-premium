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
  KeyboardAvoidingView,
} from 'react-native';
import _ from 'lodash';
import Events from '../../utils/events';
import {Color, Matrics} from '../../common/styles';
import {TextInputView, Header} from '../../common/components';
import {MIcon} from '../../common/assets/vector-icon';
import APICaller from '../../utils/api-caller';
import Helper from '../../utils/helper';
// CONSTANTS
const window = Dimensions.get('window');
let self;

let result;

class UpdateAddress extends Component {
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
    landmarkText: null,
    landmarkSearch: null,

    areaList: [],
    areaText: null,
    areaSearch: null,

    roadList: [],
    roadText: null,
    roadSearch: null,

    modalType: false,

    datePicker: false,
    mediaPath: null,
    GSTNo: null,
  };
  // --->>>Specify Navigation Properties for screen------>>>

  // ------------>>>LifeCycle Methods------------->>>
  componentDidMount() {
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
    result = userInfo;
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

  async updateAddressFn() {
    const endPoint = 'UpdateAddress';
    const method = 'Post';
    const body = {
      An_Master_Users: [
        {
          UserName: this.state.UserName,
          Home: this.state.Address,
          Landmark: this.state.landmarkText,
          Area: this.state.areaText,
          Road: this.state.roadText,
          City: this.state.City,
          Pincode: this.state.Pincode,
          State: this.state.Divison,
        },
      ],
    };
    APICaller(`${endPoint}`, method, JSON.stringify(body)).then(json => {
      if (json.data.Success === 1 || json.data.Success === '1') {
        Events.trigger('updateAddress', json.data.Response);
        result.Home = this.state.Address;
        result.Landmark = this.state.landmarkText;
        result.Area = this.state.areaText;
        result.Road = this.state.roadText;
        result.City = this.state.City;
        result.Pincode = this.state.Pincode;
        result.State = this.state.Divison;
        Helper.setLocalStorageItem('userInfo', result);
        this.props.navigation.goBack();
      }
    });
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
    if (this.state.modalType === 'road') {
      this.setState({roadText: this.state.roadSearch});
    }
  }

  searchPlaceholder() {
    if (this.state.modalType === 'Landmark') {
      return 'Landmark';
    }
    if (this.state.modalType === 'Area') {
      return 'Landmark';
    }
    if (this.state.modalType === 'road') {
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

  // changeTextForsearch(text) {
  //   if (this.state.modalType === 'Landmark') {
  //     this.setState({landmarkSearch: text});
  //   }
  //   if (this.state.modalType === 'Area') {
  //     this.setState({areaSearch: text});
  //   }
  //   if (this.state.modalType === 'Road') {
  //     this.setState({roadSearch: text});
  //   }
  // }

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
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <Header title="Update Address" left="back" />
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

        <KeyboardAvoidingView style={{flex: 1}}>
          <View style={{flex: 1}}>
            <View style={{flex: 1, padding: 10}}>
              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="Address"
                  value={this.state.Address}
                  autoCorrect={false}
                  onChangeText={value => this.setState({Address: value})}
                  blurOnSubmit={false}
                  customStyle={styles.plml0}
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
                <View style={{width: 105}}>
                  <Text style={{color: '#999', width: 90}}>Landmark</Text>
                </View>
                <Text style={{color: '#333', fontSize: 16}}>
                  {this.state.landmarkText || 'Landmark'}
                </Text>
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
                <View style={{width: 105}}>
                  <Text style={{color: '#999', width: 90}}>Road</Text>
                </View>
                <Text style={{color: '#333', fontSize: 16}}>
                  {this.state.roadText || 'Road'}
                </Text>
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
                <View style={{width: 105}}>
                  <Text style={{color: '#999', width: 90}}>Area</Text>
                </View>
                <Text style={{color: '#333', fontSize: 16}}>
                  {this.state.areaText || 'Area'}
                </Text>
              </TouchableOpacity>
              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="City"
                  value={this.state.City}
                  autoCorrect={false}
                  onChangeText={value => this.setState({City: value})}
                  blurOnSubmit={false}
                  customStyle={styles.plml0}
                />
              </View>
              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="Pincode"
                  value={this.state.Pincode}
                  autoCorrect={false}
                  onChangeText={value => this.setState({Pincode: value})}
                  blurOnSubmit={false}
                  customStyle={styles.plml0}
                />
              </View>
              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="State"
                  value={this.state.Divison}
                  autoCorrect={false}
                  onChangeText={value => this.setState({Divison: value})}
                  blurOnSubmit={false}
                  customStyle={styles.plml0}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => this.updateAddressFn()}
            style={styles.checkout}>
            <Text style={styles.checkoutText}> Save</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
    color: Color.black,
  },
  textStyle1: {
    fontSize: Matrics.ScaleValue(15),
    color: Color.lightGray,
  },
  textStyleLocation: {
    fontSize: Matrics.ScaleValue(13),
    color: Color.lightGray,
  },
  viewStyle1: {
    justifyContent: 'center',
    // backgroundColor: Colors.VERY_PALE_ORANGE,
    width: Matrics.ScaleValue(100),
    alignSelf: 'center',
  },
  imageStyle: {
    width: window.width,
    height: Matrics.ScaleValue(265),
  },
  textStyle2: {
    fontSize: Matrics.ScaleValue(19),
    color: Color.black,
    fontWeight: 'bold',
  },
  textStyle3: {
    fontSize: Matrics.ScaleValue(16),
    paddingTop: Matrics.ScaleValue(8),
    color: Color.lightGray,
  },
  viewStyle2: {
    borderBottomWidth: 1,
    borderBottomColor: Color.silver,
    paddingBottom: Matrics.ScaleValue(10),
  },
  textStyle4: {
    fontSize: Matrics.ScaleValue(15),
    marginTop: Matrics.ScaleValue(8),
    color: Color.black,
    paddingTop: Matrics.ScaleValue(5),
  },
  textStyle5: {
    fontSize: Matrics.ScaleValue(15),
    marginTop: Matrics.ScaleValue(8),
    color: Color.lightGray,
    padding: Matrics.ScaleValue(5),
    paddingRight: Matrics.ScaleValue(0),
  },
  textStyle6: {
    fontSize: Matrics.ScaleValue(17),
    color: Color.black,
    flex: 1,
  },
  textStyle7: {
    fontSize: Matrics.ScaleValue(14),
    color: Color.lightGray,
  },
  textStyle8: {
    fontSize: Matrics.ScaleValue(15),
    color: Color.lightGray,
  },
  textinputStyle: {
    flexDirection: 'row',
    backgroundColor: Color.white,
    fontWeight: 'bold',
    borderColor: Color.lightGray,
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
    backgroundColor: Color.primary,
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
  checkout: {
    height: 45,
    width: Matrics.screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primary,
    flexDirection: 'row',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
  },
  subTextBoxView: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
  },
  plml0: {
    paddingLeft: 0,
    marginLeft: 0,
  },
});

export default UpdateAddress;
