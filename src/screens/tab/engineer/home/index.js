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
    global.userInfo = userInfo;
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
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => this.backgroundJobMethod()}>
          <Text>Schedule everRunning job</Text>
        </TouchableOpacity> */}
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
              <Text style={styles.textDate}>
                You Earned: 0.5-Silver, 0.0-Gold
              </Text>
              <Text style={styles.textDate}>
                Suggestion: (Gujarati Suggestion)
              </Text>
            </View>
            <View style={{height: 10}} />
            <TeamComplaintOverview text="Your Complaint Overview" />
            <TeamTasksOverview text="Your Work Task Overview" />
          </View>
          <View style={{flex: 1, alignItems: 'center', marginBottom: 10}}>
            <TouchableOpacity style={styles.TouchBTN}>
              <Text style={styles.dashBtnText}>Complaint Close</Text>
            </TouchableOpacity>
            {/* <SystemWarrantyCheckModal /> */}
            {/* <TouchableOpacity
              style={styles.TouchBTN}
              onPress={() => this.setState({ qrCode: true })}
            >
              <Text style={styles.dashBtnText}>
                System, Parts Warranty Check
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.TouchBTN}>
              <Text style={styles.dashBtnText}>More 1 Complaint Request</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.TouchBTN}
              onPress={() =>
                NavigationHelper.navigate(navigation, 'ComponentRequest')
              }>
              <Text style={styles.dashBtnText}>Component Request</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.TouchBTN}
              onPress={() =>
                NavigationHelper.navigate(navigation, 'TeamComponentStock')
              }>
              <Text style={styles.dashBtnText}>Team's Components Stocks</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.TouchBTN}
              onPress={() =>
                NavigationHelper.navigate(navigation, 'ComponentRestockRequest')
              }>
              <Text style={styles.dashBtnText}>Components Re-stocks</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
