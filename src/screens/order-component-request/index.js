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
  orderEditSubmitEndPoint,
  getPartFromSerialNoForOrderEndPoint,
  getSystemFromSystemTagEndPoint,
} from '../../config/api-endpoint';
import styles from './styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';
import {SpinnerView, TextInputView, Header} from '../../common/components';
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import {Color} from '../../common/styles';
import ComponentRequestWithQRCode from '../../components/component-request-with-qr-code';
import ComponentRestockRequestWithQRCode from '../../components/component-restock-request-with-qr-code';
import OrderComponentRequestWithQRCode from '../../components/order-component-request-with-qr-code';

class OrderComponentRequest extends Component {
  state = {
    loadSystemPart: null,
    loadingData: false,
    errorMessage: null,
    serialNo: '',
    remark: null,
    otp: null,
    responsibleUser: null,
    otpField: false,
    userInfo: null,
    responseOTP: null,
    systemTag: null,
    orderNo: null,
  };

  componentDidMount() {
    this.getUserInfo();

    const {params} = this.props.route;
    //For check system tag
    if (!_.get(params, 'systemTag', '')) {
      this.setState({
        orderNo: _.get(params, 'orderNo', ''),
      });
      Events.trigger('order-component-request-with-QRCode', 'Scan System Tag');
    } else {
      this.setState({
        systemTag: _.get(params, 'systemTag', ''),
        orderNo: _.get(params, 'orderNo', ''),
      });
    }

    Events.on('SYS-serial-scan-order', 'Event', val => {
      this.checkSYSTagValidation(val);
    });

    Events.on('parts-serial-scan-order', 'Event', async val => {
      await this.setState({
        serialNo: val,
      });
      this.getPartFromSerialNo();
    });
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({userInfo: userInfo});
  }

  checkSYSTagValidation(sysTag) {
    const {loadSystemPart} = this.state;

    this.setState({loadingData: true, errorMessage: false});

    APICaller(getSystemFromSystemTagEndPoint(sysTag), 'GET').then(json => {
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
        this.setState({
          loadSystemPart: _.uniqBy(arr, 'ID'),
          systemTag: sysTag,
          errorMessage: json.data.Message,
        });
      } else {
        this.setState({
          errorMessage: json.data.Message,
        });
      }
    });
  }

  getPartFromSerialNo() {
    const {serialNo, loadSystemPart, userInfo} = this.state;

    if (!serialNo || !userInfo) return;
    let serialNum = serialNo.split(' ').join('');

    // if already exists in array
    if (_.find(loadSystemPart, {SerialNo: serialNo})) return;

    this.setState({loadingData: true, errorMessage: false});
    APICaller(getPartFromSerialNoForOrderEndPoint(serialNum), 'GET').then(
      json => {
        console.log(json, 'json');
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
          Events.trigger(
            'order-part-serial-no-added',
            _.size(_.uniqBy(arr, 'ID')),
          );
          this.setState({
            loadSystemPart: _.uniqBy(arr, 'ID'),
          });
        } else {
          Events.trigger('order-part-serial-no-added-error', json.data.Message);
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
          {item.Initial} - {item.SerialNo}
          {/* {this.textBold('Description')} {item.PartDescription} -{item.SerialNo} */}
        </Text>
        {/* <Text style={styles.description}>
          {this.textBold('Warranty')}: {item.WarrantyOutwardMonths}
        </Text>
        <Text style={styles.description}>
          {this.textBold('Part Category')}: {item.PartCategoryName}
        </Text> */}
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
      let arr = [];
      _.map(loadSystemPart, res => {
        if (res.ID != id) {
          arr.push(res);
        }
      });

      this.setState({
        loadSystemPart: arr,
      });
    }
  }

  savePartRequest() {
    const {userInfo, loadSystemPart, systemTag, orderNo} = this.state;
    if (!systemTag) {
      Alert.alert('Alert', 'System tag missing!!');
      return;
    }
    if (!loadSystemPart || loadSystemPart.length === 0) return;
    let systemPartsNo = [];
    _.map(loadSystemPart, res => systemPartsNo.push({SerialNo: res.SerialNo}));
    const body = {
      LoginUser: userInfo.UserName,
      Parts: systemPartsNo,
      OrderNo: orderNo,
      SystemTag: systemTag,
    };

    this.setState({
      loadingData: true,
    });

    APICaller(orderEditSubmitEndPoint, 'POST', JSON.stringify(body)).then(
      json => {
        this.setState({
          loadingData: false,
        });
        if (json.data.Success === '1') {
          Alert.alert('Success', json.data.Message);
          this.setState({
            loadSystemPart: null,
            serialNo: null,
          });
          NavigationHelper.navigate(this.props.navigation, 'Order');
        } else {
          this.setState({
            errorMessage: json.data.Message,
          });
        }
      },
    );
  }

  noItemFound = () => {
    if (this.state.loadingData) return <View />;
    return (
      <View style={styles.noItemView}>
        <Text style={styles.noItemText}>No items found</Text>
      </View>
    );
  };

  openQRCode() {
    Events.trigger('order-component-request-with-QRCode', 'Scan Item QR code');
  }

  render() {
    const {
      loadingData,
      loadSystemPart,
      serialNo,
      errorMessage,
      remark,
      otp,
      responsibleUser,
      otpField,
      userInfo,
    } = this.state;

    return (
      <SafeAreaView style={styles.flex1}>
        <Header title={'Add part'} left="back" />
        {loadingData ? (
          <View style={styles.spinnerView}>
            <SpinnerView />
          </View>
        ) : null}
        <View style={styles.container}>
          <View style={styles.searchPartsView}>
            <TouchableOpacity
              style={styles.paddingH}
              onPress={() => this.openQRCode()}>
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
                capitalize={'characters'}
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
              ListEmptyComponent={() => this.noItemFound()}
              style={styles.flatListCss}
              extraData={this.state}
              renderItem={({item, index}) => this.renderItem(item, index)}
            />
            <View>
              <TouchableOpacity
                style={styles.saveButtonCss}
                onPress={() => this.savePartRequest()}>
                <Text style={styles.saveButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <OrderComponentRequestWithQRCode userInfo={userInfo} />
        </View>
      </SafeAreaView>
    );
  }
}
export default OrderComponentRequest;
