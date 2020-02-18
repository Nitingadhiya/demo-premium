import React from 'react';
import {View, Text} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AdminBottomTabs} from './bottom-tabs/admin-bottom-tabs';
import {ManagerBottomTabs} from './bottom-tabs/manager-bottom-tabs';
import {EngineerBottomTabs} from './bottom-tabs/engineer-bottom-tabs';
import {CustomerBottomTabs} from './bottom-tabs/customer-bottom-tabs';
import {DealerBottomTabs} from './bottom-tabs/dealer-bottom-tabs';

import {Appbar, Avatar, useTheme} from 'react-native-paper';
import {DetailedTwitt} from '../components/detailedTwitt';

import {Details} from './details';
import Login from './login';
import {StackNavigatorParamlist} from './types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Helper from '../utils/helper';
import enableFontPatch from '../utils/enableFontPatch';
import Register from './register';
import OTPScreen from './otp';

type Props = {
  route: RouteProp<StackNavigatorParamlist, 'Splash'>,
};
const Stack = createStackNavigator();
const primary = '#393184';
export default class UserNavigation extends React.Component {
  state = {
    loading: false,
    userInfo: null,
  };
  async componentDidMount() {
    const data = await Helper.getLocalStorageItem('userInfo');
    console.log(data, 'data');
    if (data) {
      this.setState({userInfo: data});
    }
  }

  tabBarBottom() {
    const {userInfo} = this.state;
    if (!userInfo) return AdminBottomTabs;
    if (userInfo.LoginType === '1') return AdminBottomTabs;
    if (userInfo.LoginType === '2') return ManagerBottomTabs;
    if (userInfo.LoginType === '3') return EngineerBottomTabs;
    if (userInfo.LoginType === '4') return CustomerBottomTabs;
    if (userInfo.LoginType === '4') return DealerBottomTabs;
  }

  render() {
    const {loading, userInfo} = this.state;
    if (loading) {
      return (
        <View>
          <Text>Please wait...</Text>
        </View>
      );
    }
    return (
      <Stack.Navigator
        headerMode="none"
        // screenOptions={{
        //   header: ({scene, previous, navigation}) => {
        //     const {options} = scene.descriptor;
        //     const title =
        //       options.headerTitle !== undefined
        //         ? options.headerTitle
        //         : options.title !== undefined
        //         ? options.title
        //         : scene.route.name;
        //     console.log(options);
        //     if (!options.headerTitle) {
        //       return null;
        //     }
        //     return (
        //       <Appbar.Header theme={{colors: primary}}>
        //         {previous ? (
        //           <Appbar.BackAction
        //             onPress={navigation.goBack}
        //             color={primary}
        //           />
        //         ) : (
        //           <TouchableOpacity
        //             style={{marginLeft: 10}}
        //             onPress={() => {
        //               // ((navigation as any) as DrawerNavigationProp<{}>).openDrawer();
        //             }}>
        //             <Avatar.Image
        //               size={40}
        //               source={{
        //                 uri:
        //                   'https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg',
        //               }}
        //             />
        //           </TouchableOpacity>
        //         )}
        //         <Appbar.Content
        //           title={
        //             title === 'Feed' ? (
        //               <MaterialCommunityIcons
        //                 style={{marginRight: 10}}
        //                 name="twitter"
        //                 size={40}
        //                 color={primary}
        //               />
        //             ) : (
        //               title
        //             )
        //           }
        //           titleStyle={{
        //             fontSize: 18,
        //             fontWeight: 'bold',
        //             color: primary,
        //           }}
        //         />
        //       </Appbar.Header>
        //     );
        //   },
        // }}
      >
        <Stack.Screen
          name="tabHome"
          component={this.tabBarBottom()}
          // options={({route}) => {
          //   console.log('!@# options ********', {route});
          //   const routeName = route.state
          //     ? route.state.routes[route.state.index].name
          //     : 'Feed';
          //   return {
          //     headerTitle: routeName,
          //   };
          // }}
        />
        <Stack.Screen
          name="Details"
          component={Details}
          options={{headerTitle: 'Tweet'}}
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
