import React, {Component} from 'react';
import {View, Text, ScrollView, RefreshControl} from 'react-native';
import {VersionNumber} from '../../../../package';

import APICaller from '../../../../utils/api-caller';
import {getVersionCodeEndPoint} from '../../../../config/api-endpoint';
import Helper from '../../../../utils/helper';
import styles from './styles';
import {
  UpdateAvailableView,
  UserInfoDashboardView,
} from '../../../../common/components';
import SystemCardView from '../../../../components/system-card-view';
import CategoryItemList from '../../../../components/category-item-list';

export default class Dashboard extends Component {
  state = {
    userInfo: null,
    updateAvailable: false,
  };

  componentDidMount() {
    this.getUserInfo();
    this.checkUpdateAvailable();
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });
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

  render() {
    const {userInfo, updateAvailable} = this.state;
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
          {userInfo ? <SystemCardView userInfo={userInfo} /> : null}
        </ScrollView>
      </View>
    );
  }
}
