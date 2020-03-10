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
  Alert,
} from 'react-native';
import _ from 'lodash';
import Carousel from 'react-native-looped-carousel';
import {Appbar, Avatar, useTheme, Badge, Button} from 'react-native-paper';
import CodeInput from 'react-native-confirmation-code-input';
import APICaller from '../../utils/api-caller';
import {
  getProductDetailsEndPoint,
  removeWishCartEndPoint,
  insertWishCartEndPoint,
} from '../../config/api-endpoint';
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
    console.log('route', route);
    if (route.params) {
      this.setState({
        productNo: route.params.productNo,
        userInfo,
      });
      let usernameCheck = '';
      if (userInfo) {
        usernameCheck = userInfo.UserName;
      }
      this.getProductDetails(route.params.productNo, usernameCheck);
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
        let productDetails = this.state.productDetails;
        productDetails.Wish = true;

        this.setState({
          productDetails,
          loadingData: false,
        });
        Events.trigger('refresh-product-list');
        setTimeout(() => console.log(this.state.productDetails), 2000);
      }
    });
  }

  async removeWishListCart(item, type) {
    this.setState({loadingData: true});
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    if (!userInfo) return;
    APICaller(
      removeWishCartEndPoint(item.ProductNo, userInfo.UserName, type),
      'GET',
    ).then(json => {
      if (json.status !== 200) {
        this.setState({loadingData: false});
        Alert.alert(
          `Error-${json.status}`,
          'Server error, something went to wrong',
        );
        return;
      }
      if (json.data.Success === 1 || json.data.Success === '1') {
        let productDetails = this.state.productDetails;
        productDetails.Wish = false;

        this.setState({
          productDetails,
          loadingData: false,
        });
        Events.trigger('refresh-product-list');
      }
    });
  }

  render() {
    const {productDetails, imageList, splSpec, splDesc, userInfo} = this.state;
    const {navigation} = this.props;
    const FirstRoute = () => (
      <View style={styles.mainTechnicalView}>
        <View style={styles.technicalView}>
          {splSpec &&
            splSpec.map((res, index) => (
              <Text style={styles.welcome} key={`${index}`}>
                {res}
              </Text>
            ))}
        </View>
      </View>
    );
    const SecondRoute = () => (
      <View style={styles.mainTechnicalView}>
        <View style={styles.technicalView}>
          {splDesc &&
            splDesc.map((res, index) => (
              <Text style={styles.welcome} key={`${index}`}>
                {res}
              </Text>
            ))}
        </View>
      </View>
    );
    const ThirdRoute = () => (
      <View style={styles.mainTechnicalView}>
        <View style={styles.technicalView}>
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
      <SafeAreaView style={styles.safeView}>
        {this.state.loadingData ? (
          <View style={styles.spinnerView}>
            <SpinnerView />
          </View>
        ) : null}
        <Appbar.Header style={styles.headerBg}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={'Product Details'} />
          {userInfo ? (
            <Appbar.Action
              icon={
                productDetails && productDetails.Wish
                  ? 'heart'
                  : 'heart-outline'
              }
              onPress={() => {
                if (productDetails && productDetails.Wish) {
                  this.removeWishListCart(productDetails, 'WISH');
                } else {
                  this.addWishListCart(productDetails, 'WISH');
                }
              }}
            />
          ) : null}
          {userInfo ? (
            <Appbar.Action
              icon="cart"
              onPress={() => this.navigateCartList(navigation)}
            />
          ) : null}
        </Appbar.Header>
        <ScrollView style={styles.flex1}>
          <View style={styles.productTitle}>
            <Text style={styles.titleClass}>
              {productDetails && productDetails.ProductName}
            </Text>
          </View>
          <View style={styles.carouselView}>
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
        {userInfo && productDetails && productDetails.IsActive ? (
          <View style={styles.priceView}>
            <View style={styles.priceSubView}>
              <Text style={styles.centerText}>Platinum</Text>
              <Text style={styles.priceValue}>
                {productDetails.IsPlatinum
                  ? `₹ ${productDetails.PlatinumRate}`
                  : `N/A`}
              </Text>
            </View>
            <View style={styles.priceSubView}>
              <Text style={styles.centerText}>Gold</Text>
              <Text style={styles.priceValue}>
                {productDetails.IsGold ? `₹ ${productDetails.GoldRate}` : `N/A`}
              </Text>
            </View>
            <View style={styles.priceSubView}>
              <Text style={styles.centerText}>Silver</Text>
              <Text style={styles.priceValue}>
                {productDetails.IsSilver
                  ? `₹ ${productDetails.SilverRate}`
                  : `N/A`}
              </Text>
            </View>
          </View>
        ) : (
          <View>
            {userInfo ? (
              <View style={styles.comingsoonView}>
                <Text style={styles.priceValue}>Coming Soon...</Text>
              </View>
            ) : null}
          </View>
        )}

        {userInfo && userInfo.LoginType === '5' ? (
          <View style={styles.dealerPriceView}>
            <Text style={styles.centerText}>
              Dealer{' '}
              <Text style={styles.priceValue}>
                ₹ {productDetails && productDetails.DealerRate}
              </Text>
            </Text>
          </View>
        ) : null}
        {userInfo && productDetails && productDetails.IsActive && (
          <Button
            mode="contained"
            onPress={() => this.addWishListCart(productDetails, 'CART')}
            style={styles.addToCartButton}>
            Add to cart
          </Button>
        )}
      </SafeAreaView>
    );
  }
}
export default ProductDetails;
