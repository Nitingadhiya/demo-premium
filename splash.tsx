import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import {BottomTabs} from './bottomTabs';
import {Appbar, Avatar, useTheme} from 'react-native-paper';
import {DetailedTwitt} from './components/detailedTwitt';
import {StackNavigatorParamlist} from './types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Helper from './utils/helper';

type Props = {
  route: RouteProp<StackNavigatorParamlist, 'Splash'>;
};
const Stack = createStackNavigator();
const primary = '#393184';
export default class Splash extends React.Component {
  state = {
    loading: true,
    userInfo: null,
  };
  async componentDidMount() {
    console.log('Did mount');
    Helper.checkAppVersion();
    const data = await Helper.getLocalStorageItem('userInfo');
    console.log(data, 'data');
    if (data) {
      this.setState({loading: false, userInfo: data});
    }
  }
  render() {
    const {loading} = this.state;
    if (loading) {
      return (
        <View>
          <Text>Please wait...</Text>
        </View>
      );
    }
    return (
      <Stack.Navigator
        headerMode="screen"
        screenOptions={{
          header: ({scene, previous, navigation}) => {
            const {options} = scene.descriptor;
            const title =
              options.headerTitle !== undefined
                ? options.headerTitle
                : options.title !== undefined
                ? options.title
                : scene.route.name;

            return (
              <Appbar.Header theme={{colors: primary}}>
                {previous ? (
                  <Appbar.BackAction
                    onPress={navigation.goBack}
                    color={primary}
                  />
                ) : (
                  <TouchableOpacity
                    style={{marginLeft: 10}}
                    onPress={() => {
                      ((navigation as any) as DrawerNavigationProp<{}>).openDrawer();
                    }}>
                    <Avatar.Image
                      size={40}
                      source={{
                        uri:
                          'https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg',
                      }}
                    />
                  </TouchableOpacity>
                )}
                <Appbar.Content
                  title={
                    title === 'Feed' ? (
                      <MaterialCommunityIcons
                        style={{marginRight: 10}}
                        name="twitter"
                        size={40}
                        color={primary}
                      />
                    ) : (
                      title
                    )
                  }
                  titleStyle={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: primary,
                  }}
                />
              </Appbar.Header>
            );
          },
        }}>
        <Stack.Screen
          name="FeedList"
          component={BottomTabs}
          options={({route}) => {
            console.log('!@# options', {route});
            const routeName = route.state
              ? route.state.routes[route.state.index].name
              : 'Feed';
            return {headerTitle: routeName};
          }}
        />
      </Stack.Navigator>
    );
  }
}

// import React from 'react';
// import {View, Text} from 'react-native';
// import {RouteProp} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import {BottomTabs} from './bottomTabs';
// import {StackNavigatorParamlist} from './types';

// type Props = {
//   route: RouteProp<StackNavigatorParamlist, 'Splash'>;
// };
// const Stack = createStackNavigator();

// export const Splash = (props: Props) => {
//   return (
//     <Stack.Navigator initialRouteName="Splash" headerMode="screen">
//       <Stack.Screen
//         name="FeedList"
//         component={BottomTabs}
//         options={({route}) => {
//           console.log('!@# options', {route});
//           const routeName = route.state
//             ? route.state.routes[route.state.index].name
//             : 'Feed';
//           return {headerTitle: routeName};
//         }}
//       />
//     </Stack.Navigator>
//   );
// };
