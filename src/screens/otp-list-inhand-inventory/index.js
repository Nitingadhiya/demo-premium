import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import APICaller from '../../utils/api-caller';
import _ from 'lodash';
import {getOTPListForInhandInventoryEndPoint} from '../../config/api-endpoint';
import styles from './styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import {SpinnerView, Header} from '../../common/components';
import InhandInventoryForResponsiblePerson from '../../components/inhand-inventory-for-responsible-person';
import InhandInventory from '../../components/inhand-inventory';
import moment from 'moment';

class OTPListInhandInventory extends Component {
  state = {
    loadingData: false,
    otpList: null,
    refreshing: false,
  };

  componentDidMount() {
    this.getUserInfo();
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    if (userInfo) {
      this.setState({userInfo: userInfo});
      this.getInhandInventoryForResponsible(userInfo.UserName);
    }
  }

  getInhandInventoryForResponsible(username) {
    if (!this.state.refreshing) {
      this.setState({loadingData: true});
    }

    APICaller(getOTPListForInhandInventoryEndPoint(username), 'GET').then(
      json => {
        console.log(json);
        this.setState({loadingData: false, refreshing: false});

        if (json.data.Success === '1') {
          this.setState({
            otpList: _.get(json, 'data.Response'),
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
  textBold = text => <Text style={styles.labelText}>{text}</Text>;
  textNormal = text => <Text style={styles.textShow}>{text}</Text>;

  oneLineMethod = (key, value, value1) => (
    <View style={styles.oneLineView}>
      <View style={styles.leftView}>{this.textNormal(key)}</View>
      <View style={[styles.rightView, styles.borderRight]}>
        <Text style={styles.descriptionText}>{value}</Text>
      </View>
      <View style={styles.rightLable}>
        <Text style={[styles.descriptionText, styles.textRight]}>{value1}</Text>
      </View>
    </View>
  );
  secondLineMethod = (key, value, value1) => (
    <View style={styles.oneLineView}>
      <View style={styles.leftView}>{this.textNormal(key)}</View>
      <View style={[styles.rightView, styles.borderRight]}>
        <Text style={styles.descriptionText}>{value}</Text>
      </View>
      <View style={styles.rightLable}>
        <Text style={styles.labelText}>OTP: {value1}</Text>
      </View>
    </View>
  );

  arrayLineMethod = (key, value) => (
    <View style={[styles.oneLineView, styles.paddingBottom5]}>
      {/* <View style={styles.leftView}>{this.textBold(key)}</View> */}
      <View style={styles.rightView}>
        {value &&
          value.split(',').map((res, index) => (
            <View style={styles.viewSerialNo} key={`${index}_string`}>
              <Text style={styles.descriptionText}>{res}</Text>
            </View>
          ))}
      </View>
    </View>
  );

  renderItem = item => (
    <View style={styles.seprationView}>
      <View style={styles.spView} />
      {this.arrayLineMethod('Serial No', item.Serials)}
      {this.oneLineMethod(
        'Remark',
        item.HandoverRemark,
        moment(item.OTPDate).format('YYYY-MM-DD'),
      )}
      {this.secondLineMethod('Request By', item.OTPFor, item.OTP)}
      {/* {this.oneLineMethod('OTP', item.OTP)}
      {this.oneLineMethod(
        'OTP Date',
        moment(item.OTPDate).format('YYYY-MM-DD HH:MM'),
      )}
      {this.oneLineMethod('OTP For', item.OTPFor)} */}
    </View>
  );
  _onRefresh() {
    this.setState({
      refreshing: true,
    });
    this.getUserInfo();
  }

  render() {
    const {loadingData, otpList, refreshing} = this.state;

    return (
      <SafeAreaView style={styles.flex1}>
        <Header title={'Inventory OTP'} left="menu" />
        {loadingData ? (
          <View style={styles.spinnerView}>
            <SpinnerView />
          </View>
        ) : null}
        <View style={styles.container}>
          <FlatList
            data={otpList}
            keyboardShouldPersistTaps={'handled'}
            contentContainerStyle={{flexGrow: 1}}
            keyExtractor={item => `${item.OTP}_otp`}
            ListEmptyComponent={() => this.noItemFound()}
            style={styles.flatListCss}
            extraData={this.state}
            renderItem={({item, index}) => this.renderItem(item, index)}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => this._onRefresh()}
              />
            }
          />
        </View>
      </SafeAreaView>
    );
  }
}
export default OTPListInhandInventory;
