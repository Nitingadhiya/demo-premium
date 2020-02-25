import React, {Component} from 'react';
import {View, Alert, TouchableOpacity, StyleSheet} from 'react-native';
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
import {Color} from '../../common/styles';
import Events from '../../utils/events';

class DrawerViewComponent extends Component {
  state = {
    userInfo: null,
  };
  async componentDidMount() {
    const data = await Helper.getLocalStorageItem('userInfo');

    if (data) {
      this.setState({userInfo: data});
      console.log(data, 'data');
    }
    Events.on('userInfo-drawer', 'user', res => {
      console.log('trigger');
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
              style={{marginLeft: 10}}
              onPress={() => {
                props.navigation.toggleDrawer();
              }}>
              <Avatar.Image
                source={{
                  uri: userInfo.UserImage,
                }}
                size={50}
              />
            </TouchableOpacity>
            <Title style={styles.title}>
              {userInfo.FirstName} {userInfo.LastName}
            </Title>
            <Caption style={styles.caption}>{userInfo.EmailId}</Caption>
            <Caption style={styles.caption}>{userInfo.MobileNo}</Caption>
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
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="bookmark-outline" color={color} size={size} />
            )}
            label="System Warranty"
            onPress={() =>
              NavigationHelper.navigate(navigation, 'SystemWarranty')
            }
          />
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="lock" color={color} size={size} />
            )}
            label="Change Password"
            onPress={() =>
              NavigationHelper.navigate(navigation, 'ChangePassword')
            }
          />
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="bookmark-outline" color={color} size={size} />
            )}
            label="System Verify"
            onPress={() =>
              NavigationHelper.navigate(navigation, 'SystemVerify')
            }
          />
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="bookmark-outline" color={color} size={size} />
            )}
            label="Logout"
            onPress={async () => {
              await Helper.removeLocalStorage('userInfo');
              NavigationHelper.reset(navigation, 'Splash');
            }}
          />
        </Drawer.Section>
      </View>
    );
  }
}
export default DrawerViewComponent;
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 16,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
