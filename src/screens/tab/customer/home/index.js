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
import {userDashboardEndPoint} from '../../../../config/api-endpoint';
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
import {Appbar} from 'react-native-paper';

export default class Dashboard extends Component {
  state = {
    userInfo: null,
    updateAvailable: false,
    systemDescription: null,
    complaintRegisterModal: true,
  };

  componentDidMount() {
    this.getUserInfo();
    Events.on('refreshDashboard', 'refresh', () => {
      this.getUserInfo();
    });
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

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.userDashboard(this.state.userInfo.UserName);
  };

  render() {
    const {navigation} = this.props;
    const {
      userInfo,
      updateAvailable,
      systemDescription,
      refreshing,
    } = this.state;
    console.log(navigation);
    return (
      <View style={styles.mainContainer}>
        <Header title="Dashboard" left="menu" />
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
            onPress={() => NavigationHelper.navigate(navigation, 'AddSystem')}>
            <Text style={{color: '#fff', fontSize: 14}}>Add System</Text>
          </TouchableOpacity>
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
        <ComplaintWithQRCode
          userName={userInfo && userInfo.UserName}
          navigation={navigation}
        />

        {/* Antivirus Modal */}
        <AntivirusKeyModal />

        {/*system service modal info*/}
        <SystemServiceModal />

        {/* Bonus modal */}
        <BonusDaysModal />

        {/* System Warranty modal */}
        <SystemWarrantyModal />
      </View>
    );
  }
}
