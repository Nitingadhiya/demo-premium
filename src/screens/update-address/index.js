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
import {TextInputView, Header} from '../../common/components';
import {MIcon} from '../../common/assets/vector-icon';
import APICaller from '../../utils/api-caller';
import Helper from '../../utils/helper';
import {updateAddressEndPoint} from '../../config/api-endpoint';
import styles from './styles';

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
    const {
      cityText,
      roadText,
      landmarkText,
      areaText,
      addressModalVisible,
      modalType,
    } = this.state;
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <Header title="Update Address" left="back" />
        <KeyboardAvoidingView style={styles.flex1}>
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
                style={styles.labelClass}
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
                style={styles.labelClass}
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
                style={styles.labelClass}
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

export default UpdateAddress;
