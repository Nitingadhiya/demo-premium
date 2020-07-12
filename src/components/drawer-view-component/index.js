import React, {Component} from 'react';
import {View, Alert, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {McIcon, MIcon} from '../../common/assets/vector-icon';
import {Drawer, Avatar, Title, Caption, Paragraph} from 'react-native-paper';
import _ from 'lodash';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';
import {Color, Matrics} from '../../common/styles';
import {VersionNumber} from '../../package';
import Events from '../../utils/events';
import styles from './styles';

class DrawerViewComponent extends Component {
  state = {
    userInfo: null,
  };
  async componentDidMount() {
    const data = await Helper.getLocalStorageItem('userInfo');

    if (data) {
      this.setState({userInfo: data});
    }
    Events.on('userInfo-drawer', 'user', res => {
      this.setState({
        userInfo: res,
      });
    });
  }

  render() {
    const {userInfo} = this.state;
    const {navigation} = this.props;
    return (
      <View style={{flex: 1}}>
        {userInfo ? (
          <View style={styles.userInfoSection}>
            <TouchableOpacity
              onPress={() => navigation.closeDrawer()}
              style={styles.closeDrawerTouch}>
              <MIcon name="close" size={Matrics.ScaleValue(22)} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                NavigationHelper.navigate(navigation, 'MyProfile');
              }}>
              <Avatar.Image
                source={{
                  uri: userInfo.UserImage,
                }}
                size={50}
              />

              <Title style={styles.title}>
                {userInfo.FirstName} {userInfo.LastName}
              </Title>
              <Caption style={styles.caption}>{userInfo.EmailId}</Caption>
              <Caption style={styles.caption}>{userInfo.MobileNo}</Caption>
            </TouchableOpacity>
          </View>
        ) : null}
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="home" color={color} size={size} />
            )}
            label="Home"
            onPress={() => NavigationHelper.navigate(navigation, 'Dashboard')}
          />
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="account-outline" color={color} size={size} />
            )}
            label="Profile"
            onPress={() => NavigationHelper.navigate(navigation, 'MyProfile')}
          />
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="format-list-bulleted" color={color} size={size} />
            )}
            label="Product List"
            onPress={() => NavigationHelper.navigate(navigation, 'ProductList')}
          />
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="binoculars" color={color} size={size} />
            )}
            label="Wishlist"
            onPress={() => NavigationHelper.navigate(navigation, 'WishList')}
          />
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="cart" color={color} size={size} />
            )}
            label="Cart"
            onPress={() => NavigationHelper.navigate(navigation, 'PlaceOrder')}
          />
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="shopping" color={color} size={size} />
            )}
            label="Pending order"
            onPress={() => NavigationHelper.navigate(navigation, 'Order')}
          />
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="bell-outline" color={color} size={size} />
            )}
            label="Offer"
            onPress={() => NavigationHelper.navigate(navigation, 'Offer')}
          />
          {/* <DrawerItem
        icon={({color, size}) => (
          <McIcon name="bookmark-outline" color={color} size={size} />
        )}
        label="Chat"
        onPress={() => NavigationHelper.navigate(navigation, 'Chat')}
      /> */}
          {userInfo &&
          (userInfo.LoginType === '1' || userInfo.LoginType === '2') ? (
            <DrawerItem
              icon={({color, size}) => (
                <McIcon name="bookmark-outline" color={color} size={size} />
              )}
              label="Team Location"
              onPress={() =>
                NavigationHelper.navigate(navigation, 'TeamLocation')
              }
            />
          ) : null}
          {userInfo &&
          (userInfo.LoginType === '1' ||
            userInfo.LoginType === '2' ||
            userInfo.LoginType === '3') ? (
            <DrawerItem
              icon={({color, size}) => (
                <McIcon name="bookmark-outline" color={color} size={size} />
              )}
              label="System Warranty, Parts"
              onPress={() => NavigationHelper.navigate(navigation, 'Parts')}
            />
          ) : null}
          {userInfo &&
          (userInfo.LoginType === '1' ||
            userInfo.LoginType === '2' ||
            userInfo.LoginType === '3') ? (
            <DrawerItem
              icon={({color, size}) => (
                <McIcon name="bookmark-outline" color={color} size={size} />
              )}
              label="Inventory OTP"
              onPress={() =>
                NavigationHelper.navigate(navigation, 'OTPListInhandInventory')
              }
            />
          ) : null}
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="lock" color={color} size={size} />
            )}
            label="Change Password"
            onPress={() =>
              NavigationHelper.navigate(navigation, 'ChangePassword')
            }
          />
          {userInfo &&
          (userInfo.LoginType === '1' ||
            userInfo.LoginType === '2' ||
            userInfo.LoginType === '3') ? (
            <DrawerItem
              icon={({color, size}) => (
                <McIcon name="bookmark-outline" color={color} size={size} />
              )}
              label="System Verify"
              onPress={() =>
                NavigationHelper.navigate(navigation, 'SystemVerify')
              }
            />
          ) : null}
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="bookmark-outline" color={color} size={size} />
            )}
            label="Logout"
            onPress={async () => {
              navigation.closeDrawer();
              Events.trigger('gesture-manage');
              await Helper.removeLocalStorage('userInfo');
              NavigationHelper.reset(navigation, 'Splash');
            }}
          />
          <View style={styles.viewVersion}>
            <Text style={styles.versionText}>
              App Version{' '}
              {`${VersionNumber.appVersion}(${VersionNumber.buildVersion})`}
            </Text>
          </View>
        </Drawer.Section>
      </View>
    );
  }
}
export default DrawerViewComponent;
