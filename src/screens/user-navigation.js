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
import BackgroundJob from 'react-native-background-job';
import BackgroundServiceHelper from '../utils/background-job';

BackgroundServiceHelper.BackgroundServiceJob();

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
    this.cancelAllJob();
    const data = await Helper.getLocalStorageItem('userInfo');
    if (data) {
      this.setState({userInfo: data});
      if (data.LoginType === '2' || data.LoginType === '3') {
        this.backgroundJobMethod();
      }
    }
  }

  tabBarBottom() {
    const {userInfo} = this.state;
    if (!userInfo) return CustomerBottomTabs;
    if (userInfo.LoginType === '1') return AdminBottomTabs;
    if (userInfo.LoginType === '2') return ManagerBottomTabs;
    if (userInfo.LoginType === '3') return EngineerBottomTabs;
    if (userInfo.LoginType === '4') return CustomerBottomTabs;
    if (userInfo.LoginType === '5') return DealerBottomTabs;
  }

  cancelAllJob() {
    BackgroundJob.cancelAll()
      .then(() => console.log('Success'))
      .catch(err => console.log(err));
  }

  backgroundJobMethod() {
    BackgroundJob.schedule({
      jobKey: BackgroundServiceHelper.everRunningJobKey(),
      notificationTitle: 'Notification title',
      notificationText: 'Notification text',
      period: 20000,
      exact: true,
      networkType: BackgroundJob.NETWORK_TYPE_ANY,
      allowExecutionInForeground: true,
      allowWhileIdle: true,
    });
    // BackgroundJob.schedule({
    //   jobKey: everRunningJobKey,
    //   period: 1000,
    //   exact: true,
    //   allowWhileIdle: true,
    // });
  }

  render() {
    const {loading, userInfo} = this.state;
    if (loading || !userInfo) {
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
        <Stack.Screen name="tabHome" component={this.tabBarBottom()} />
        <Stack.Screen
          name="Details"
          component={Details}
          options={{headerTitle: 'Tweet'}}
        />
      </Stack.Navigator>
    );
  }
}
