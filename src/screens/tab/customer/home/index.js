import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {VersionNumber} from '../../../../package';
import _ from 'lodash';

import APICaller from '../../../../utils/api-caller';
import {
  userDashboardEndPoint,
  getUserProfileEndPoint,
  getComplaintCallEndpoint
} from '../../../../config/api-endpoint';
import Helper from '../../../../utils/helper';
import Events from '../../../../utils/events';
import styles from './styles';
import {
  UpdateAvailableView,
  UserInfoDashboardView,
  Header,
} from '../../../../common/components';
import SystemCardView from '../../../../components/system-card-view';
import CategoryItemList from '../../../../components/category-item-list';
import EditSystemNameModal from '../../../../components/edit-system-name';
import ComplaintOptionsModal from '../../../../components/complaint-options-modal';
import ComplaintWithQRCode from '../../../../components/complaint-with-qr-code';
import AntivirusKeyModal from '../../../../components/antivirus-key-modal';
import SystemServiceModal from '../../../../components/system-service-modal';
import NavigationHelper from '../../../../utils/navigation-helper';
import BonusDaysModal from '../../../../components/bonus-modal';
import SystemWarrantyModal from '../../../../components/system-warranty-modal';
import {Appbar, Badge} from 'react-native-paper';
import {Color} from '../../../../common/styles';
import {ConfirmModal} from '../../../../common/components/confirm-modal';
import { McIcon } from '../../../../common/assets/vector-icon';

export default class Dashboard extends Component {
  state = {
    userInfo: null,
    updateAvailable: false,
    systemDescription: null,
    complaintRegisterModal: true,
    cartCount: 0,
    isVisibleConfirm: false,
    profileUpdated: true,
    complaintCallButton: false,
    complaintPhoneData: null
  };

  async componentDidMount() {
    Helper.userAccessApplication(this.props.navigation);
    this.getUserInfo();
    Events.on('refreshDashboard', 'refresh', async () => {
      const userInfo = await Helper.getLocalStorageItem('userInfo');
      this.setState({
        userInfo,
      });
    });
    Events.on('systemAdded', 'refresh', async () => {
      this.getUserInfo();
    });
    Events.on('updateAvailable', 'Updates', res => {
      this.setState({
        updateAvailable: res,
      });
    });
    Events.on('fetch-cart-count', 'Dashboard count', count => {
      this.setState({
        cartCount: count,
      });
    });

    Events.on('open-add-system', 'add-system', () => {
      this.addSystem();
    });
    Helper.checkUpdateAvailable();
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    console.log(userInfo, 'info');
    this.setState({
      userInfo,
    });
    if (userInfo) {
      this.userDashboard(userInfo.UserName);
      this.getUserDetails(userInfo.UserName);
      this.getComplaintCall(userInfo.UserName);
    }
  }

  userDashboard(userName) {
    this.setState({
      loadingData: true,
    });
    if (!userName) {
      Alert.alert('Alert', 'Invalid username');
      return;
    }
    APICaller(
      userDashboardEndPoint(userName, VersionNumber.buildVersion),
      'GET',
    ).then(json => {
      console.log(json, 'jsonnn');
      this.setState({
        loadingData: false,
        refreshing: false,
      });
      if (json.data.Success === '1') {
        const cartCount = _.get(json, 'data.CartCount', '0');
        const systemDescription = json.data.Response;
        this.setState({
          systemDescription,
          cartCount,
        });
      }
    });
  }

  registerComplain() {
    Events.trigger('complaintRegisterModal', true);
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    if (this.state.userInfo) {
      this.userDashboard(this.state.userInfo.UserName);
    }
  };

  getUserDetails(userName) {
    if (!userName) {
      Alert.alert('Invalid username');
      return;
    }

    APICaller(getUserProfileEndPoint(userName), 'GET').then(json => {
      console.log(json,'jsonnn*********')
      if (json.data.Success === '1') {
        global.profileInfo = json.data.Response;
        if (global.profileInfo) {
          Helper.setLocalStorageItem('userInfo', global.profileInfo);
        }

        if(global.profileInfo.Home != '' && global.profileInfo.Landmark != '' && global.profileInfo.Road != '' && global.profileInfo.Pincode != '' && global.profileInfo.Area != '') {
          this.setState({
            profileUpdated: true
          });
        } else {
          this.setState({
            profileUpdated: false
          })
        }
      }
    });
  }

  addSystem(navigation) {
    if (global.profileInfo && global.profileInfo.Home) {
      NavigationHelper.navigate(navigation, 'AddSystem');
    } else {
      this.setState({
        isVisibleConfirm: true,
      });
    }
  }

