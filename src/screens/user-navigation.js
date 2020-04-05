import React from 'react';
import {View, Text} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import firebase from 'react-native-firebase';

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
import ProductList from '../screens/product-list';
import NavigationHelper from '../utils/navigation-helper';

import SocketIOClient from 'socket.io-client';
import BasicURL from '../config';

BackgroundServiceHelper.BackgroundServiceJob();

type Props = {
  route: RouteProp<StackNavigatorParamlist, 'Splash'>,
};
const Stack = createStackNavigator();
export default class UserNavigation extends React.Component {
  state = {
    loading: false,
    userInfo: null,
  };
  async componentDidMount() {
    global.socket = SocketIOClient(`${BasicURL.socketURL}`, {
      transports: ['websocket', 'polling'],
      forceWebsockets: true,
    });
    global.socket.on('connect', () => {
      console.log('connect');
    });

    global.socket.on('disconnect', () => {
      console.log('Disconected');
    });

    // setTimeout(() => {
    //   var data = {
    //     fromUser: 'anitin',
    //     toUser: 'arkesh',
    //     message: 'Kem 60?',
    //   };
    //   global.socket.emit('chat', data);
    // }, 2000);
    // socket.on('chat', responsedata => {
    //   console.log(responsedata);
    // });

    this.cancelAllJob();
    const data = await Helper.getLocalStorageItem('userInfo');
    if (data) {
      global.socket.emit('username', data.UserName);
      this.setState({userInfo: data});
      if (data.LoginType === '2' || data.LoginType === '3') {
        this.backgroundJobMethod();
      }
      // const channel = new firebase.notifications.Android.Channel(
      //   'insider',
      //   'insider channel',
      //   firebase.notifications.Android.Importance.Max,
      // );
      // firebase.notifications().android.createChannel(channel);
      this.checkPermission();
      this.createNotificationListeners();
    }
  }

  async getToken() {
    let fcmToken = await Helper.getLocalStorageItem('fcmToken');
    console.log('fcmTo', fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        Helper.registerWithtoken(fcmToken);
        await Helper.setLocalStorageItem('fcmToken', fcmToken);
      }
    } else {
      Helper.registerWithtoken(fcmToken);
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  }

  navigationProductDetail(notif) {
    if (notif.type && notif.type === 'ProductDetail') {
      const data = {
        Product: '',
        productNo: notif.ProductId,
      };
      NavigationHelper.navigate(this.props.navigation, 'ProductDetails', data);
    }
  }

  async createNotificationListeners() {
    const notificationOpen: NotificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const notification = notificationOpen.notification;
      const notifcationData = notification.data || null;
      this.navigationProductDetail(notifcationData);
    }

    firebase.notifications().onNotification(notification => {
      notification.android.setChannelId('insider').setSound('default');
      firebase.notifications().displayNotification(notification);
    });
    // Set up your listener
    firebase.notifications().onNotificationOpened(notificationOpen => {
      const notification = notificationOpen.notification;
      const notifcationData = notification.data || null;
      this.navigationProductDetail(notifcationData);
      // self.setState({
      //   webURL: notification.data && notification.data.webURL,
      // });
      firebase
        .notifications()
        .removeDeliveredNotification(notification.notificationId);
      // notificationOpen.results.inputText will contain the text entered by the user
    });
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
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
      // notificationTitle: 'Notification title',
      // notificationText: 'Notification text',
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
        {userInfo.LoginType === '1' ||
        userInfo.LoginType === '3' ||
        userInfo.LoginType === '2' ? (
          <Stack.Screen
            name="ProductList"
            component={ProductList}
            options={{headerTitle: 'Tweet'}}
          />
        ) : null}
      </Stack.Navigator>
    );
  }
}
