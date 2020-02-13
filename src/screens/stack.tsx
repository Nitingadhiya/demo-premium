import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from './splash';
import {StackNavigatorParamlist} from './types';

const Stack = createStackNavigator<StackNavigatorParamlist>();

export const StackNavigator = () => {
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
