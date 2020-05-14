import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  Alert,
  Picker,
} from 'react-native';
import _ from 'lodash';
import {CommonActions} from '@react-navigation/native';
import {TextInputView, SpinnerView} from '../../common/components';
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import {Color, Matrics} from '../../common/styles';
import styles from './styles';
import Helper from '../../utils/helper';
import APICaller from '../../utils/api-caller';
import {
  forwardOrderEndPoint,
  getUsersForHandOverEndPoint,
  orderReadyToDeliverEndPoint,
} from '../../config/api-endpoint';
import NavigationHelper from '../../utils/navigation-helper';
import Events from '../../utils/events';

let self;
class OrderInformationModal extends Component {
  state = {
    orderModal: false,
    item: null,
    itemScanSerialNo: 0,
    errorMessage: null,
    orderForUser: null,
    userList: [],
  };

  componentDidMount() {
    self = this;
    Events.on('order-information-show', 'show-modal', res => {
      this.setState({
        orderModal: true,
        item: res,
      });
    });
    const {userInfo} = this.props;
    if (userInfo) this.getUsersForHandOver(userInfo.UserName);
  }

  getUsersForHandOver(userName) {
    APICaller(getUsersForHandOverEndPoint, 'GET').then(json => {
      if (json.data.Success === '1') {
        const list = json.data.Response;
        const arr = [];
        list.map(
          res =>
            res.UserName.toLowerCase() != userName.toLowerCase() &&
            arr.push(res),
        );
        this.setState({
          userList: arr,
          orderForUser: arr[0].UserName,
        });
      }
    });
  }
  getChangeValue(value) {
    this.setState({orderForUser: value});
  }

  addOrderPart(navigation, item) {
    this.setState({orderModal: false});
    NavigationHelper.navigate(navigation, 'OrderComponentRequest', {
      orderNo: item.OrderNo,
      systemTag: item.SystemTag,
    });
  }

  forwardOrder() {
    const {orderForUser, item} = this.state;
    const {userInfo} = this.props;
    if (!orderForUser) {
      return;
    }
    Events.trigger('loader-show', true);
    this.setState({orderModal: false});
    APICaller(
      forwardOrderEndPoint(item.OrderNo, userInfo.UserName, orderForUser),
      'GET',
    ).then(json => {
      Events.trigger('loader-show', false);
      if (json.data.Success === '1') {
        Events.trigger('order-refresh');
        Alert.alert('Success', _.get(json, 'data.Message', 'Sucess'));
      } else {
        Alert.alert('Failed', _.get(json, 'data.Message', 'Error'));
      }
    });
  }

  finishOrder() {
    const {item} = this.state;
    const {userInfo} = this.props;
    if (!item.OrderNo || !item.CustomerUserName) {
      Alert.alert('Alert', item.OrderNo || item.CustomerUserName);
      return;
    }
    this.setState({orderModal: false});
    Events.trigger('loader-show', true);
    APICaller(
      orderReadyToDeliverEndPoint(
        item.OrderNo,
        userInfo.UserName,
        item.CustomerUserName,
      ),
      'GET',
    ).then(json => {
      Events.trigger('loader-show', false);
      if (json.data.Success === '1') {
        Events.trigger('order-refresh');
        Alert.alert('Success', _.get(json, 'data.Message', 'Sucess'));
      } else {
        Alert.alert('Failed', _.get(json, 'data.Message', 'Error'));
      }
    });
  }

  render() {
    const {userList, item, orderForUser} = this.state;
    const {navigation, userInfo} = this.props;
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.orderModal}
          onRequestClose={() => {
            this.setState({orderModal: false});
          }}>
          {item ? (
            <View style={styles.container}>
              <View style={styles.subContainer}>
                <View style={styles.headerView}>
                  <Text style={styles.leadText}>Lead Info</Text>
                  <TouchableOpacity
                    style={styles.closeIconButton}
                    onPress={() => this.setState({orderModal: false})}>
                    <MIcon name="close" size={22} color={Color.black} />
                  </TouchableOpacity>
                </View>
                <View style={styles.displayItemView}>
                  <Text style={styles.textNoDisplay}>
                    <Text style={styles.fontWeightBold}>
                      {item.SystemName || 'No Lead info Found'}
                    </Text>{' '}
                  </Text>
                  {item &&
                    item.SystemConfig &&
                    item.SystemConfig.split(',').map((res, index) => {
                      return (
                        <Text key={`${index}_info`} style={styles.infoText}>
                          {res.replace(/^\s+/g, '')}
                        </Text>
                      );
                    })}
                  {userInfo &&
                  (userInfo.LoginType == '1' ||
                    userInfo.LoginType == '2' ||
                    userInfo.LoginType == '3') ? (
                    <View style={styles.pickerView}>
                      <Picker
                        prompt="Choose below user"
                        style={styles.picker}
                        selectedValue={orderForUser}
                        onValueChange={(itemValue, itemIndex) => {
                          this.getChangeValue(itemValue);
                        }}>
                        {userList &&
                          userList.map((data, index) => {
                            return (
                              <Picker.Item
                                label={
                                  data.FullName + ' (' + data.UserType + ')'
                                }
                                value={data.UserName}
                                key={`${index.toString()}`}
                              />
                            );
                          })}
                      </Picker>
                    </View>
                  ) : null}
                  {userInfo &&
                  (userInfo.LoginType == '1' ||
                    userInfo.LoginType == '2' ||
                    userInfo.LoginType == '3') ? (
                    <View style={styles.buttonView}>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => this.addOrderPart(navigation, item)}>
                        <Text style={styles.buttonText}>Add Part</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => this.forwardOrder()}>
                        <Text style={styles.buttonText}>Forward</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.closeButton, styles.brdRight0]}
                        onPress={() => this.finishOrder()}>
                        <Text style={styles.buttonText}>Finish</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          ) : null}
        </Modal>
      </View>
    );
  }
}
export default OrderInformationModal;
