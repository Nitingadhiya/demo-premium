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

import LocationServiceHelper from '../../../../utils/geo-location';
import styles from './styles';
import {
  UpdateAvailableView,
  UserInfoDashboardView,
  SpinnerView,
  Header,
} from '../../../../common/components';
import TeamComplaintOverview from '../../../../components/team-complaints-overview';
import TeamTasksOverview from '../../../../components/team-tasks-overview';
import ComplaintOptionsModal from '../../../../components/complaint-options-modal';
import ComplaintWithQRCode from '../../../../components/complaint-with-qr-code';

export default class Dashboard extends Component {
  state = {
    loadingData: false,
    updateAvailable: false,
    systemDescription: null,
    refreshing: false,
    userInfo: null,
  };

  componentDidMount() {
    Helper.userAccessApplication(this.props.navigation);
    this.getUserInfo();
    Events.on('updateAvailable', 'Updates', res => {
      this.setState({
        updateAvailable: res,
      });
    });
    Helper.checkUpdateAvailable();
    setTimeout(() => LocationServiceHelper.getLocation(), 1000);
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
        {loadingData ? (
          <View style={styles.spinnerView}>
            <SpinnerView />
          </View>
        ) : null}
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
          <View style={styles.bodyView}>
            <View style={styles.subBodyView}>
              <Text style={styles.textDate}>
                Dt. 18-04-2019 is Your "Positive" Day Performance Ratio is "4.5"
                Star
              </Text>
            </View>
            <View style={{height: 10}} />
            <TeamComplaintOverview text="Today Team Complaints Overview" />
            <TeamTasksOverview text="Today Work Task Overview" />
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
        <ComplaintWithQRCode userInfo={userInfo} navigation={navigation} />
      </SafeAreaView>
    );
  }
}
