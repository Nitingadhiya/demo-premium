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
  LayoutAnimation,
} from 'react-native';
import _ from 'lodash';
import {Appbar, Avatar, useTheme, Badge} from 'react-native-paper';
import CodeInput from 'react-native-confirmation-code-input';
import APICaller from '../../utils/api-caller';
import {fetchProductListEndPoint} from '../../config/api-endpoint';
import {MIcon} from '../../common/assets/vector-icon';
import styles from './styles';
import {Matrics, Color} from '../../common/styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';
import {SpinnerView} from '../../common/components';
import ProductItemList from '../../components/product-list';

class ProductList extends Component {
  state = {
    mobileNo: null,
    searchMargin: -50,
    productItemList: null,
    filterResult: null,
  };

  componentDidMount() {
    this.getUserInfo();
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });
    this.fetchProductList(userInfo.UserName);
  }

  searchBarOpen() {
    LayoutAnimation.spring();
    console.log(this.state);
    if (this.state.searchMargin < 0) {
      this.secondTextInput.focus();
      this.setState({searchMargin: 0, he: this.state.he + 15});
    } else {
      this.secondTextInput.blur();
      this.setState({searchMargin: -50, he: this.state.he + 15});
    }
  }

  clearSearchText() {
    let productClear = [];
    if (global.categoryFilter) {
      this.state.filterResult.map(rs => {
        if (rs.ProductCategoryName === global.categoryFilter) {
          productClear.push(rs);
        }
      });
      this.setState({
        searchText: null,
        productItemList: productClear,
      });
    } else {
      this.setState({
        searchText: null,
        productItemList: this.state.filterResult,
      });
    }
  }

  replaceCustomExpression = title => {
    // console.warn(title.replace(/[^a-zA-Z 0-9 | ]/ig, ""));
    const result = title.replace(/  +/g, ' '); // Replace multiple whitespace to a whitespace
    return result.replace(/[^a-zA-Z 0-9 | ]/gi, '').toLowerCase();
  };

  getSearchResult(text) {
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
            if (!global.categoryFilter) {
              searchResult.push(rs);
            }
            if (
              global.categoryFilter &&
              rs.ProductCategoryName === global.categoryFilter
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
            if (!global.categoryFilter) {
              searchResult.push(rs);
            }
            if (
              global.categoryFilter &&
              rs.ProductCategoryName === global.categoryFilter
            ) {
              searchResult.push(rs);
            }
          });
        }
      });

      const uniq = _.uniqBy(searchResult, 'ID');
      console.log(uniq, 'uniq');
      searchResult = uniq;
      this.setState({
        productItemList: searchResult,
        searchFlag: false,
        displayResult: true,
      });
    } else {
      if (global.categoryFilter) {
        reduxProductList.map(res => {
          if (res.ProductCategoryName === global.categoryFilter) {
            searchResult.push(res);
          }
        });
        this.setState({productItemList: searchResult});
      } else {
        this.setState({productItemList: data});
      }
    }
  }

  fetchProductList(userName) {
    console.log('fetch');
    const {refreshing} = this.state;
    if (!refreshing) {
      this.setState({loadingData: true});
    }
    console.log(fetchProductListEndPoint(userName));
    APICaller(fetchProductListEndPoint(userName), 'GET').then(json => {
      console.log(json, 'json');
      if (json.data.Success === 1 || json.data.Success === '1') {
        const list = json.data.Response;
        this.setState({
          productItemList: list,
          filterResult: list,
          refreshing: false,
          loadingData: false,
        });
      }
    });
  }

  async onRefresh() {
    // global.categoryFilter = '';
    // this.state.searchText = '';
    // await this.setState({refreshing: true});
    // if (this.state.searchText) {
    //   this.getSearchResult(this.state.searchText);
    //   this.setState({refreshing: false});
    // } else {
    //   this.getProductList();
    // }
  }

  noItemFound = () => {
    if (!this.state.displayResult) {
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
        <Text style={{color: 'grey', fontSize: 16}}>No items found</Text>
      </View>
    );
  };

  productDetails(item) {
    console.log(item, 'iii');
    NavigationHelper.navigate(this.props.navigation, 'ProductDetails', {
      productNo: item.ProductNo,
    });
  }

  render() {
    const {productItemList} = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={styles.safeView}>
        <Appbar.Header>
          <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
          <Appbar.Content title={'Product'} />
          <Appbar.Action icon="magnify" onPress={() => this.searchBarOpen()} />
          <Appbar.Action icon="cart" onPress={() => this.searchBarOpen()} />
          <Badge
            style={{position: 'absolute', zIndex: 1, right: 5, top: 10}}
            theme={Color.lightGray}
            size={18}>
            3
          </Badge>
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
          {this.state.loadingData ? <SpinnerView /> : null}
          <FlatList
            data={productItemList}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{flexGrow: 1}}
            ListEmptyComponent={() => this.noItemFound()}
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            extraData={this.state}
            //onRefresh={() => this.onRefresh()}
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
                    this.removeWishListCart(item.ProductNo, 'WISH')
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
      </SafeAreaView>
    );
  }
}
export default ProductList;