  leaveModal(navigation) {
    this.setState({
      isVisibleConfirm: false,
    });
    NavigationHelper.navigate(navigation, 'EditProfile');
  }

  getComplaintCall(userName){
    APICaller(getComplaintCallEndpoint(userName), 'GET','').then(json => {
      // console.log('json,', json);
      const flag = _.get(json,'data.Response[0].Flag',false);
      // console.log(flag);
      this.setState({
        complaintCallButton: flag,
        complaintPhoneData: _.get(json,'data.Response[0]',null)
      })

    });
  }

  render() {
    const {navigation} = this.props;
    const {
      userInfo,
      updateAvailable,
      systemDescription,
      refreshing,
      cartCount,
      isVisibleConfirm,
      profileUpdated
    } = this.state;
    return (
      <View style={styles.mainContainer}>
        <Appbar.Header style={{backgroundColor: Color.primary}}>
          <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
          <Appbar.Content title={'Dashboard'} />
          <Appbar.Action
            icon="cart"
            onPress={() => NavigationHelper.navigate(navigation, 'PlaceOrder')}
          />
          <Badge
            style={{position: 'absolute', zIndex: 1, right: 5, top: 10}}
            theme={Color.lightGray}
            size={18}>
            {cartCount}
          </Badge>
        </Appbar.Header>
       

        {updateAvailable ? <UpdateAvailableView /> : null}
        <ScrollView
          style={{flex: 1}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <UserInfoDashboardView userInfo={userInfo} />
          <CategoryItemList navigation={navigation} />
          {systemDescription ? (
            <SystemCardView
              systemDescription={systemDescription}
              navigation={navigation}
            />
          ) : null}
        </ScrollView>
      
        {!profileUpdated ? <TouchableOpacity
              style={{padding: 10, alignSelf: 'center'}}
              onPress={() => NavigationHelper.navigate(navigation, 'MyProfile')}>
              <Text style={{color: Color.primary, fontSize: 14, textDecorationLine: 'underline'}}>Please Update Your Profile</Text>
            </TouchableOpacity> : null }
        <View style={styles.bottomButton}>
          {/* if new user register then complaint close button not show that's why comment
           {_.size(systemDescription) > 0 && systemDescription[0].UserName ? ( */}
           
            <TouchableOpacity
              style={styles.actionTouch}
              onPress={() => this.registerComplain()}>
              <Text style={{color: '#fff', fontSize: 14}}>Complaint Book</Text>
            </TouchableOpacity>
          {/* ) : null} */}
          {/* <TouchableOpacity
            style={styles.actionTouch}
            onPress={() => this.addSystem(navigation)}>
            <Text style={{color: '#fff', fontSize: 14}}>Add System</Text>
          </TouchableOpacity> */}
        </View>

        {/* complaint Register options modal */}
        <ComplaintOptionsModal
          visible={true}
          systemDescription={systemDescription}
          userName={userInfo && userInfo.UserName}
          navigation={navigation}
        />
        {/* Update System Name */}
        <EditSystemNameModal userName={userInfo && userInfo.UserName} />

        {/* complaint with QR Code */}
        <ComplaintWithQRCode userInfo={userInfo} navigation={navigation} />

        {/* Antivirus Modal */}
        <AntivirusKeyModal />

        {/*system service modal info*/}
        <SystemServiceModal />

        {/* Bonus modal */}
        <BonusDaysModal />

        {/* System Warranty modal */}
        <SystemWarrantyModal />

        <ConfirmModal
          visible={isVisibleConfirm}
          message={
            'Your are not registerd any address yet, Clicks on Edit profile and register'
          }
          rightButton="Edit Profile"
          leaveModalReq={() => this.leaveModal(navigation)}
          cancelModalReq={() =>
            this.setState({
              isVisibleConfirm: false,
            })
          }
        />
          {this.state.complaintCallButton ? 
        <View style={{position: 'absolute', zIndex: 10001, bottom: 20, right: 20, shadowColor: 'red',
          shadowOffset: {width: 2, height:14},
          shadowOpacity: 0.9,
          shadowRadius: 3}}>
          <TouchableOpacity
              style={{borderRadius: 60, width:60, height: 60, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center'}}
              onPress={async() => {   
                          Helper.phoneNumber(_.get(this.state.complaintPhoneData,'FromMobileNo', ''),_.get(this.state.complaintPhoneData,'ToMobile', ''))
                }}>
              <McIcon name="phone" size={30} color={'white'} />
            </TouchableOpacity>
      </View> : null}
      </View>
    );
  }
}
