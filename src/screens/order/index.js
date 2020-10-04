import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  RefreshControl,
  ScrollView,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Modal,
  Alert,
} from 'react-native';
import _ from 'lodash';
import {Appbar, Avatar, useTheme, Badge} from 'react-native-paper';
import CodeInput from 'react-native-confirmation-code-input';
import APICaller from '../../utils/api-caller';
import {getOrderListEndPoint} from '../../config/api-endpoint';
import {MIcon} from '../../common/assets/vector-icon';
import styles from './styles';
import {Matrics, Color} from '../../common/styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';
import {SpinnerView} from '../../common/components';
import POrder from '../../components/order';
import OrderInformationModal from '../../components/order-information-modal';

class Order extends Component {
  state = {
    orderItem: null,
    orderNotText: null,
    leadInfoModal: false,
    systemConfig: [],
    systemName: '',
    loadingData: false,
  };

  componentDidMount() {
    this.getUserInfo();
    Events.on('order-refresh', 'refresh', () => this.getUserInfo());
    Events.on('loader-show', 'loader', val => {
      this.setState({
        loadingData: val,
      });
    });
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });
    this.getOrderList(userInfo.UserName);
  }

  getOrderList(userName) {
    if (!this.state.refreshing) this.setState({loadingData: true});
    APICaller(getOrderListEndPoint(userName), 'GET').then(json => {
      console.log(json, 'json');
      if (json.data.Success === 1 || json.data.Success === '1') {
        this.setState({
          orderItem: json.data.Response,
        });
      } else {
        this.setState({
          orderNotText: json.data.Message,
        });
      }
      this.setState({loadingData: false, refreshing: false});
    });
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
        <Text style={{color: 'grey', fontSize: 16}}>No Order Found</Text>
      </View>
    );
  };
  productDetails(item) {
    NavigationHelper.navigate(this.props.navigation, 'ProductDetails', {
      productNo: item.ProductNo,
    });
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getUserInfo();
  };

  LeadInfo(lead) {
    Events.trigger('order-information-show', lead);
    // this.setState({
    //   leadInfoModal: true,
    //   systemName: lead.SystemName,
    //   systemConfig: lead.SystemConfig.split(','),
    // });
  }

  async verifyOrder(orderNo, index) {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    if (!userInfo) return;
    const userName = userInfo.UserName;
    this.setState({
      loadingData: true,
    });
    APICaller(
      `VerifyOrder?OrderNo=${orderNo}&LoginUser=${userName}`,
      'GET',
    ).then(json => {
      this.setState({
        loadingData: false,
      });

      if (json.data.Success === '1') {
        Alert.alert(`Success`, json.data.Message);
        this.state.orderItem[index].IsAdvanceVerificationRequired = 2;
        this.setState({
          orderItem: this.state.orderItem,
        });
      } else {
        Alert.alert(
          `Error code - ${json.status}`,
          json.data.Message || 'Something went to wrong, please try again.',
        );
      }
    });
  }

  render() {
    const {loadingData, refreshing, orderItem, orderNotText} = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={styles.safeView}>
        <Appbar.Header style={styles.headerBg}>
          <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
          <Appbar.Content title={'Order'} />
        </Appbar.Header>

        <ScrollView
          style={{padding: 10, backgroundColor: '#eee', flex: 1}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          {orderItem ? (
            orderItem.map((res, index) => {
              console.log(res, 'res**');
              return (
                <POrder
                  data={res}
                  key={`${index.toString()}`}
                  onPress={() => this.LeadInfo(res)}
                  plugOnPress={() => this.verifyOrder(res.OrderNo, index)}
                />
              );
            })
          ) : (
            <View style={styles.noOrderView}>
              <Text style={styles.noOrderText}>{orderNotText}</Text>
            </View>
          )}
          <View style={{marginBottom: 10}} />
        </ScrollView>

        <OrderInformationModal userInfo={userInfo} navigation={navigation} />
        {loadingData ? (
          <View style={styles.spinnerView}>
            <SpinnerView />
          </View>
        ) : null}
      </SafeAreaView>
    );
  }
}
export default Order;
