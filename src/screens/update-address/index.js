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
import Events from '../util/events';
import {Color, Matrics} from '../../common/styles';
import {TextInputView, Header} from '../../common/components';
import MIcon from '../../common/assets/vector-icon';
import APICaller from '../../utils/api-caller';
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

  static navigationOptions = ({navigation}) => ({
    //  header: null
    title: 'Update Address',
    headerStyle: {borderBottomWidth: 1},
    headerTitleStyle: {
      fontSize: Metrics.ScaleValue(20),
      color: Colors.BLACK,
      flex: 1,
      textAlign: 'center',
      alignSelf: 'center',
    },
    headerTintColor: Colors.BLACK,
    headerLeft: (
      <TouchableOpacity
        style={styles.headerTitleView}
        onPress={() => navigation.goBack()}>
        <Icon name="keyboard-arrow-left" size={40} />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        style={styles.headerTitleView}
        onPress={() => self.updateAddressFn()}
        style={{paddingRight: 10}}>
        <Text style={{fontSize: 16}}>Save</Text>
      </TouchableOpacity>
    ),
  });

  // ------------>>>LifeCycle Methods------------->>>
  componentDidMount() {
    self = this;
    this.year = 2015;
    this.month = 1;
    this.day = 27;

    AsyncStorage.getItem('userInfo').then(res => {
      result = JSON.parse(res);

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

  async updateAddressFn() {
    setLoader({loader: true});
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
        AsyncStorage.setItem('userInfo', JSON.stringify(result));
        this.props.navigation.goBack();
      }
      setLoader({loader: false});
    });
  }

  getLandMark() {
    setLoader({loader: true});
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
        this.setState({landmarkList: arr});
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
        this.setState({areaList: arr});
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
        this.setState({roadList: arr});
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
      return this.state.landmarkList;
    }
    if (this.state.modalType === 'Area') {
      return this.state.areaList;
    }
    if (this.state.modalType === 'Road') {
      return this.state.roadList;
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

  changeTextForsearch(text) {
    if (this.state.modalType === 'Landmark') {
      this.setState({landmarkSearch: text});
    }
    if (this.state.modalType === 'Area') {
      this.setState({areaSearch: text});
    }
    if (this.state.modalType === 'Road') {
      this.setState({roadSearch: text});
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
            </View>
          </View>
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
    paddingLeft: Metrics.ScaleValue(10),
  },
  textStyle: {
    fontSize: Metrics.ScaleValue(18),
    fontWeight: 'bold',
    color: Colors.BLACK,
  },
  textStyle1: {
    fontSize: Metrics.ScaleValue(15),
    color: Colors.GRAY,
  },
  textStyleLocation: {
    fontSize: Metrics.ScaleValue(13),
    color: Colors.GRAY,
  },
  viewStyle1: {
    justifyContent: 'center',
    // backgroundColor: Colors.VERY_PALE_ORANGE,
    width: Metrics.ScaleValue(100),
    alignSelf: 'center',
  },
  imageStyle: {
    width: window.width,
    height: Metrics.ScaleValue(265),
  },
  textStyle2: {
    fontSize: Metrics.ScaleValue(19),
    color: Colors.BLACK,
    fontWeight: 'bold',
  },
  textStyle3: {
    fontSize: Metrics.ScaleValue(16),
    paddingTop: Metrics.ScaleValue(8),
    color: Colors.GRAY,
  },
  viewStyle2: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.SILVER,
    paddingBottom: Metrics.ScaleValue(10),
  },
  textStyle4: {
    fontSize: Metrics.ScaleValue(15),
    marginTop: Metrics.ScaleValue(8),
    color: Colors.BLACK,
    paddingTop: Metrics.ScaleValue(5),
  },
  textStyle5: {
    fontSize: Metrics.ScaleValue(15),
    marginTop: Metrics.ScaleValue(8),
    color: Colors.GRAY,
    padding: Metrics.ScaleValue(5),
    paddingRight: Metrics.ScaleValue(0),
  },
  textStyle6: {
    fontSize: Metrics.ScaleValue(17),
    color: Colors.BLACK,
    flex: 1,
  },
  textStyle7: {
    fontSize: Metrics.ScaleValue(14),
    color: Colors.GRAY,
  },
  textStyle8: {
    fontSize: Metrics.ScaleValue(15),
    color: Colors.GRAY,
  },
  textinputStyle: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    fontWeight: 'bold',
    borderColor: Colors.GRAY,
    height: Metrics.ScaleValue(40),
    borderWidth: 1,
    borderRadius: Metrics.ScaleValue(5),
    justifyContent: 'space-between',
  },
  viewCommentAll: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: Metrics.ScaleValue(15),
  },
  commentSettingButton: {
    paddingHorizontal: Metrics.ScaleValue(12),
    paddingVertical: Metrics.ScaleValue(6),
  },
  userCommentView: {
    flexDirection: 'row',
    paddingTop: Metrics.ScaleValue(20),
    paddingBottom: Metrics.ScaleValue(20),
  },
  sendCommentButton: {
    alignSelf: 'center',
    marginRight: Metrics.ScaleValue(15),
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
    backgroundColor: Colors.APP_COLOR,
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
    height: Metrics.ScaleValue(120),
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  userImage: {
    height: Metrics.ScaleValue(120),
    width: Metrics.ScaleValue(120),
    borderRadius: Metrics.ScaleValue(120) / 2,
  },
});

const mapStateToProps = data => ({
  landmarkListProps: data || null,
});
export default connect(mapStateToProps, null)(UpdateAddress);
