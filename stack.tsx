import React from 'react';
import {TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {Appbar, Avatar, useTheme} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {BottomTabs} from './bottomTabs';

import Splash from './splash';
import {StackNavigatorParamlist} from './types';

const Stack = createStackNavigator<StackNavigatorParamlist>();

export const StackNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator initialRouteName="Splash" headerMode="none">
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{
          headerTitle: 'Tweet',
          headerTransparent: true,
        }}
      />
      {/* <Stack.Screen
        name="FeedList"
        component={BottomTabs}
        options={({route}) => {
          console.log('!@# options', {route});
          const routeName = route.state
            ? route.state.routes[route.state.index].name
            : 'Feed';
          return {headerTitle: routeName};
        }}
      /> */}
    </Stack.Navigator>
  );
};
