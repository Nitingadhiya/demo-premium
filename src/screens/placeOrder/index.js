import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Picker,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import _ from 'lodash';
import RNOtpVerify from 'react-native-otp-verify';
import CodeInput from 'react-native-confirmation-code-input';
import APICaller from '../../utils/api-caller';
import {MIcon} from '../../common/assets/vector-icon';
import PListItem from '../../components/product-list';
import {
  getItemTypeListEndPoint,
  getSystemTypeListEndPoint,
  addSystemEndPoint,
} from '../../config/api-endpoint';
import styles from './styles';
import {Matrics, Color} from '../../common/styles';
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
      this.setState({
        userInfo,
      });
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

  getProductList(UserName) {
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
      } else {
        this.setState({
          cartListArr: [],
          totalAmount: 0,
          subTotalAmount: 0,
          totalDiscount: 0,
          filterResult: [],
          refreshing: false,
          displayResult: true,
          loader: false,
          loadingData: false,
        });
      }
    });
  }

  removeWishListCart(productNumber, type, systemPackage) {
    const index = _.findIndex(this.state.cartListArr, {
      ProductNo: productNumber,
    });
    if (
      this.state.cartListArr.length > 0 &&
      this.state.cartListArr[index].CartQty === 1
    ) {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove item?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Ok',
            onPress: () =>
              this.removeCartItem(productNumber, type, systemPackage),
          },
        ],
        {cancelable: false},
      );
    } else {
      this.removeCartItem(productNumber, type, systemPackage);
    }
  }

  async removeCartItem(productNumber, type, systemPackage) {
    const index = _.findIndex(this.state.cartListArr, {
      ProductNo: productNumber,
    });
    this.setState({loadingData: true});
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    if (!userInfo) return;
    let packageType = '';
    if (systemPackage === 'Silver') {
      packageType = 'S';
    }
    if (systemPackage === 'Platinum') {
      packageType = 'P';
    }
    if (systemPackage === 'Gold') {
      packageType = 'G';
    }
    const endPoint = `RemoveWishCart?ProductNo=${productNumber}&Username=${userInfo.UserName}&WishCart=${type}&OrderType=${packageType}`;

    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      console.log(json, 'json');
      this.setState({loadingData: false});
      if (json.data.Success === 1 || json.data.Success === '1') {
        if (this.state.cartListArr[index].CartQty === 1) {
          this.state.cartListArr.splice(index, 1);
          let cartItm = JSON.stringify(this.state.cartListArr);
          this.setState({
            cartListArr: json.data.Response, //JSON.parse(cartItm),
            totalAmount: json.data.TotalAmountWithDiscount || 0,
            subTotalAmount: json.data.TotalAmount || 0,
            totalDiscount: json.data.TotalDiscount || 0,
          });
        } else {
          this.state.cartListArr[index].CartQty--;
        }
      } else {
        this.setState({
          loginError: json.data.Message,
        });
      }
      this.setState({loadingData: false});
    });
  }

  async onRefresh() {
    await this.setState({refreshing: true});
    this.getProductList(this.state.userInfo.UserName);
  }

  render() {
    const {loadingData, partList, userInfo} = this.state;
    const {navigation} = this.props;
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
                  padding: Matrics.ScaleValue(5),
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  Payment Option
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: Color.primary,
                  }}>
                  Cash on Delivery
                </Text>
              </View>
              <View
                style={{
                  width: Matrics.screenWidth,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#e5e5e5',
                  alignItems: 'center',
                  paddingHorizontal: Matrics.ScaleValue(10),
                }}>
                <Text style={{fontSize: 14}}>Address</Text>
                <TouchableOpacity
                  style={{padding: Matrics.ScaleValue(8)}}
                  onPress={() =>
                    NavigationHelper.navigate(navigation, 'UpdateAddress')
                  }>
                  <Text>Edit</Text>
                </TouchableOpacity>
              </View>
              <View>
                {userInfo && (
                  <View style={{padding: Matrics.ScaleValue(10)}}>
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
                <MIcon name="shopping-cart" size={20} color="white" />
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
              onPress={() =>
                NavigationHelper.navigate(navigation, 'ProductList')
              }
              style={{
                backgroundColor: Color.primary,
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
