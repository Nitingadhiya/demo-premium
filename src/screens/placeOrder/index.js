import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Picker,
  TouchableOpacity,
  Alert,
} from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import CodeInput from 'react-native-confirmation-code-input';
import APICaller from '../../utils/api-caller';
import {
  getItemTypeListEndPoint,
  getSystemTypeListEndPoint,
  addSystemEndPoint,
} from '../../config/api-endpoint';
import styles from './styles';
import {Matrics} from '../../common/styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';
import {SpinnerView, TextInputView, Header} from '../../common/components';

class PlaceOrder extends Component {
  state = {
    loadingData: false,
    cartListArr: [],
    userInfo: null,
    refreshing: false,
    totalAmount: 0,
    subTotalAmount: 0,
    totalDiscount: 0,
  };

  async componentDidMount() {
    const {route} = this.props;
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    if (userInfo) {
      this.getUserDetails(userInfo.UserName);
      this.getProductList(userInfo.UserName);
    }
    Events.on('updateAddress', 'place order', res => {
      _.merge(this.state.userInfo, res);
      const update = JSON.stringify(this.state.userInfo);
      this.setState({
        userInfo: JSON.parse(update),
      });
    });
  }

  getUserDetails(UserName) {
    if (!UserName) {
      Alert.alert('Invalid username');
      return;
    }
    this.setState({loadingData: true});
    const endPoint = `UserProfile?Username=${UserName}`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      this.setState({loadingData: false});
      if (json.data.Success === '1') {
        const userInfo = json.data.Response;
        this.setState({
          userInfo,
        });
        Helper.setLocalStorageItem('userInfo', userInfo);
      } else {
        this.setState({
          loginError: json.data.Message,
        });
      }
    });
  }

  getProductList() {
    if (!this.state.refreshing) {
      this.setState({loadingData: true});
    }
    const endPoint = `GetProductList?ProductNo=&Username=${UserName}&WishCart=Cart`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      console.log(json, 'json');
      if (json.data.Success === 1 || json.data.Success === '1') {
        const productList = {product: json.data.Response};

        this.rspData = json.data;
        Events.trigger('fetchCartCount', json.data.Response.length || 0);
        this.setState({
          cartListArr: json.data.Response,
          totalAmount: json.data.TotalAmountWithDiscount || 0,
          subTotalAmount: json.data.TotalAmount || 0,
          totalDiscount: json.data.TotalDiscount || 0,
          filterResult: json.data.Response,
          refreshing: false,
          displayResult: true,
          loader: false,
          loadingData: false,
        });
      }
    });
  }

  render() {
    const {loadingData, partList} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header title="Place Order" left="back" />
        {loadingData ? <SpinnerView /> : null}
        {this.state.cartListArr && this.state.cartListArr.length > 0 ? (
          <View style={{flex: 1}}>
            <FlatList
              data={this.state.cartListArr}
              showsVerticalScrollIndicator={false}
              style={{flex: 1}}
              extraData={this.state}
              onRefresh={() => this.onRefresh()}
              refreshing={this.state.refreshing}
              renderItem={({item}) => (
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {item.Cart && item.CartQty > 0 && (
                    <PListItem
                      data={item}
                      productDetails={() => this.productDetails(item)}
                      removeWishListCart={() =>
                        this.removeWishListCart(
                          item.ProductNo,
                          'CART',
                          item.SystemPackage,
                        )
                      }
                      addWishListCart={() =>
                        this.addWishListCart(item.ProductNo, 'CART')
                      }
                      placeOrder
                      userInfo={userInfo}
                      buyNow={() => this.buyNow()}
                    />
                  )}
                </View>
              )}
            />
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: Metrics.ScaleValue(5),
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  Payment Option
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: Colors.APP_COLOR,
                  }}>
                  Cash on Delivery
                </Text>
              </View>
              <View
                style={{
                  width: Dimensions.get('window').width,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#e5e5e5',
                  alignItems: 'center',
                  paddingHorizontal: Metrics.ScaleValue(10),
                }}>
                <Text style={{fontSize: 14}}>Address</Text>
                <TouchableOpacity
                  style={{padding: Metrics.ScaleValue(8)}}
                  onPress={() =>
                    this.props.navigation.navigate('UpdateAddress')
                  }>
                  <Text>Edit</Text>
                </TouchableOpacity>
              </View>
              <View>
                {userInfo && (
                  <View style={{padding: Metrics.ScaleValue(10)}}>
                    <Text style={{fontSize: 16}}>
                      <Text style={{fontWeight: 'bold'}}>
                        {userInfo.FirstName} {userInfo.LastName}
                        {'\n'}
                      </Text>
                      <Text>
                        {userInfo.MobileNo}
                        {'\n'}
                      </Text>
                      <Text>
                        {userInfo.Home}
                        {'\n'}
                      </Text>
                      <Text>
                        {userInfo.Area}
                        {'\n'}
                      </Text>
                      <Text>
                        {userInfo.Landmark} {userInfo.Road}
                        {'\n'}
                      </Text>
                      <Text>
                        {userInfo.City} {userInfo.State} {userInfo.Pincode}
                      </Text>
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{justifyContent: 'flex-end'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  padding: 5,
                  borderColor: '#eee',
                }}>
                <Text style={{fontSize: 16}}>Subtotal</Text>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  {/* {this.totalPriceFn()}{' '} */}
                  {'₹ ' + this.state.subTotalAmount}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  padding: 5,
                  borderColor: '#eee',
                }}>
                <Text style={{fontSize: 16}}>Discount</Text>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  {/* {this.totalPriceFn()}{' '} */}
                  {'₹ ' + this.state.totalDiscount}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  padding: 5,
                  borderColor: '#eee',
                }}>
                <Text style={{fontSize: 16}}>Total</Text>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  {/* {this.totalPriceFn()}{' '} */}
                  {'₹ ' + this.state.totalAmount}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.proceedPlaceOrder()}
                style={styles.checkout}>
                <Icon name="shopping-cart" size={20} color="white" />
                <Text style={styles.checkoutText}> Place Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'grey', fontSize: 16}}>
              Your cart is empty
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('List')}
              style={{
                backgroundColor: Colors.APP_COLOR,
                width: '75%',
                height: 45,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Text style={{color: '#fff', fontSize: 16}}>Start shopping</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }
}
export default PlaceOrder;
