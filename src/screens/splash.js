import React from 'react';
import {View, Text, TouchableOpacity, AppState} from 'react-native';
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
import UserNavigation from './user-navigation';
import Register from './register';
import OTPScreen from './otp';
import SubmitComplaint from './submit-complaint';
import AddSystem from './add-system';
import ForgotPassword from './forgot-password';
import ProductDetails from './product-details';
import MyProfile from './my-profile';
import Parts from './parts';
import PlaceOrder from './placeOrder';
import TeamLocation from './team-location';
import {SystemVerify} from './system-verify';
import ChangePassword from './change-password';
import ServicePackage from './select-serivce-pack';
import ComplaintList from './complaint-list';
import EditProfile from './edit-profile';
import OrderReady from './order-ready';
import UpdateAddress from './update-address';
import ProductList from '../screens/product-list';
import SignCapture from './signature-capture';
import ComponentRequest from './component-request';
import TeamComponentStock from './team-component-stock';
import OTPListInhandInventory from './otp-list-inhand-inventory';
import ComponentRestockRequest from './component-restock-request';
import OrderComponentRequest from './order-component-request';
import ChatMessage from './chat-message';
import ContactList from './contact-list';
import ContactsServiceHelper from '../utils/contacts';

type Props = {
  route: RouteProp<StackNavigatorParamlist, 'Splash'>,
};
const Stack = createStackNavigator();
const primary = '#393184';
export default class Splash extends React.Component {
  state = {
    loading: true,
    userInfo: null,
    appState: AppState.currentState,
  };
  async componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    console.disableYellowBox = true;
    enableFontPatch();

    Helper.checkAppVersion(); //Check application update
    const data = await Helper.getLocalStorageItem('userInfo');
    if (data) {
      global.userInfo = data;
      this.setState({userInfo: data, loading: false});
    } else {
      this.setState({loading: false});
    }
    setTimeout(() => {
      ContactsServiceHelper.contactPermission();
    }, 2000);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      Helper.checkAppVersion();
    }
    this.setState({appState: nextAppState});
  };

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
        screenOptions={{
          header: ({scene, previous, navigation}) => {
            const {options} = scene.descriptor;
            const title =
              options.headerTitle !== undefined
                ? options.headerTitle
                : options.title !== undefined
                ? options.title
                : scene.route.name;
            if (!options.headerTitle) {
              return null;
            }

            if (options.headerTitle === 'Product') {
              return null;
            }
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
                      // ((navigation as any) as DrawerNavigationProp<{}>).openDrawer();
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
        {!userInfo ? <Stack.Screen name="Login" component={Login} /> : null}

        <Stack.Screen name="UserNavigation" component={UserNavigation} />
        <Stack.Screen
          name="ProductListScreen"
          component={ProductList}
          options={{headerTitle: 'Tweet'}}
        />

        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerTitle: 'Register'}}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{headerTitle: 'Forgot Password'}}
        />
        <Stack.Screen
          name="OTPScreen"
          component={OTPScreen}
          options={{headerTitle: 'Verify OTP'}}
        />
        <Stack.Screen
          name="SubmitComplaint"
          component={SubmitComplaint}
          options={{headerTitle: 'Submit Complaint'}}
        />
        <Stack.Screen
          name="AddSystem"
          component={AddSystem}
          options={{headerTitle: 'Add System'}}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={{headerTitle: 'Product Details'}}
          headerMode="none"
        />
        <Stack.Screen
          name="MyProfile"
          component={MyProfile}
          options={{headerTitle: 'Profile'}}
          headerMode="none"
        />
        <Stack.Screen
          name="Parts"
          component={Parts}
          options={{headerTitle: 'System Parts'}}
        />
        <Stack.Screen
          name="PlaceOrder"
          component={PlaceOrder}
          options={{headerTitle: 'Place Order'}}
        />
        <Stack.Screen
          name="TeamLocation"
          component={TeamLocation}
          options={{headerTitle: 'Location'}}
        />
        <Stack.Screen
          name="SystemVerify"
          component={SystemVerify}
          options={{headerTitle: 'System Verify'}}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{headerTitle: 'Change Password'}}
        />
        <Stack.Screen
          name="ServicePackage"
          component={ServicePackage}
          options={{headerTitle: 'Select Service Pack'}}
        />
        <Stack.Screen
          name="ComplaintList"
          component={ComplaintList}
          options={{headerTitle: 'Complaint list'}}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{headerTitle: 'Edit Profile'}}
        />
        <Stack.Screen
          name="OrderReady"
          component={OrderReady}
          options={{headerTitle: 'Order Ready'}}
        />
        <Stack.Screen
          name="UpdateAddress"
          component={UpdateAddress}
          options={{headerTitle: 'Update address'}}
        />
        <Stack.Screen
          name="SignatureCapture"
          component={SignCapture}
          options={{headerTitle: 'Signature Capture'}}
        />
        <Stack.Screen
          name="ComponentRequest"
          component={ComponentRequest}
          options={{headerTitle: 'Component Request'}}
        />
        <Stack.Screen
          name="TeamComponentStock"
          component={TeamComponentStock}
          options={{headerTitle: 'Team Component Stock'}}
        />
        <Stack.Screen
          name="OTPListInhandInventory"
          component={OTPListInhandInventory}
        />
        <Stack.Screen
          name="ComponentRestockRequest"
          component={ComponentRestockRequest}
        />
        <Stack.Screen
          name="OrderComponentRequest"
          component={OrderComponentRequest}
        />
        <Stack.Screen name="ChatMessage" component={ChatMessage} />

        <Stack.Screen name="ContactList" component={ContactList} />

        {/* <Stack.Screen
          name="Details"
          component={Details}
          options={{headerTitle: 'Tweet'}}
        /> */}
      </Stack.Navigator>
    );
  }
}
