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
import {
  getVersionCodeEndPoint,
  userDashboardEndPoint,
} from '../../../../config/api-endpoint';
import Helper from '../../../../utils/helper';
import Events from '../../../../utils/events';
import styles from './styles';
import {
  UpdateAvailableView,
  UserInfoDashboardView,
  SpinnerView,
} from '../../../../common/components';
import AdminTabel from '../../../../components/admin-table';
import TeamComplaintOverview from '../../../../components/team-complaints-overview';
import TeamTasksOverview from '../../../../components/team-tasks-overview';
import ComplaintOptionsModal from '../../../../components/complaint-options-modal';
import ComplaintWithQRCode from '../../../../components/complaint-with-qr-code';
import NavigationHelper from '../../../../utils/navigation-helper';

export default class Dashboard extends Component {
  state = {
    loadingData: false,
    updateAvailable: false,
    systemDescription: null,
    refreshing: false,
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
        let arrSystem = [];
        for (var key in systmDescription) {
          if (key === 'length' || !systmDescription.hasOwnProperty(key))
            continue;
          var value = systmDescription[key];
          arrSystem.push({
            key: key,
            amount: value[0].Amount,
            todayCount: value[0].TodayCount,
            totalCount: value[0].TotalCount,
          });
        }
        this.setState({
          systemDescription: arrSystem,
        });
      }
    });
  }

  registerComplain() {
    Events.trigger('complaintRegisterModal', true);
  }

  onRefresh = () => {
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
        {loadingData ? <SpinnerView /> : null}
        {updateAvailable ? <UpdateAvailableView /> : null}
        <ScrollView
          style={{flex: 1}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          {userInfo ? (
            <AdminTabel
              userName={userInfo.UserName}
              systemDescription={systemDescription}
            />
          ) : null}
          <TeamComplaintOverview text="Today Team Complaints Overview" />
          <TeamTasksOverview text="Today Team Work Tasks Overview" />

          <View style={styles.bodyView}>
            <TouchableOpacity
              style={styles.TouchBTN}
              onPress={() =>
                NavigationHelper.navigate(navigation, 'OrderReady')
              }>
              <Text style={styles.dashBtnText}>Ready Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.TouchBTN}
              onPress={() => this.registerComplain()}>
              <Text style={styles.dashBtnText}>Complaint Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.TouchBTN}>
              <Text style={styles.dashBtnText}>Team's Components Stocks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.TouchBTN}>
              <Text style={styles.dashBtnText}>Reports Accept from Team</Text>
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
