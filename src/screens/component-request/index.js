import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Picker,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import APICaller from '../../utils/api-caller';
import _ from 'lodash';
import {
  getPartFromSerialNoForHandOverEndPoint,
  getUsersForHandOverEndPoint,
  inHandlInventoryOTPRequestEndPoint,
  ItemHandOverSubmitEndPoint,
} from '../../config/api-endpoint';
import styles from './styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';
import {SpinnerView, TextInputView, Header} from '../../common/components';
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import {Color} from '../../common/styles';

class ComponentRequest extends Component {
  state = {
    loadSystemPart: null,
    loadingData: false,
    errorMessage: null,
    serialNo: 'ITM-SPMVXC',
    remark: null,
    otp: null,
    userList: null,
    responsibleUser: null,
    otpField: false,
    userInfo: null,
    responseOTP: null,
  };

  componentDidMount() {
    this.getUserInfo();
    this.getUsersForHandOver();
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({userInfo: userInfo});
  }

  getUsersForHandOver() {
    this.setState({
      loadingData: true,
    });
    APICaller(getUsersForHandOverEndPoint, 'GET').then(json => {
      console.log(json);
      this.setState({
        loadingData: false,
      });
      if (json.data.Success === '1') {
        this.setState({
          userList: json.data.Response,
        });
      }
    });
  }

  getPartFromSerialNo() {
    const {serialNo, loadSystemPart} = this.state;

    if (!serialNo) return;
    let serialNum = serialNo.split(' ').join('');

    // if already exists in array
    if (_.find(loadSystemPart, {SerialNo: serialNo})) return;

    this.setState({loadingData: true, errorMessage: false});

    APICaller(getPartFromSerialNoForHandOverEndPoint(serialNum), 'GET').then(
      json => {
        this.setState({
          loadingData: false,
        });
        if (json.data.Success === '1') {
          let arr = [];
          if (loadSystemPart) {
            arr = _.concat(loadSystemPart, json.data.Response);
          } else {
            arr = json.data.Response;
          }
          console.log(arr);
          this.setState({
            loadSystemPart: _.uniqBy(arr, 'ID'),
          });
        } else {
          this.setState({
            errorMessage: json.data.Message,
          });
        }
      },
    );
  }

  textBold = text => <Text style={styles.labelText}>{text}:</Text>;

