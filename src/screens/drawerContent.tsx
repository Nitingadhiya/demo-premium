// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  Avatar,
  Caption,
  Drawer,
  Paragraph,
  Switch,
  Text,
  Title,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import Animated from 'react-native-reanimated';

import {PreferencesContext} from '../context/preferencesContext';
import {MIcon, McIcon} from '../common/assets/vector-icon';
import NavigationHelper from '../utils/navigation-helper';

type Props = DrawerContentComponentProps<DrawerNavigationProp>;

export function DrawerContent(props: Props) {
  console.log(props);

  const paperTheme = useTheme();
  const {rtl, theme, toggleRTL, toggleTheme} = React.useContext(
    PreferencesContext,
  );

  const translateX = Animated.interpolate(props.progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  const navigation = props.navigation;

  return (
    <DrawerContentScrollView {...props}>
      <Animated.View
        //@ts-ignore
        style={[
          styles.drawerContent,
          {
            backgroundColor: paperTheme.colors.surface,
            transform: [{translateX}],
          },
        ]}>
        <View style={styles.userInfoSection}>
          <TouchableOpacity
            style={{marginLeft: 10}}
            onPress={() => {
              props.navigation.toggleDrawer();
            }}>
            <Avatar.Image
              source={{
                uri:
                  'https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg',
              }}
              size={50}
            />
          </TouchableOpacity>
          <Title style={styles.title}>Dawid Urbaniak</Title>
          <Caption style={styles.caption}>@trensik</Caption>
          <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                202
              </Paragraph>
              <Caption style={styles.caption}>Obserwuje</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                159
              </Paragraph>
              <Caption style={styles.caption}>Obserwujący</Caption>
            </View>
          </View>
        </View>
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
              <McIcon name="tune" color={color} size={size} />
            )}
            label="Product List"
            onPress={() => NavigationHelper.navigate(navigation, 'ProductList')}
          />
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="tune" color={color} size={size} />
            )}
            label="Wishlist"
            onPress={() => NavigationHelper.navigate(navigation, 'WishList')}
          />
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="tune" color={color} size={size} />
            )}
            label="Pending order"
            onPress={() => NavigationHelper.navigate(navigation, 'Order')}
          />
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="tune" color={color} size={size} />
            )}
            label="Offer"
            onPress={() => NavigationHelper.navigate(navigation, 'Offer')}
          />
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="bookmark-outline" color={color} size={size} />
            )}
            label="Chat"
            onPress={() => NavigationHelper.navigate(navigation, 'Chat')}
          />
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="bookmark-outline" color={color} size={size} />
            )}
            label="Engineer Location"
            onPress={() =>
              NavigationHelper.navigate(navigation, 'EngineerLocation')
            }
          />
          <DrawerItem
            icon={({color, size}) => (
              <McIcon name="bookmark-outline" color={color} size={size} />
            )}
            label="Chat"
            onPress={() => NavigationHelper.navigate(navigation, 'Chat')}
          />
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
              <McIcon name="bookmark-outline" color={color} size={size} />
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
            onPress={() => NavigationHelper.navigate(navigation, 'Logout')}
          />
        </Drawer.Section>
        <Drawer.Section title="Preferences">
          <TouchableRipple onPress={toggleTheme}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={theme === 'dark'} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={toggleRTL}>
            <View style={styles.preference}>
              <Text>RTL</Text>
              <View pointerEvents="none">
                <Switch value={rtl === 'right'} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </Animated.View>
    </DrawerContentScrollView>
  );
}

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
    lineHeight: 14,
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
