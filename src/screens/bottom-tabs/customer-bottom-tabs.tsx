import React from 'react';
import color from 'color';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {useTheme, Portal, FAB} from 'react-native-paper';
import {useSafeArea} from 'react-native-safe-area-context';
import {useIsFocused, RouteProp} from '@react-navigation/native';

import overlay from '../overlay';
import Dashboard from '../tab/customer/home';
import {Feed} from '../feed';
import {Message} from '../message';
import {Notifications} from '../notifications';
import {StackNavigatorParamlist} from '../types';

const Tab = createMaterialBottomTabNavigator();

type Props = {
  route: RouteProp<StackNavigatorParamlist, 'FeedList'>;
};

export const CustomerBottomTabs = (props: Props) => {
  const routeName = props.route.state
    ? props.route.state.routes[props.route.state.index].name
    : 'Feed';

  const theme = useTheme();
  const safeArea = useSafeArea();
  const isFocused = useIsFocused();

  let icon = 'feather';

  switch (routeName) {
    case 'Messages':
      icon = 'email-plus-outline';
      break;
    default:
      icon = 'feather';
      break;
  }

  const tabBarColor = theme.dark
    ? (overlay(6, theme.colors.surface) as string)
    : theme.colors.surface;

  return (
    <React.Fragment>
      <Tab.Navigator
        initialRouteName="Dashboard"
        backBehavior="initialRoute"
        shifting={true}
        activeColor={theme.colors.primary}
        inactiveColor={color(theme.colors.text)
          .alpha(0.6)
          .rgb()
          .string()}
        swipeEnabled={true}
        sceneAnimationEnabled={false}>
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            tabBarIcon: 'home-account',
            tabBarLabel: 'Home',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="ProductList"
          component={Feed}
          options={{
            tabBarIcon: 'format-list-bulleted',
            tabBarLabel: 'Product',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="WishList"
          component={Feed}
          options={{
            tabBarIcon: 'binoculars',
            tabBarLabel: 'Wishlist',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="Order"
          component={Feed}
          options={{
            tabBarIcon: 'shopping',
            tabBarLabel: 'Order',
            tabBarColor,
          }}
        />

        <Tab.Screen
          name="Notifications"
          component={Notifications}
          options={{
            tabBarIcon: 'bell-outline',
            tabBarLabel: 'Offer',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="Messages"
          component={Message}
          options={{
            tabBarIcon: 'message-text-outline',
            tabBarLabel: 'chat',
            tabBarColor,
          }}
        />
      </Tab.Navigator>
      <Portal>
        <FAB
          visible={isFocused}
          icon={icon}
          style={{
            position: 'absolute',
            bottom: safeArea.bottom + 65,
            right: 16,
          }}
          color="white"
          theme={{
            colors: {
              accent: theme.colors.primary,
            },
          }}
          onPress={() => {}}
        />
      </Portal>
    </React.Fragment>
  );
};
