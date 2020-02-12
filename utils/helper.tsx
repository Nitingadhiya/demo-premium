import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import APICaller from './api-caller';
import {checkVersionEndPoint} from '../config/api-endpoint';

const Helper = {
  async getLocalStorageItem(key) {
    AsyncStorage.getItem(key).then(res => {
      if (!res) return null;
      return JSON.parse(res);
    });
  },
  checkAppVersion() {
    APICaller(checkVersionEndPoint, 'GET', '').then(json => {
      const res = json.data;
      if (res.Success === '1') {
        if (res.Response) {
          const checkMinimumVersion = _.get(
            res.Response[0],
            'MinimumVersion',
            null,
          );
          console.log(VersionNumber.buildVersion, 'buidl');
          //alert(VersionNumber.buildVersion + '-' + checkMinimumVersion);
          if (VersionNumber.buildVersion <= checkMinimumVersion) {
            Helper.appUpdateAlert(false);
            return false;
          }

          const checkCurrentVersion = _.get(
            res.Response[0],
            'CurrentVersion',
            null,
          );
          if (VersionNumber.buildVersion < checkCurrentVersion) {
            Helper.appUpdateAlert(true);
            return false;
          }
          if (res.Response[0].is_login === '0') {
            AsyncStorage.removeItem('userInfo');
            Events.trigger('appRouteRefresh', '');
          }
        }
      } else {
      }
    });
    // Helper.appUpdateAlert(true);
  },
};

export default Helper;
