import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import BackgroundJob from 'react-native-background-job';
import APICaller from './api-caller';
import {updateLatLongEndPoint} from '../config/api-endpoint';

const BackgroundServiceHelper = {
  everRunningJobKey() {
    return 'everRunningJobKey';
  },
  cancelAllJob() {
    BackgroundJob.cancelAll()
      .then(() => console.log('Success'))
      .catch(err => console.log(err));
  },
  BackgroundServiceJob() {
    BackgroundJob.register({
      jobKey: BackgroundServiceHelper.everRunningJobKey(),
      job: () => {
        console.log(
          `Background Job fired*************************!. Key = ${BackgroundServiceHelper.everRunningJobKey()}`,
        );
        console.log(global.userInfo, 'global.userInfo');
        if (!global.userInfo) return;
        if (
          global.userInfo.LoinType === '4' ||
          global.userInfo.LoinType === '1' ||
          global.userInfo.LoinType === '5'
        ) {
          BackgroundServiceHelper.cancelAllJob();
        }
        Geolocation.getCurrentPosition(
          position => {
            const body = JSON.stringify({
              UserName: global.userInfo.UserName,
              Latitude: position.coords.latitude,
              Longitude: position.coords.longitude,
            });
            APICaller(updateLatLongEndPoint, 'POST', body)
              .then(json => {
                console.log(json.data.Message);
              })
              .catch(function(error) {
                console.log(error);
              });
            console.log(position);
          },
          error => {
            console.log(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
            distanceFilter: 10,
            forceRequestLocation: true,
          },
        );
      },
    });
  },
};

export default BackgroundServiceHelper;
