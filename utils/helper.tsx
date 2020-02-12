import {Alert, Platform, Linking} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import VersionNumber from 'react-native-version-number';
import APICaller from './api-caller';
import APIEndpoint from '../config/api-endpoint';
import Events from '../utils/events';

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
      [cancelled ? cancelValue : null, updateValue],
      {cancelable: cancelled},
    );
  },
  checkAppVersion() {
    APICaller(APIEndpoint.checkVersionEndPoint, 'GET', '').then(json => {
      const res = json.data;
      if (res.Success === '1') {
        if (res.Response) {
          const checkMinimumVersion = _.get(
            res.Response[0],
            'MinimumVersion',
            null,
          );
          console.log(VersionNumber.buildVersion, 'buidl');
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
