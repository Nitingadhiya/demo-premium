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
import {getWishlistEndPoint} from '../../config/api-endpoint';
import {MIcon} from '../../common/assets/vector-icon';
import styles from './styles';
import {Matrics, Color} from '../../common/styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';
import {SpinnerView, Header} from '../../common/components';
import ProductItemList from '../../components/product-list';

class WishList extends Component {
  state = {
    wishlistItem: null,
  };

  componentDidMount() {
    this.getUserInfo();
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });
    this.fetchWishList(userInfo.UserName);
  }

  fetchWishList(userName) {
    APICaller(getWishlistEndPoint(userName), 'GET').then(json => {
      console.log(json, 'json');
      this.setState({loadingData: false, refreshing: false});
      if (json.data.Success === '1') {
        this.setState({
          wishlistItem: json.data.Response,
        });
      } else {
        this.setState({
          loginError: json.data.Message,
        });
      }
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
    console.log(item, 'iii');
    NavigationHelper.navigate(this.props.navigation, 'ProductDetails', {
      productNo: item.ProductNo,
    });
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getWishlist();
  };

  render() {
    const {loadingData, wishlistItem, refreshing} = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={styles.safeView}>
        <Header title="Wish list" left="menu" />

        {loadingData ? <SpinnerView /> : null}
        <View style={{flex: 1}}>
          {wishlistItem ? (
            <FlatList
              data={wishlistItem}
              contentContainerStyle={{flexGrow: 1}}
              ListEmptyComponent={() => this.noItemFound()}
              showsVerticalScrollIndicator={false}
              style={{flex: 1}}
              extraData={this.state}
              onRefresh={() => this.onRefresh()}
              refreshing={refreshing}
              renderItem={({item}) => (
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <PListItem
                    data={item}
                    productDetails={() => this.productDetails(item)}
                    removeWishListCart={() =>
                      this.removeWishListCart(item.ProductNo, 'WISH')
                    }
                    addWishListCart={() =>
                      this.addWishListCart(item.ProductNo, 'WISH')
                    }
                    userInfo={this.getUser}
                  />
                </View>
              )}
            />
          ) : (
            this.noItemFound()
          )}
        </View>
      </SafeAreaView>
    );
  }
}
export default WishList;
