import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {VersionNumber} from '../../../../package';

import APICaller from '../../../../utils/api-caller';
import {userDashboardEndPoint} from '../../../../config/api-endpoint';
import Helper from '../../../../utils/helper';
import Events from '../../../../utils/events';
import styles from './styles';
import {
  UpdateAvailableView,
  UserInfoDashboardView,
  SpinnerView,
  Header,
} from '../../../../common/components';
import CarouselSliderView from '../../../../common/components/carousel-slider-view';

import CategoryItemList from '../../../../components/category-item-list';
import ComplaintOptionsModal from '../../../../components/complaint-options-modal';
import ComplaintWithQRCode from '../../../../components/complaint-with-qr-code';
import NavigationHelper from '../../../../utils/navigation-helper';

export default class Dashboard extends Component {
  state = {
    loadingData: false,
    updateAvailable: false,
    systemDescription: null,
    refreshing: false,
    userInfo: null,
  };

  componentDidMount() {
    this.getUserInfo();
    Events.on('updateAvailable', 'Updates', res => {
      this.setState({
        updateAvailable: res,
      });
    });
    Helper.checkUpdateAvailable();
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });
    this.userDashboard(userInfo.UserName);
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
      this.setState({
        loadingData: false,
        refreshing: false,
      });
      if (json.data.Success === '1') {
        const systmDescription = json.data.Response;
        this.setState({
          systemDescription: systmDescription,
        });
      }
    });
  }

  registerComplain() {
    Events.trigger('complaintRegisterModal', true);
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.userDashboard(this.state.userInfo.UserName);
  };

  render() {
    const {navigation} = this.props;
    const {
      userInfo,
      refreshing,
      loadingData,
      updateAvailable,
      systemDescription,
    } = this.state;
    return (
      <SafeAreaView style={styles.safeView}>
        <Header title="Dashboard" left="menu" />
        {loadingData ? <SpinnerView /> : null}
        {updateAvailable ? <UpdateAvailableView /> : null}
        <ScrollView
          style={{flex: 1}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <UserInfoDashboardView userInfo={userInfo} />
          <CategoryItemList />
          <View style={styles.bodyView}>
            <CarouselSliderView type="Dealer" />
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableOpacity style={styles.TouchBTN}>
              <Text style={styles.dashBtnText}>Ready Orders</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.TouchBTN}
              onPress={() => this.setState({qrCode: true})}>
              <Text style={styles.dashBtnText}>
                System, Parts Warranty Check
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.TouchBTN}
              onPress={() => this.registerComplain()}>
              <Text style={styles.dashBtnText}>Complaint Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.TouchBTN}>
              <Text style={styles.dashBtnText}>Complaint Request</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.TouchBTN}>
              <Text style={styles.dashBtnText}>
                Complaint Request from Team
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.TouchBTN}>
              <Text style={styles.dashBtnText}>Team's Components Stocks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.TouchBTN}>
              <Text style={styles.dashBtnText}>Reports Accept from Team</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* complaint Register options modal */}
        <ComplaintOptionsModal
          visible={true}
          systemDescription={systemDescription}
          userName={userInfo && userInfo.UserName}
          navigation={navigation}
        />
        {/* complaint with QR Code */}
        <ComplaintWithQRCode
          userName={userInfo && userInfo.UserName}
          navigation={navigation}
        />
      </SafeAreaView>
    );
  }
}
