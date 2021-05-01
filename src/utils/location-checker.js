import Events from './events';
import GPSState from 'react-native-gps-state'

const LocationChecker = {

  checkParticualrLocation() {
    GPSState.getStatus().then((status)=>{
      console.log("status",status)
      if(status == 0) {
        Events.trigger('location-modal-toggle', {visible: true, type:'ask_permission'});
        
      } else if(status == 1) {
        Events.trigger('location-modal-toggle', {visible: true, type:'open_setting'});
      } else if(status == 2) {
        Events.trigger('location-modal-toggle', {visible: true, type:'denied'});
      }
    })
  },

  checkLocationPermission() {
    GPSState.addListener((status)=>{
      switch(status){
          case GPSState.NOT_DETERMINED:
              //console.log('Please, allow the location, for us to do amazing things for you!')
              Events.trigger('location-modal-toggle', {visible: true, type:'ask_permission'});
          break;

          case GPSState.RESTRICTED:
           // console.log("location-modal-open ********");
            Events.trigger('location-modal-toggle', {visible: true, type:'open_setting'});
             // GPSState.openLocationSettings();
          break;

          case GPSState.DENIED:
          
            //  console.log('It`s a shame that you do not allowed us to use location :(')
              Events.trigger('location-modal-toggle', {visible: true, type:'denied'});
          break;

          case GPSState.AUTHORIZED_ALWAYS:
             // console.log("location ******** !!!!!!!!!!!");
              Events.trigger('location-modal-toggle', {visible: false, type:'granted'});
              //TODO do something amazing with you app
          break;

          case GPSState.AUTHORIZED_WHENINUSE:
            Events.trigger('location-modal-toggle', {visible: false, type:'granted'});
              //TODO do something amazing with you app
          break;
      }
    })
    GPSState.requestAuthorization(GPSState.AUTHORIZED_WHENINUSE);

    //Events.trigger('ada')
  },
 
};

export default LocationChecker;