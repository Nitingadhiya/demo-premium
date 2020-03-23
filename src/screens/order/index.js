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
    leadInfoModal: false,
    systemConfig: [],
    systemName: '',
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

  LeadInfo(lead) {
    this.setState({
      leadInfoModal: true,
      systemName: lead.SystemName,
      systemConfig: lead.SystemConfig.split(','),
    });
  }

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
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.leadInfoModal}
          onRequestClose={() => {
            this.setState({leadInfoModal: false});
          }}>
          <View
            style={{
              height: '100%',
              backgroundColor: 'rgba(0,0,0,00.5)',
              width: Matrics.screenWidth,
              //margin: 20,
              alignSelf: 'center',
              shadowColor: '#000',
              shadowOffset: {width: 5, height: 5},
              elevation: 8,
              alignItems: 'center',
              justifyContent: 'center',
              //marginTop: Matrics.screenHeight / 2 - 75,
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                // height: Matrics.ScaleValue(160),
                width: Matrics.screenWidth - 40,
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 40,
                  width: '100%',
                  borderColor: '#ccc',
                  borderBottomWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: 'black', fontSize: 16}}>Lead Info</Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  padding: 10,
                  width: '100%',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 16,
                    marginTop: 10,
                  }}>
                  <Text style={{fontWeight: 'bold'}}>
                    {this.state.systemName || 'No Lead info Found'}
                  </Text>{' '}
                </Text>

                {this.state.systemConfig.map(res => {
                  return (
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 14,
                        marginTop: 5,
                        textAlign: 'left',
                      }}>
                      {res.replace(/^\s+/g, '')}
                    </Text>
                  );
                })}
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: Color.primary,
                  height: 40,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => this.setState({leadInfoModal: false})}>
                <Text
                  style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}
export default Order;
