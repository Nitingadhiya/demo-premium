import {Platform, PermissionsAndroid, ToastAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import LocationChecker from './location-checker';

const LocationServiceHelper = {
  async hasLocationPermissionMethod() {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) return true;
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }
    LocationChecker.checkLocationPermission();
    return false;
  },
  async getLocation() {
    const hasLocationPermission = await this.hasLocationPermissionMethod();
    if (!hasLocationPermission) return;
    //this.setState({loading: true}, () => {
    Geolocation.getCurrentPosition(
      position => {
        // this.setState({location: position, loading: false});
        // console.log(position);
      },
      error => {
        //this.setState({location: error, loading: false});
        // console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 50,
        forceRequestLocation: true,
      },
    );
    //});
  },
};

export default LocationServiceHelper;
