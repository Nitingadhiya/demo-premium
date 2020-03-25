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
import {Color, Matrics, ApplicationStyles} from '../../common/styles';
import {TextInputView, Header, SpinnerView} from '../../common/components';
import {MIcon} from '../../common/assets/vector-icon';
import APICaller from '../../utils/api-caller';
import Helper from '../../utils/helper';
import {
  updateAddressEndPoint,
  systemAddressUpdateEndPoint,
  getAreaFromRoadEndPoint,
  getAreaFromPincodeEndPoint,
} from '../../config/api-endpoint';
import styles from './styles';
import {ScrollView} from 'react-native-gesture-handler';

let result;
let systemAddress = false;
let goBack;
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
    systemAddress: false,
    item: null,
    error: null,
    loadingData: false,
    getRoadValue: false,
    getPincodeValue: false,
  };

  componentDidMount() {
    self = this;
    this.searchingDelayed = _.debounce(text => {
      this.getAreaFromPincode(text);
    }, 300);
    goBack = false;
    this.year = 2015;
    this.month = 1;
    this.day = 27;
    const {params} = this.props.route;
    console.log(params, 'params');
    if (params) {
      systemAddress = params.systemAddress;
      const paramsitem = params.item;
      this.setState({
        areaText: paramsitem.Area,
        roadText: paramsitem.Road,
        cityText: paramsitem.City,
        Divison: paramsitem.State,
        landmarkText: paramsitem.Landmark,
        Pincode: paramsitem.Pincode,
        Address: paramsitem.Home,
        SystemTag: paramsitem.SystemTag,
      });
    } else {
      systemAddress = false;
    }
    this.getUserInfo();
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });
    result = userInfo;
    console.log('CCC', systemAddress);
    if (!systemAddress) {
      console.log('IFFF');
      this.getUserState(userInfo);
    }
  }

  getUserState(userInfo) {
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
      console.log('user', userInfo);
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
    if (systemAddress) {
      this.systemAddressUpdate();
      return;
    }
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
      return 'Landmark';
    }
    if (this.state.modalType === 'road') {
      return 'Road';
    }
  }

  systemAddressUpdate() {
    const {
      UserName,
      Address,
      landmarkText,
      areaText,
      roadText,
      cityText,
      Pincode,
      Divison,
      SystemTag,
    } = this.state;

    const body = {
      System: [
        {
          UserName: userInfo.UserName,
          SystemTag: SystemTag,
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

    if (!userInfo.UserName) {
      this.setState({
        error: 'Username not found',
      });
      return;
    }
    if (!SystemTag) {
      this.setState({
        error: 'System tag not found',
      });
      return;
    }

    if (!Address) {
      this.setState({
        error: 'Address filled required',
      });
      return;
    }
    if (Address) {
      console.log((Address.match(/,/g) || []).length); //logs 3

      if ((Address.match(/,/g) || []).length > 1) {
        // Address.split(',');
        this.setState({
          error: 'Address filled only one "," allowed',
        });
        return;
      }
    }
    if (!landmarkText) {
      this.setState({
        error: 'Landmark filled required',
      });
      return;
    }
    if (!areaText) {
      this.setState({
        error: 'Area filled required',
      });
      return;
    }
    if (!roadText) {
      this.setState({
        error: 'Road filled required',
      });
    }
    if (!cityText) {
      this.setState({
        error: 'City filled required',
      });
      return;
    }
    if (!Pincode) {
      this.setState({
        error: 'Pincode filled required',
      });
      return;
    }
    if (!Divison) {
      this.setState({
        error: 'State filled required',
      });
      return;
    }
    this.setState({
      loadingData: true,
    });

    if (goBack) {
      return;
    }
    APICaller(systemAddressUpdateEndPoint, 'POST', JSON.stringify(body)).then(
      async json => {
        if (json.data.Success === 1 || json.data.Success === '1') {
          Events.trigger('systemAdded'); //this for update address
          Alert.alert('Address', 'Your address updated successfully.');
          this.setState({
            loadingData: false,
          });

          this.props.navigation.goBack();
          goBack = true;
        } else {
          goBack = true;
          Alert.alert('Failed', json.data.Message || 'Failed to save address');
        }
      },
    );
  }

  getAreaFromRoad(road) {
    this.selectPincode = false;
    APICaller(getAreaFromRoadEndPoint(road), 'GET').then(async json => {
      if (json.data.Success === 1 || json.data.Success === '1') {
        //Events.trigger('systemAdded'); //this for update address
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

  //http://appservices.premiumitware.com/AndroidService.svc/Getareafrompincode?Pincode=395004
  render() {
    const {
      cityText,
      roadText,
      landmarkText,
      areaText,
      addressModalVisible,
      modalType,
      getRoadValue,
      getPincodeValue,
    } = this.state;
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <Header title="Update Address" left="back" />
        {this.state.loadingData ? (
          <View style={styles.spinnerView}>
            <SpinnerView />
          </View>
        ) : null}
        <KeyboardAvoidingView style={styles.flex1}>
          <ScrollView>
            <View style={styles.flex1}>
              <View style={styles.formGroup}>
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
                  style={styles.labelClass}
                  onPress={() =>
                    this.setState({
                      addressModalVisible: true,
                      modalType: 'Landmark',
                    })
                  }>
                  <View style={styles.width120}>
                    <Text style={styles.font14_999}>Landmark</Text>
                  </View>
                  <View style={styles.flex1}>
                    {landmarkText ? (
                      <Text style={styles.font16_333}>{landmarkText}</Text>
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
                    <Text style={styles.font14_999}>Road</Text>
                  </View>
                  <View style={styles.flex1}>
                    {roadText ? (
                      <Text style={styles.font16_333}>{roadText}</Text>
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
                    <Text style={styles.font14_999}>Area</Text>
                  </View>
                  <View style={styles.flex1}>
                    {areaText ? (
                      <Text style={styles.font16_333}>{areaText}</Text>
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
                    <Text style={styles.font14_999}>City</Text>
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
                    customStyle={styles.plml0}
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
                    customStyle={styles.plml0}
                    editable={this.editableState()}
                  />
                </View>
                <View style={styles.errorView}>
                  <Text style={styles.errorText}>{this.state.error}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
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

export default UpdateAddress;
