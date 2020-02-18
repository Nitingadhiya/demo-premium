// LIBRARIES
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  AsyncStorage,
  Dimensions,
  ScrollView,
} from 'react-native';
import Spinner from 'react-native-spinkit';
import _ from 'lodash';
import {Images, Color, Matrics} from '../../common/styles';
import {MIcon} from '../../common/assets/vector-icon';
import APICaller from '../../utils/api-caller';

class ServicePackage extends Component {
  state = {
    loadingData: false,
    cartListArr: [],
    userInfo: null,
    serviceSupport: [
      {
        text: 'Service Support 1-Year (Offsite)',
        silver: true,
        gold: true,
        platinum: true,
      },
      {
        text: 'Service Support 1-Year (Onsite)',
        silver: false,
        gold: true,
        platinum: true,
      },
      {
        text: 'Lifetime free Service Support',
        silver: false,
        gold: false,
        platinum: true,
      },
      {
        text: 'Warranty Support 1-Year (Onsite)',
        silver: false,
        gold: false,
        platinum: true,
      },
      {
        text: 'Warranty Support 1-Year (Offsite)',
        silver: false,
        gold: true,
        platinum: true,
      },
      {
        text: 'Lifetime Parts Protection or Return Order Responsibility',
        silver: false,
        gold: true,
        platinum: true,
      },
      {
        text: 'Full Money Back Guarantee',
        silver: false,
        gold: true,
        platinum: true,
      },
      {
        text: 'Challenging Spot Replacement or Return Order Under Warranty',
        silver: false,
        gold: false,
        platinum: true,
      },
      {
        text: 'Non-Repaired Spare Guaranteed',
        silver: true,
        gold: true,
        platinum: true,
      },
      {
        text: 'Real Replacement Guarrantee',
        silver: false,
        gold: true,
        platinum: true,
      },
    ],
    packageSelect: 'platinum',
    priceRate: 0,
    onlineDiscount: 0,
    shipping: 0,
  };
  // ------------>>>LifeCycle Methods------------->>>

  componentDidMount() {
    this.params = this.props.navigation.state.params;
    this.setState({
      priceRate: this.params.item.PlatinumRate,
      onlineDiscount: this.params.item.OnlineDiscount,
      shipping: this.params.item.shipping || 0,
      packageSelect: this.selectedPackageOption(this.params.item),
    });
  }

  selectedPackageOption(item) {
    if (item.IsPlatinum) {
      return 'platinum';
    }
    if (item.IsGold) {
      return 'gold';
    }
    if (item.IsSilver) {
      return 'silver';
    }
  }

  addWishListCart(productNumber, type) {
    this.setState({loadingData: true});
    AsyncStorage.getItem('userInfo').then(getUser => {
      const result = JSON.parse(getUser);
      let UserName = '';
      if (result) {
        UserName = result.UserName;
      }
      const endPoint = `InsertWishCart?ProductNo=${productNumber}&Username=${UserName}&WishCart=${type}`;
      const method = 'GET';
      APICaller(`${endPoint}`, method).then(json => {
        if (json.data.Success === 1 || json.data.Success === '1') {
          const index = _.findIndex(this.state.cartListArr, {
            ProductNo: productNumber,
          });
          this.state.cartListArr[index].CartQty++;
        } else {
          this.setState({
            loginError: json.data.Message,
          });
        }
        this.setState({loadingData: false});
      });
    });
  }

  selectPackageServices(value) {
    this.setState({
      packageSelect: value,
    });
    if (value === 'gold') {
      this.setState({
        priceRate: this.params.item.GoldRate,
      });
    } else if (value === 'silver') {
      this.setState({
        priceRate: this.params.item.SilverRate,
      });
    } else if (value === 'platinum') {
      this.setState({
        priceRate: this.params.item.PlatinumRate,
      });
    }
  }

  addToCart(data) {
    const item = data.item;
    let orderType;
    if (this.state.packageSelect === 'platinum') {
      orderType = 'P';
    } else if (this.state.packageSelect === 'silver') {
      orderType = 'S';
    } else if (this.state.packageSelect === 'gold') {
      orderType = 'G';
    }
    if (!orderType) return;

    this.setState({loadingData: true});
    AsyncStorage.getItem('userInfo').then(getUser => {
      const result = JSON.parse(getUser);
      let UserName = '';
      if (result) {
        UserName = result.UserName;
      }
      const endPoint = `InsertWishCart?ProductNo=${item.ProductNo}&Username=${UserName}&WishCart=CART&OrderType=${orderType}`;
      console.log(endPoint, 'end');
      const method = 'GET';
      APICaller(`${endPoint}`, method).then(json => {
        this.setState({loadingData: false});
        if (json.data.Success === 1 || json.data.Success === '1') {
          this.navigateCartList();
          // add badge count
        }
      });
    });
  }

