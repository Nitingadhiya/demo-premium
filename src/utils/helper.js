import {Alert, Platform, Linking} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import VersionNumber from 'react-native-version-number';
import APICaller from './api-caller';
import {
  checkVersionEndPoint,
  updateTokenEndPoint,
  getComplaintChargeEndPoint,
  getVersionCodeEndPoint,
} from '../config/api-endpoint';
import Events from './events';
import NavigationHelper from './navigation-helper';

const Helper = {
  getLocalStorageItem(key) {
    return AsyncStorage.getItem(key).then(res => {
      if (!res) return null;
      return JSON.parse(res);
    });
  },
  setLocalStorageItem(key, value) {
    AsyncStorage.setItem(key, JSON.stringify(value));
  },
  removeLocalStorage(key) {
    AsyncStorage.removeItem(key);
  },
  clearLocalStorage() {
    AsyncStorage.clear();
  },
  appUpdateAlert(cancelled) {
    const cancelValue = {
      text: 'Cancel',
      style: 'cancel',
    };

    const updateValue = {
      text: 'Update',
      onPress: () => {
        if (Platform.OS === 'android') {
          Linking.openURL(
            'https://play.google.com/store/apps/details?id=com.premium.sales.corporation',
          );
        }
      },
      style: 'default',
    };

    Alert.alert(
      'New Version Available',
      'Please update app to new version to continue using.',
      [cancelled ? cancelValue : '', updateValue],
      {cancelable: cancelled},
    );
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
  },
  checkUpdateAvailable() {
    APICaller(getVersionCodeEndPoint, 'GET').then(json => {
      if (json.data.Success === '1') {
        if (VersionNumber.buildVersion < json.data.VersionCode) {
          Events.trigger('updateAvailable', true);
        }
      }
    });
  },
  async registerWithtoken(token) {
    if (!token) return;
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    if (userInfo) {
      APICaller(
        updateTokenEndPoint(userInfo.UserName, token),
        'GET',
      ).then(json => {});
    }
  },
  getComplaintCharge(navigation, userName, result, tmpSys) {
    if (userName && navigation) {
      APICaller(getComplaintChargeEndPoint(result, userName), 'GET').then(
        json => {
          if (json.data.Success === '1') {
            //if (json.data.Response.ComplaintCharge) {
            if (result) {
              NavigationHelper.navigate(navigation, 'SubmitComplaint', {
                systemTag: result,
                complainCharge: json.data.Response.ComplaintCharge,
                data: json.data.Response,
              });
            } else {
              NavigationHelper.navigate(navigation, 'SubmitComplaint', {
                systemTag: '',
                tmpSystemName: tmpSys,
                complainCharge: json.data.Response.ComplaintCharge,
                data: json.data.Response,
              });
            }
            //}
          }
        },
      );
    }
  },
};

export default Helper;