  renderItem(item, index) {
    return (
      <View style={styles.seprationView}>
        <Text style={styles.description}>
          {this.textBold('Description')} {item.PartDescription} -{item.SerialNo}
        </Text>
        <Text style={styles.description}>
          {this.textBold('Warranty')}: {item.WarrantyOutwardMonths}
        </Text>
        <Text style={styles.description}>
          {this.textBold('Part Category')}: {item.PartCategoryName}
        </Text>
        <TouchableOpacity
          onPress={() => this.removeItem(item.ID)}
          style={styles.closeIcon}>
          <McIcon name="close-circle" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  }

  removeItem(id) {
    const {loadSystemPart} = this.state;
    if (loadSystemPart) {
      console.log(id);
      let arr = [];
      _.map(loadSystemPart, res => {
        if (res.ID != id) {
          arr.push(res);
        }
      });

      console.log(arr);

      this.setState({
        loadSystemPart: arr,
      });
    }
  }

  getChangeValue(value) {
    this.setState({responsibleUser: value});
  }

  otpRequest() {
    const {userInfo, responsibleUser, remark, loadSystemPart} = this.state;
    if (!loadSystemPart || loadSystemPart.length === 0) return;
    let systemPartsNo = [];
    _.map(loadSystemPart, res => systemPartsNo.push({SearialNo: res.SerialNo}));
    const body = {
      HandoverUser: userInfo.UserName,
      ResponsibleUser: responsibleUser,
      HandoverRemark: remark,
      Parts: systemPartsNo,
    };

    this.setState({
      loadingData: true,
    });
    APICaller(
      inHandlInventoryOTPRequestEndPoint,
      'POST',
      JSON.stringify(body),
    ).then(json => {
      this.setState({
        loadingData: false,
      });
      if (json.data.Success === '1') {
        this.setState({
          otpField: true,
          responseOTP: _.get(json, 'data.Response[0].OTP', ''),
        });
      } else {
        this.setState({
          errorMessage: json.data.Message,
        });
      }
    });
  }

  savePartRequest() {
    const {
      userInfo,
      responsibleUser,
      remark,
      loadSystemPart,
      otp,
      responseOTP,
    } = this.state;
    if (responseOTP != otp || !responseOTP || !otp) {
      Alert.alert('Failed', 'OTP does not match');
      return;
    }

    if (!loadSystemPart || loadSystemPart.length === 0) return;
    let systemPartsNo = [];
    _.map(loadSystemPart, res => systemPartsNo.push({SearialNo: res.SerialNo}));
    const body = {
      HandoverUser: userInfo.UserName,
      ResponsibleUser: responsibleUser,
      HandoverRemark: remark,
      OTP: otp,
      Parts: systemPartsNo,
    };

    this.setState({
      loadingData: true,
    });
    APICaller(ItemHandOverSubmitEndPoint, 'POST', JSON.stringify(body)).then(
      json => {
        this.setState({
          loadingData: false,
        });
        if (json.data.Success === '1') {
          Alert.alert('Success', json.data.Message);
          NavigationHelper.navigate(
            this.props.navigation,
            'TeamComponentStock',
          );
        } else {
          this.setState({
            errorMessage: json.data.Message,
          });
        }
      },
    );
  }

  render() {
    const {
      loadingData,
      loadSystemPart,
      serialNo,
      errorMessage,
      remark,
      otp,
      userList,
      responsibleUser,
      otpField,
    } = this.state;

    return (
      <SafeAreaView style={styles.flex1}>
        <Header title={'Component Request'} left="back" />
        {loadingData ? (
          <View style={styles.spinnerView}>
            <SpinnerView />
          </View>
        ) : null}
        <View style={styles.container}>
          {/* <KeyboardAvoidingView behavior={'padding'}> */}
          <View style={styles.searchPartsView}>
            <TouchableOpacity style={styles.paddingH}>
              <McIcon name="qrcode-scan" size={24} color={Color.primary} />
            </TouchableOpacity>

            <View style={styles.subTextBoxView}>
              <TextInputView
                placeholder="ITM-REFGSD"
                placeholderTextColor={Color.greyishBrown30}
                value={serialNo}
                autoCorrect={false}
                onChangeText={value => this.setState({serialNo: value})}
                blurOnSubmit={false}
                customStyle={styles.customStyle}
                onSubmitEditing={() => this.getPartFromSerialNo()}
              />
            </View>
            <TouchableOpacity
              style={styles.paddingH}
              onPress={() => this.getPartFromSerialNo()}>
              <McIcon name="cloud-search" size={24} color={Color.primary} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            {errorMessage ? (
              <View style={styles.errorView}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <FlatList
              data={loadSystemPart}
              keyboardShouldPersistTaps={'handled'}
              contentContainerStyle={{flexGrow: 1}}
              keyExtractor={(item, index) => `${index}`}
              //ListEmptyComponent={() => this.noItemFound()}
              style={styles.flatListCss}
              extraData={this.state}
              renderItem={({item, index}) => this.renderItem(item, index)}
            />
            <View>
              <View style={[styles.subTextBoxView, styles.extraTextBoxView]}>
                <TextInputView
                  placeholder="Remark"
                  multline={true}
                  placeholderTextColor={Color.greyishBrown30}
                  value={remark}
                  autoCorrect={false}
                  onChangeText={value => this.setState({remark: value})}
                  blurOnSubmit={false}
                  customStyle={[styles.customStyle, styles.multilineStyle]}
                  onSubmitEditing={() => this.getPartFromSerialNo()}
                />
              </View>
              {otpField ? (
                <View style={styles.spaceMange}>
                  <View
                    style={[styles.subTextBoxView, styles.extraTextBoxView]}>
                    <TextInputView
                      placeholder="Enter otp"
                      placeholderTextColor={Color.greyishBrown30}
                      value={otp}
                      autoCorrect={false}
                      onChangeText={value => this.setState({otp: value})}
                      blurOnSubmit={false}
                      customStyle={styles.customStyle}
                      onSubmitEditing={() => this.getPartFromSerialNo()}
                    />
                  </View>
                </View>
              ) : null}
              <View style={styles.pickerView}>
                <Picker
                  prompt="Choose below user"
                  style={styles.picker}
                  selectedValue={responsibleUser}
                  onValueChange={(itemValue, itemIndex) => {
                    this.getChangeValue(itemValue);
                  }}>
                  {userList &&
                    userList.map((data, index) => {
                      return (
                        <Picker.Item
                          label={data.FullName + ' (' + data.UserType + ')'}
                          value={data.UserName}
                          key={`${index.toString()}`}
                        />
                      );
                    })}
                </Picker>
              </View>
              {!otpField ? (
                <TouchableOpacity
                  style={styles.saveButtonCss}
                  onPress={() => this.otpRequest()}>
                  <Text style={styles.saveButtonText}>Request OTP</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.saveButtonCss}
                  onPress={() => this.savePartRequest()}>
                  <Text style={styles.saveButtonText}>Submit</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* </KeyboardAvoidingView> */}
        </View>
      </SafeAreaView>
    );
  }
}
export default ComponentRequest;
