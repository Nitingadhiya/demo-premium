import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
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
} from '../../../../common/components';
import SystemCardView from '../../../../components/system-card-view';
import CategoryItemList from '../../../../components/category-item-list';
import ComplaintOptionsModal from '../../../../components/complaint-options-modal';
import NavigationHelper from '../../../../utils/navigation-helper';

export default class Dashboard extends Component {
  state = {
    userInfo: null,
    updateAvailable: false,
    systemDescription: null,
    complaintRegisterModal: true,
  };

  componentDidMount() {
    console.log('Dod ');
    this.getUserInfo();
    this.checkUpdateAvailable();
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });

    this.userDashboard(userInfo.UserName);
  }

  checkUpdateAvailable() {
    APICaller(getVersionCodeEndPoint, 'GET').then(json => {
      if (json.data.Success === '1') {
        if (VersionNumber.buildVersion < json.data.VersionCode) {
          this.setState({
            updateAvailable: true,
          });
        }
      }
    });
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
        const systemDescription = json.data.Response;
        this.setState({
          systemDescription,
        });
      }
    });
  }

  registerComplain() {
    Events.trigger('complaintRegisterModal', true);
  }

  render() {
    const {userInfo, updateAvailable, systemDescription} = this.state;
    return (
      <View style={styles.mainContainer}>
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
          {systemDescription ? (
            <SystemCardView systemDescription={systemDescription} />
          ) : null}
        </ScrollView>
        <View style={styles.bottomButton}>
          {systemDescription && systemDescription[0].UserName ? (
            <TouchableOpacity
              style={styles.actionTouch}
              onPress={() => this.registerComplain()}>
              <Text style={{color: '#fff', fontSize: 14}}>Complaint Book</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.actionTouch}
            onPress={() => NavigationHelper.navigate('AddSystem')}>
            <Text style={{color: '#fff', fontSize: 14}}>Add System</Text>
          </TouchableOpacity>
        </View>

        {/* complaint Register options modal */}
        <ComplaintOptionsModal
          visible={true}
          systemDescription={systemDescription}
          userName={userInfo && userInfo.UserName}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}
