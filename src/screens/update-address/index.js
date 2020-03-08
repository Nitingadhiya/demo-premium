// LIBRARIES
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import _ from 'lodash';
import PickAddressModal from '../../components/pick-address-modal';
import Events from '../../utils/events';
import {Color, Matrics} from '../../common/styles';
import {TextInputView, Header} from '../../common/components';
import {MIcon} from '../../common/assets/vector-icon';
import APICaller from '../../utils/api-caller';
import Helper from '../../utils/helper';
import {updateAddressEndPoint} from '../../config/api-endpoint';

const window = Dimensions.get('window');

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

    cityText: null,

    modalType: false,

    datePicker: false,
    mediaPath: null,
    GSTNo: null,
  };

  componentDidMount() {
    self = this;
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

  async updateAddressMethod() {
    const {
      UserName,
      Address,
      landmarkText,
      areaText,
      roadText,
      cityText,
      Pincode,
      Divison,
    } = this.state;

    const body = {
      An_Master_Users: [
        {
          UserName,
          Home: Address,
          Landmark: landmarkText,
          Area: areaText,
          Road: roadText,
          City: cityText,
          Pincode,
          State: Divison,
        },
      ],
    };
    APICaller(updateAddressEndPoint, 'POST', JSON.stringify(body)).then(
      async json => {
        if (json.data.Success === 1 || json.data.Success === '1') {
          Events.trigger('updateAddress', json.data.Response);
          result.Home = this.state.Address;
          result.Landmark = this.state.landmarkText;
          result.Area = this.state.areaText;
          result.Road = this.state.roadText;
          result.City = this.state.City;
          result.Pincode = this.state.Pincode;
          result.State = this.state.Divison;
          await Helper.setLocalStorageItem('userInfo', result);
          this.props.navigation.goBack();
          Events.trigger('refreshDashboard', 'refresh');
          Alert.alert('Address', 'Your address updated successfully.');
        } else {
          Alert.alert('Failed', json.data.Message || 'Failed to save address');
        }
      },
    );
  }

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
      return 'Landmark';
    }
    if (this.state.modalType === 'road') {
      return 'Road';
    }
  }

  render() {
    const {cityText, addressModalVisible, modalType} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <Header title="Update Address" left="back" />
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
                    modalType: 'City',
                  })
                }>
                <View style={{width: 120}}>
                  <Text style={{color: '#333', fontSize: 14}}>City</Text>
                </View>
                <View style={{flex: 1}}>
                  {cityText ? (
                    <Text style={{color: '#333', fontSize: 16}}>
                      {cityText}
                    </Text>
                  ) : (
                    <Text style={{color: '#999', fontSize: 16}}>City</Text>
                  )}
                </View>
              </TouchableOpacity>
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
            onPress={() => this.updateAddressMethod()}
            style={styles.checkout}>
            <Text style={styles.checkoutText}> Save</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>

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
