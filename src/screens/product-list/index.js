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
  Alert,
  LayoutAnimation,
} from 'react-native';
import _ from 'lodash';
import {Appbar, Avatar, useTheme, Badge, Portal, FAB} from 'react-native-paper';
import {CommonActions} from '@react-navigation/native';
import CodeInput from 'react-native-confirmation-code-input';
import APICaller from '../../utils/api-caller';
import {
  fetchProductListEndPoint,
  insertWishCartEndPoint,
  removeWishCartEndPoint,
} from '../../config/api-endpoint';
import {MIcon} from '../../common/assets/vector-icon';
import styles from './styles';
import {Matrics, Color} from '../../common/styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';
import {SpinnerView} from '../../common/components';
import ProductItemList from '../../components/product-list';
let searchResult = [];
class ProductList extends Component {
  state = {
    mobileNo: null,
    searchMargin: -50,
    productItemList: null,
    filterResult: null,
    badge: null,
    refreshing: false,
    searchText: null,
    message: null,
    categoryFilterValue: '',
  };

  async componentDidMount() {
    const {route} = this.props;
    if (route.params) {
      await this.setState({
        categoryFilterValue: route.params.category,
      });
    }
    this.getUserInfo();
    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
      // do something
      const {route} = this.props;
      if (route.params) {
        await this.setState({
          categoryFilterValue: route.params.category,
        });
        this.categoryFilterValidation(route.params.category);
      }
    });

    Events.on('refresh-product-list', 'refresh', () => {
      this.getUserInfo();
    });

    Events.on('fetch-cart-count', 'Product count', count => {
      this.setState({
        badge: count,
      });
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }

  categoryFilterValidation() {
    const {categoryFilterValue} = this.state;
    if (categoryFilterValue) {
      this.categoryFilterApply(categoryFilterValue);
    }
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });
    const userName = userInfo ? userInfo.UserName : '';
    this.fetchProductList(userName);
  }

  searchBarOpen() {
    LayoutAnimation.spring();
    if (this.state.searchMargin < 0) {
      this.secondTextInput.focus();
      this.setState({searchMargin: 0, he: this.state.he + 15});
    } else {
      this.secondTextInput.blur();
      this.setState({searchMargin: -50, he: this.state.he + 15});
    }
  }

  clearSearchText() {
    this.setState({
      searchText: '',
      productItemList: this.state.filterResult,
    });
    this.getSearchResult();
  }

  replaceCustomExpression = title => {
    // console.warn(title.replace(/[^a-zA-Z 0-9 | ]/ig, ""));
    const result = title.replace(/  +/g, ' '); // Replace multiple whitespace to a whitespace
    return result.replace(/[^a-zA-Z 0-9 | ]/gi, '').toLowerCase();
  };

  getSearchResult(text) {
    const {categoryFilterValue} = this.state;
    if (!text) {
      searchResult = [];
    }
    const data = this.state.filterResult;
    if (text && data) {
      const searchTerm = text.trim();
      const splt = searchTerm.split(' ');
      searchResult = [];
      splt.map(res => {
        if (searchResult.length > 0) {
          const result = searchResult.filter(
            data =>
              this.replaceCustomExpression(data.ProductName).includes(
                this.replaceCustomExpression(res),
              ) ||
              this.replaceCustomExpression(data.Description).includes(
                this.replaceCustomExpression(res),
              ),
          );
          result.map(rs => {
            if (!categoryFilterValue) {
              searchResult.push(rs);
            }
            if (
              categoryFilterValue &&
              rs.ProductCategoryName === categoryFilterValue
            ) {
              searchResult.push(rs);
            }
          });
          //searchResult = result;
        } else {
          const result = data.filter(
            data =>
              this.replaceCustomExpression(data.ProductName).includes(
                this.replaceCustomExpression(res),
              ) ||
              this.replaceCustomExpression(data.Description).includes(
                this.replaceCustomExpression(res),
              ),
          );
          result.map(rs => {
            if (!categoryFilterValue) {
              searchResult.push(rs);
            }
            if (
              categoryFilterValue &&
              rs.ProductCategoryName === categoryFilterValue
            ) {
              searchResult.push(rs);
            }
          });
        }
      });

      const uniq = _.uniqBy(searchResult, 'ID');
      searchResult = uniq;
      this.setState({
        productItemList: searchResult,
        searchFlag: false,
        displayResult: true,
      });
    } else {
      if (categoryFilterValue) {
        this.state.filterResult.map(res => {
          if (res.ProductCategoryName === categoryFilterValue) {
            searchResult.push(res);
          }
        });
        this.setState({productItemList: searchResult});
      } else {
        this.setState({productItemList: data});
      }
    }
  }

  async clearCategoryFilter() {
    this.props.navigation.dispatch(CommonActions.setParams({category: ''}));
    await this.setState({
      categoryFilterValue: '',
    });
    const {userInfo, searchText} = this.state;
    this.getSearchResult(searchText);
  }

  fetchProductList(userName) {
    const {refreshing} = this.state;
    if (!refreshing) {
      this.setState({loadingData: true});
    }
    APICaller(fetchProductListEndPoint(userName), 'GET').then(json => {
      if (json.data.Success === 1 || json.data.Success === '1') {
        const list = json.data.Response;
        let badgeCount = 0;
        list.some(res => {
          if (res.Cart === true) badgeCount++;
        });
        this.setState({
          productItemList: _.sortBy(list, {IsNew: false}),
          filterResult: _.sortBy(list, {IsNew: false}),
          refreshing: false,
          loadingData: false,
          badge: badgeCount,
        });

        setTimeout(() => this.categoryFilterValidation(''));
      } else {
        this.setState({
          loadingData: false,
          message: _.get(json, 'data.Message', ''),
        });
      }
    });
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
        this.fetchProductList(userInfo.UserName);
        this.setState({loadingData: false});
      }
    });
  }

  async onRefresh() {
    const {UserName} = this.state.userInfo;
    this.setState({
      categoryFilterValue: '',
      searchText: '',
      refreshing: true,
    });
    this.fetchProductList(UserName);
  }

  noItemFound = () => {
    const {message} = this.state;
    if (this.state.loadingData) {
      return <View />;
    }
    return (
      <View
        style={{
          flex: 1,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: 'grey', fontSize: 16}}>
          {message || 'No items found'}
        </Text>
      </View>
    );
  };

  productDetails(item) {
    NavigationHelper.navigate(this.props.navigation, 'ProductDetails', {
      productNo: item.ProductNo,
    });
  }

  categoryFilterApply(res) {
    this.state.productItemList = this.state.filterResult;
    const {productItemList} = this.state;
    if (productItemList) {
      const result = productItemList.filter(data =>
        this.replaceCustomExpression(data.ProductCategoryName).includes(
          this.replaceCustomExpression(res),
        ),
      );
      const uniq = _.uniqBy(result, 'ID');
      this.setState({
        productItemList: uniq,
        searchFlag: false,
        displayResult: true,
        searchText: '',
      });
    }
  }

  // latestProduct() {
  //   if (this.state.productItemList && this.state.productItemList.length > 0) {
  //
  //     const productItem = JSON.stringify(this.state.productItemList);
  //     const PRD = JSON.parse(productItem);
  //     _.reverse(PRD);
  //   }
  // }

  render() {
    const {productItemList, badge, userInfo, categoryFilterValue} = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={styles.safeView}>
        <Appbar.Header style={{backgroundColor: Color.primary}}>
          {userInfo && userInfo.UserName ? (
            <Appbar.Action
              icon={'menu'}
              onPress={() => navigation.openDrawer()}
            />
          ) : (
            <Appbar.BackAction onPress={() => navigation.goBack()} />
          )}
          <Appbar.Content title={'Product'} />
          <Appbar.Action icon="magnify" onPress={() => this.searchBarOpen()} />
          {userInfo && userInfo.UserName ? (
            <Appbar.Action
              icon="cart"
              onPress={() =>
                NavigationHelper.navigate(navigation, 'PlaceOrder')
              }
            />
          ) : null}
          {userInfo && userInfo.UserName ? (
            <Badge
              style={{position: 'absolute', zIndex: 1, right: 5, top: 10}}
              theme={Color.lightGray}
              size={18}>
              {badge}
            </Badge>
          ) : null}
        </Appbar.Header>
        <KeyboardAvoidingView
          style={{flex: 1}}
          enabled
          keyboardVerticalOffset={64}>
          <View style={styles.container}>
            <Animated.View
              style={[
                styles.animatedView,
                {marginTop: this.state.searchMargin},
              ]}>
              <TouchableOpacity
                onPress={() => this.searchBarOpen()}
                style={{position: 'absolute', zIndex: 1, left: 15, top: 13}}>
                <MIcon
                  name="keyboard-arrow-left"
                  size={25}
                  color={Color.primary}
                />
              </TouchableOpacity>

              <TextInput
                style={styles.textInputCss}
                placeholder="Search product"
                placeholderTextColor="grey"
                allowFontScaling={false}
                ref={input => {
                  this.secondTextInput = input;
                }}
                value={this.state.searchText}
                onChangeText={value => {
                  this.setState({
                    searchText: value,
                  });
                  this.getSearchResult(value);
                }}
              />
              <TouchableOpacity
                onPress={() => this.clearSearchText()}
                style={styles.clearSearchIcon}>
                <MIcon name="close" size={22} color={Color.primary} />
              </TouchableOpacity>
            </Animated.View>
          </View>
          {categoryFilterValue ? (
            <View style={styles.categoryFilterView}>
              <Text style={styles.categoryTextStyle}>
                {categoryFilterValue}
              </Text>
              <TouchableOpacity
                style={styles.clearCategory}
                onPress={() => this.clearCategoryFilter()}>
                <MIcon name="close" size={22} color={Color.primary} />
              </TouchableOpacity>
            </View>
          ) : null}
          {this.state.loadingData ? (
            <View style={styles.spinnerView}>
              <SpinnerView />
            </View>
          ) : null}
          <FlatList
            data={productItemList}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{flexGrow: 1}}
            ListEmptyComponent={() => this.noItemFound()}
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
                <ProductItemList
                  data={item}
                  productDetails={() => this.productDetails(item)}
                  addWishListCart={() => this.addWishListCart(item, 'CART')}
                  removeWishListCart={() =>
                    this.removeWishListCart(item, 'WISH')
                  }
                  addWishList={() => this.addWishListCart(item, 'WISH')}
                  userInfo={this.state.userInfo}
                />
              </View>
            )}
          />
          {/* {this.state.searchFlag ? (
            <View style={styles.spinnerViewPOS}>
              <Spinner
                color={Colors.APP_COLOR}
                isVisible={true}
                type="ThreeBounce"
                size={60}
              />
            </View>
          ) : null} */}
        </KeyboardAvoidingView>

        {/* <FAB
          visible={true}
          icon={'new-box'}
          style={{
            position: 'absolute',
            bottom: 15,
            right: 16,
          }}
          color="white"
          theme={{
            colors: {
              accent: Color.primary,
            },
          }}
          onPress={() => this.latestProduct()}
        /> */}
      </SafeAreaView>
    );
  }
}
export default ProductList;
