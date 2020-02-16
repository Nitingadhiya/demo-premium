import React, {Component} from 'react';
import {Text, View, Alert, TouchableOpacity, Image} from 'react-native';
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import {VersionNumber} from '../../package';
import styles from './styles';
import APICaller from '../../utils/api-caller';
import {userDashboardEndPoint} from '../../config/api-endpoint';
import {Color} from '../../common/styles';

let img;
class ProductList extends Component {
  packageSelectedPrice(GoldRate, SilverRate, PlatinumRate) {
    let price = '';
    //console.log(PlatinumRate, 'platinum');
    if (this.props.data.SystemPackage === 'Silver') {
      price =
        SilverRate -
        this.props.data.OnlineDiscount +
        (this.props.data.shipping || 0);
    }
    if (this.props.data.SystemPackage === 'Gold') {
      price =
        GoldRate -
        this.props.data.OnlineDiscount +
        (this.props.data.shipping || 0);
    }
    if (this.props.data.SystemPackage === 'Platinum') {
      // console.log(this.props.data.OnlineDiscount);
      price =
        PlatinumRate -
        this.props.data.OnlineDiscount +
        (this.props.data.shipping || 0);
      //console.log(price, 'price');
    }
    return `₹ ${price} + GST`;
  }
  productPrice(userInfo, GoldRate, DealerRate, SilverRate, PlatinumRate) {
    if (userInfo) {
      if (userInfo.LoginType === '4') {
        return (
          <Text style={{fontSize: 14, fontWeight: 'bold'}}>
            {this.props.placeOrder
              ? this.packageSelectedPrice(GoldRate, SilverRate, PlatinumRate)
              : `₹ ${SilverRate} + GST`}
          </Text>
        );
      } else {
        return (
          <View>
            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
              {/* Rs.{GoldRate} */}₹ {SilverRate} | {DealerRate}
            </Text>
            {/* <Text style={{ fontSize: 15 }}>
              Rs.{DealerRate}
            </Text> */}
          </View>
        );
      }
    }
  }

  render() {
    const {
      data,
      productDetails,
      addWishList,
      addWishListCart,
      removeWishListCart,
      userInfo,
      buyNow,
    } = this.props;
    const {
      Url,
      ProductName,
      ImageList,
      ImageListSmall,
      Description,
      GoldRate,
      SilverRate,
      PlatinumRate,
      DealerRate,
      ID,
      WishCart,
      Wish,
      Cart,
      IsDeleted,
      IsActive,
    } = data;

    const imgL = ImageListSmall
      ? ImageListSmall.split(',')
      : ImageList.split(',');
    if (imgL.length > 0) {
      img = imgL[0];
    } else {
      img = ImageListSmall || ImageList;
    }

    if (IsDeleted) {
      return <View />;
    }
    return (
      <TouchableOpacity
        onPress={productDetails}
        style={styles.container}
        disabled={this.props.placeOrder}>
        <View
          style={{
            flex: 2,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
          <View style={styles.friendImg}>
            <Image source={{uri: `${Url}${img}`}} style={styles.friendImg} />
          </View>
        </View>
        <View
          style={{
            flex: 5,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingLeft: 5,
          }}>
          <View
            style={{
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 15,
                color: '#000',
                fontWeight: 'bold',
              }}>
              {ProductName}
            </Text>
            <Text numberOfLines={3} style={{fontSize: 11, color: '#545454'}}>
              {Description}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            {IsActive ? (
              <View style={{justifyContent: 'flex-start', flex: 1}}>
                {this.productPrice(
                  userInfo,
                  GoldRate,
                  DealerRate,
                  SilverRate,
                  PlatinumRate,
                )}
              </View>
            ) : (
              <View style={{justifyContent: 'flex-start', flex: 1}}>
                <Text style={{fontSize: 15}}>Comingsoon...</Text>
              </View>
            )}
            {userInfo && !this.props.cartList && !this.props.placeOrder ? (
              Wish === true ? (
                <TouchableOpacity onPress={removeWishListCart}>
                  <McIcon name="heart" size={25} color="red" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={addWishList}>
                  <McIcon name="heart-outline" size={25} color="red" />
                </TouchableOpacity>
              )
            ) : null}
            {this.props.placeOrder || this.props.cartList ? null : (
              <View>
                {userInfo && IsActive ? (
                  <TouchableOpacity
                    onPress={addWishListCart}
                    style={{
                      zIndex: 1,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      flexDirection: 'row',
                    }}>
                    <MIcon
                      name="shopping-cart"
                      size={25}
                      color={Color.primary}
                    />
                    <Text>Add to cart</Text>
                  </TouchableOpacity>
                ) : (
                  <View />
                )}
              </View>
            )}
            {!this.props.cartList ? null : (
              <View
                style={{
                  flex: 0.5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 14}}>{data.CartQty} X</Text>
                <TouchableOpacity onPress={addWishListCart}>
                  <MIcon name="plus-circle" size={25} color="green" />
                </TouchableOpacity>
                <TouchableOpacity onPress={removeWishListCart}>
                  <MIcon name="minus-circle" size={25} color="red" />
                </TouchableOpacity>
              </View>
            )}
            {this.props.placeOrder ? (
              <View
                style={{
                  flex: 0.5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{fontSize: 12, color: 'green', textAlign: 'right'}}>
                  {data.SystemPackage || 'N/A'}
                </Text>
                <TouchableOpacity onPress={removeWishListCart}>
                  <MIcon name="close" size={25} color="red" />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
export default ProductList;
