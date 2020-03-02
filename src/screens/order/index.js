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

class Order extends Component {
  state = {
    orderItem: null,
    orderNotText: null,
  };

  componentDidMount() {
    this.getUserInfo();
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
        <Text style={{color: 'grey', fontSize: 16}}>
          Your Wishlist is empty
        </Text>
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
    this.getWishlist();
  };

  render() {
    const {loadingData, refreshing, orderItem, orderNotText} = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={styles.safeView}>
        <Appbar.Header>
          <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
          <Appbar.Content title={'Order'} />
        </Appbar.Header>
        {loadingData ? <SpinnerView /> : null}
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
              return (
                <POrder
                  data={res}
                  key={`${index.toString()}`}
                  onPress={() => this.LeadInfo(res)}
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
      </SafeAreaView>
    );
  }
}
export default Order;
