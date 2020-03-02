import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  LayoutAnimation,
  Image,
} from 'react-native';
import _ from 'lodash';
import Carousel from 'react-native-looped-carousel';
import {Appbar, Avatar, useTheme, Badge, Button} from 'react-native-paper';
import CodeInput from 'react-native-confirmation-code-input';
import APICaller from '../../utils/api-caller';
import {getProductDetailsEndPoint} from '../../config/api-endpoint';
import {MIcon} from '../../common/assets/vector-icon';
import styles from './styles';
import {Matrics, Color} from '../../common/styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';
import {SpinnerView, Header} from '../../common/components';
import SegmentControl from 'react-native-segment-control';

class ProductDetails extends Component {
  state = {
    userInfo: null,
    productNo: null,
    imageList: null,
    splSpec: null,
    splDesc: null,
  };

  componentDidMount() {
    this.getUserInfo();
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    const {route} = this.props;
    if (route.params) {
      this.setState({
        productNo: route.params.productNo,
        userInfo,
      });
      this.getProductDetails(route.params.productNo, userInfo.UserName);
    }
  }

  getProductDetails(productNo, userName) {
    APICaller(getProductDetailsEndPoint(productNo, userName), 'GET').then(
      json => {
        if (json.data.Success === 1 || json.data.Success === '1') {
          const res = json.data.Response[0];
          this.setState({
            productDetails: res,
            loadingData: false,
          });
          const imageSplit = res.ImageList.split(',');
          let sliderImage = [];
          imageSplit.map(image => {
            sliderImage.push({
              uri: res.Url + image.trim(),
            });
          });
          this.setState({
            imageList: sliderImage,
          });
          const splCont = res.Specification.split(',');
          this.setState({
            splSpec: splCont,
          });
          const descCont = res.Description.split(',');
          this.setState({
            splDesc: descCont,
          });
        }
      },
    );
  }

  navigateCartList(navigation) {
    NavigationHelper.navigate(navigation, 'PlaceOrder');
  }

  async addWishListCart(item, type) {
    const {navigation} = this.props;
    if (type === 'CART') {
      NavigationHelper.navigate(navigation, 'ServicePackage', {item});
      return;
    }

    this.setState({loadingData: true});
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    if (!userInfo) return;
    APICaller(
      insertWishCartEndPoint(item.ProductNo, userInfo.UserName, type),
      'GET',
    ).then(json => {
      if (json.data.Success === 1 || json.data.Success === '1') {
        //const cartCount = json.data.Response.length;
        this.fetchProductList(userInfo.UserName);
        this.setState({loadingData: false});
      }
    });
  }

  render() {
    const {productDetails, imageList, splSpec, splDesc, userInfo} = this.state;
    const {navigation} = this.props;
    const FirstRoute = () => (
      <View style={{borderTopWidth: 1, borderColor: '#ddd'}}>
        {splSpec &&
          splSpec.map((res, index) => (
            <Text style={styles.welcome} key={`${index}`}>
              {res}
            </Text>
          ))}
      </View>
    );
    const SecondRoute = () => (
      <View style={{borderTopWidth: 1, borderColor: '#ddd'}}>
        {splDesc &&
          splDesc.map((res, index) => (
            <Text style={styles.welcome} key={`${index}`}>
              {res}
            </Text>
          ))}
      </View>
    );
    const ThirdRoute = () => (
      <View style={{borderTopWidth: 1, borderColor: '#ddd'}}>
        <View style={{marginBottom: 0}}>
          {productDetails ? (
            <Text style={styles.welcome}>{productDetails.PortDetails}</Text>
          ) : null}
        </View>
      </View>
    );
    const segments = [
      {
        title: 'Specification',
        view: FirstRoute,
      },
      {
        title: 'Description',
        view: SecondRoute,
      },
      {
        title: 'Technical info',
        view: ThirdRoute,
      },
    ];
    return (
      <SafeAreaView style={{flex: 1}}>
        {this.state.loadingData ? (
          <View style={styles.spinnerView}>
            <SpinnerView />
          </View>
        ) : null}
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={'Product Details'} />
          <Appbar.Action
            icon={
              productDetails && productDetails.Wish ? 'heart' : 'heart-outline'
            }
            onPress={() => {
              if (productDetails && productDetails.Wish) {
                this.removeWishListCart(this.state.productDetailArray, 'WISH');
              } else {
                this.addWishListCart(this.state.productDetailArray, 'WISH');
              }
            }}
          />
          <Appbar.Action
            icon="cart"
            onPress={() => this.navigateCartList(navigation)}
          />
        </Appbar.Header>
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              padding: 5,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
            <Text
              style={{
                fontSize: 18,
                color: 'black',
                textAlign: 'center',
                fontFamily: 'Roboto-Bold',
              }}>
              {productDetails && productDetails.ProductName}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              //height: 230,
              paddingTop: 0,
              backgroundColor: '#f5f5f5',
            }}>
            {imageList ? (
              <Carousel style={styles.carouselView} pageInfo={false}>
                {imageList.map((data, index) => {
                  return (
                    <View style={styles.sliderImageView} key={`${index}_str`}>
                      <Image
                        source={{uri: `${data.uri}?${Math.random()}`}}
                        resizeMode="stretch"
                        style={styles.sliderImage}
                      />
                    </View>
                  );
                })}
              </Carousel>
            ) : null}
          </View>
          <SegmentControl segments={segments} />
        </ScrollView>
        {productDetails && productDetails.IsActive ? (
          <View
            style={{
              flexDirection: 'row',
              height: 50,
              justifyContent: 'center',
              borderTopWidth: 1,
            }}>
            <View
              style={{
                borderRightWidth: 1,
                borderColor: '#e5e5e5',
                width: '32.5%',
              }}>
              <Text style={{textAlign: 'center'}}>Platinum</Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Roboto-Bold',
                  fontSize: 16,
                }}>
                {productDetails.IsPlatinum
                  ? `₹ ${productDetails.PlatinumRate}`
                  : `N/A`}
              </Text>
            </View>
            <View
              style={{
                borderRightWidth: 1,
                borderColor: '#e5e5e5',
                width: '32%',
              }}>
              <Text style={{textAlign: 'center'}}>Gold</Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Roboto-Bold',
                  fontSize: 16,
                }}>
                {productDetails.IsGold ? `₹ ${productDetails.GoldRate}` : `N/A`}
              </Text>
            </View>
            <View style={{width: '32%'}}>
              <Text style={{textAlign: 'center'}}>Silver</Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Roboto-Bold',
                  fontSize: 16,
                }}>
                {productDetails.IsSilver
                  ? `₹ ${productDetails.SilverRate}`
                  : `N/A`}
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              height: 45,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Roboto-Bold',
                color: 'black',
              }}>
              Coming Soon...
            </Text>
          </View>
        )}

        {userInfo && userInfo.LoginType === '5' ? (
          <View
            style={{
              borderTopWidth: 1,
              borderColor: '#e5e5e5',
              width: '100%',
              paddingVertical: 5,
            }}>
            <Text style={{textAlign: 'center'}}>
              Dealer{' '}
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Roboto-Bold',
                  fontSize: 16,
                }}>
                ₹ {productDetails && productDetails.DealerRate}
              </Text>
            </Text>
          </View>
        ) : null}
        {userInfo && productDetails && productDetails.IsActive && (
          <Button
            mode="contained"
            onPress={() => this.addWishListCart(productDetails, 'CART')}
            style={{
              height: 40,
              backgroundColor: Color.primary,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 0,
            }}>
            Add to cart
          </Button>
        )}
      </SafeAreaView>
    );
  }
}
export default ProductDetails;