  navigateCartList() {
    AsyncStorage.getItem('userInfo').then(res => {
      if (res) {
        const result = JSON.parse(res);
        if (result) {
          const {UserName} = result;
          this.setState({
            UserName,
          });
          //this.props.navigation.navigate('CartList');
          this.props.navigation.navigate('PlaceOrder');
        }
      } else {
        this.props.navigation.navigate('Login');
      }
    });
  }

  render() {
    const {
      userInfo,
      serviceSupport,
      packageSelect,
      priceRate,
      shipping,
      onlineDiscount,
    } = this.state;
    const netAmount = priceRate - onlineDiscount + shipping;
    return (
      <SafeAreaView style={{flex: 1}}>
        {this.state.loadingData ? (
          <View style={styles.spinnerView}>
            <Spinner
              color={Color.primary}
              isVisible={true}
              type="ThreeBounce"
              size={60}
            />
          </View>
        ) : null}
        <ScrollView style={{flex: 1}}>
          <View style={{flex: 1, borderWidth: 1, borderColor: '#aaa'}}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.hView}>
                <Text style={[styles.tableHeaderText, styles.txtLeft]}>
                  Package Details
                </Text>
              </View>
              <View style={styles.hViewRight}>
                <Text style={[styles.tableHeaderText, styles.headerTText]}>
                  Silver
                </Text>
              </View>
              <View style={styles.hViewRight}>
                <Text style={[styles.tableHeaderText, styles.headerTText]}>
                  Gold
                </Text>
              </View>
              <View style={styles.hViewRight}>
                <Text style={[styles.tableHeaderText, styles.headerTText]}>
                  Platinum
                </Text>
              </View>
            </View>
            {serviceSupport.map((res, index) => (
              <View style={{flexDirection: 'row'}} key={index.toString()}>
                <View style={styles.hView}>
                  <Text style={styles.packageTxt}>{res.text}</Text>
                </View>
                <View
                  style={[
                    styles.hViewRight,
                    styles.txtcenter,
                    {
                      backgroundColor: res.silver
                        ? 'lightgreen'
                        : 'rgba(255,0,0,0.5)',
                    },
                  ]}>
                  <Icon
                    name={res.silver ? 'check' : 'close'}
                    size={Matrics.ScaleValue(25)}
                    color={'black'}
                  />
                </View>
                <View
                  style={[
                    styles.hViewRight,
                    styles.txtcenter,
                    {
                      backgroundColor: res.gold
                        ? 'lightgreen'
                        : 'rgba(255,0,0,0.5)',
                    },
                  ]}>
                  <Icon
                    name={res.gold ? 'check' : 'close'}
                    size={Matrics.ScaleValue(25)}
                    color={'black'}
                  />
                </View>
                <View
                  style={[
                    styles.hViewRight,
                    styles.txtcenter,
                    {
                      backgroundColor: res.platinum
                        ? 'lightgreen'
                        : 'rgba(255,0,0,0.5)',
                    },
                  ]}>
                  <Icon
                    name={res.platinum ? 'check' : 'close'}
                    size={Matrics.ScaleValue(25)}
                    color={'black'}
                  />
                </View>
              </View>
            ))}
            <View style={{flexDirection: 'row'}}>
              <View style={styles.hView}>
                <Text style={[styles.tableHeaderText, styles.txtLeft]}>
                  Select Package Now
                </Text>
              </View>
              <View style={styles.hViewRight}>
                <TouchableOpacity
                  onPress={() => this.selectPackageServices('silver')}
                  style={styles.touchRadioButton}
                  disabled={this.params && !this.params.item.IsSilver}>
                  {this.params && this.params.item.IsSilver ? (
                    <Icon
                      name={
                        packageSelect === 'silver'
                          ? 'radio-button-checked'
                          : 'radio-button-unchecked'
                      }
                      size={Matrics.ScaleValue(20)}
                      color={'black'}
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: 14,
                        color: 'black',
                        fontFamily: 'Roboto-Regular',
                      }}>
                      N/A
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.hViewRight}>
                <TouchableOpacity
                  onPress={() => this.selectPackageServices('gold')}
                  style={styles.touchRadioButton}
                  disabled={this.params && !this.params.item.IsGold}>
                  {this.params && this.params.item.IsGold ? (
                    <Icon
                      name={
                        packageSelect === 'gold'
                          ? 'radio-button-checked'
                          : 'radio-button-unchecked'
                      }
                      size={Matrics.ScaleValue(20)}
                      color={'black'}
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: 14,
                        color: 'black',
                        fontFamily: 'Roboto-Regular',
                      }}>
                      N/A
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.hViewRight}>
                <TouchableOpacity
                  onPress={() => this.selectPackageServices('platinum')}
                  style={styles.touchRadioButton}
                  disabled={this.params && !this.params.item.IsPlatinum}>
                  {this.params && this.params.item.IsPlatinum ? (
                    <Icon
                      name={
                        packageSelect === 'platinum'
                          ? 'radio-button-checked'
                          : 'radio-button-unchecked'
                      }
                      size={Matrics.ScaleValue(20)}
                      color={'black'}
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: 14,
                        color: 'black',
                        fontFamily: 'Roboto-Regular',
                      }}>
                      N/A
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.viewTandC}>
              <Text style={styles.tandcText}>
                T&C Apply: # No third party transferable Support{' '}
              </Text>
            </View>
            <View style={styles.viewPriceMain}>
              <View style={styles.firstMainPrice}>
                <View style={styles.priceView}>
                  <Text style={styles.priceViewText}>Price: </Text>
                  <View style={styles.viewShipping}>
                    <Text style={[styles.priceViewText, styles.shipStyles]}>
                      {priceRate.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View style={styles.priceView}>
                  <Text style={styles.priceViewText}>Shipping: </Text>
                  <View style={styles.viewShipping}>
                    <Text style={[styles.priceViewText, styles.shipStyles]}>
                      {shipping.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View style={styles.priceView}>
                  <Text style={styles.priceViewText}>Discount: </Text>
                  <View style={styles.viewShipping}>
                    <Text style={[styles.priceViewText, styles.shipStyles]}>
                      {onlineDiscount.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View style={styles.priceView}>
                  <Text style={[styles.priceViewText, styles.spicalPrice]}>
                    Spacial Price:{' '}
                  </Text>
                  <View style={styles.viewShipping}>
                    <Text
                      style={[
                        styles.priceViewText,
                        styles.shipStyles,
                        styles.netAmoutText,
                      ]}>
                      {netAmount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={[styles.firstMainPrice, styles.firstBorderMainView]}>
                <Text style={styles.selectPackageText}>
                  : Selected Package :{' '}
                </Text>
                <Text style={styles.packageName}>
                  {packageSelect.toUpperCase()}
                </Text>
                <TouchableOpacity
                  style={styles.addtocartView}
                  onPress={() => this.addToCart(this.params)}>
                  <Text style={styles.addtocartText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

//= =====STYLES DECLARATION======//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  tableHeaderText: {
    fontSize: 15, //Matrics.ScaleValue(16),
    fontWeight: '500',
    textAlign: 'center',
    color: 'black',
  },
  txtLeft: {
    textAlign: 'left',
  },
  hView: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#dedede',
    justifyContent: 'center',
    //paddingVertical: Matrics.ScaleValue(5),
    paddingHorizontal: Matrics.ScaleValue(4),
  },
  hViewRight: {
    flex: 0.3,
    borderWidth: 0.5,
    borderColor: '#dedede',
    paddingVertical: Matrics.ScaleValue(5),
  },
  txtcenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageTxt: {
    color: 'black',
    fontSize: 12, //Matrics.ScaleValue(12),
    fontFamily: 'Roboto-Regular',
  },
  tandcText: {
    color: 'white',
    fontSize: 11, //Matrics.ScaleValue(11),
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
  viewTandC: {
    backgroundColor: 'black',
    padding: Matrics.ScaleValue(5),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  priceView: {
    flexDirection: 'row',
    paddingTop: Matrics.ScaleValue(5),
    flexWrap: 'wrap',
  },
  selectPackageText: {
    fontSize: 15, //Matrics.ScaleValue(13),
    color: 'black',
    marginTop: 5,
    fontFamily: 'Roboto-Regular',
  },
  packageName: {
    fontSize: Matrics.ScaleValue(14),
    color: 'black',
    fontWeight: 'bold',
    marginVertical: Matrics.ScaleValue(10),
  },
  viewPriceMain: {
    flexDirection: 'row',
  },
  firstMainPrice: {
    flex: 0.5,
    alignItems: 'flex-end',
    marginTop: 5,
  },
  firstBorderMainView: {
    borderLeftWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    paddingBottom: Matrics.ScaleValue(10),
  },
  headerTText: {
    fontWeight: 'normal',
    fontSize: 12, //Matrics.ScaleValue(14),
    fontFamily: 'Roboto-Regular',
  },
  addtocartView: {
    backgroundColor: Color.primary,
    padding: Matrics.ScaleValue(10),
    width: Matrics.ScaleValue(120),
    borderRadius: Matrics.ScaleValue(5),
    alignItems: 'center',
  },
  addtocartText: {
    color: 'white',
    fontSize: 16, //Matrics.ScaleValue(14),
    fontFamily: 'Roboto-Bold',
  },
  priceViewText: {
    fontSize: 14, //Matrics.ScaleValue(13),
    color: 'black',
    fontFamily: 'Roboto-Regular',
  },
  viewShipping: {
    width: Matrics.ScaleValue(65),
    alignItems: 'flex-end',
    paddingRight: Matrics.ScaleValue(5),
  },
  spicalPrice: {
    fontWeight: 'bold',
  },
  touchRadioButton: {
    alignItems: 'center',
  },
  netAmoutText: {
    fontWeight: 'bold',
  },
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    top: '45%',
  },
  spinnerViewPOS: {
    position: 'absolute',
    zIndex: 1,
    top: '45%',
    left: '40%',
  },
});

export default ServicePackage;
