import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import styles from './styles';
import Events from '../../utils/events';
import GPSState from 'react-native-gps-state';
import { Image } from 'react-native';
import { Images } from '../../common/styles';

let modalOpen = false;
class LocationApprovedModal extends Component {
  state = {
    visible: false,
    bonusList: null,
    type:''
  };
  componentDidMount() {
    Events.on('location-modal-toggle', 'location', res => {
     if( modalOpen ==  false && res.visible){
      this.setState({
        visible: true,
        type: res.type
      });
      modalOpen = true;
      } 
      else if(modalOpen ==  true && !res.visible) {
      this.setState({
        visible: false,
        type: res.type
      });

      modalOpen = false;
     }
     
    });
  }

  modalShowHide(bool) {
    this.setState({bonusModal: bool});
  }

  openSettingMenu () {
    
    const {type} = this.state;
    if(type == 'open_setting' || type == 'ask_permission')
    GPSState.openLocationSettings();
    if(type == 'denied') {
      GPSState.openAppDetails();
    }
    GPSState.openLocationSettings();
  }

  renderText () {
    const {type} = this.state;
    if(type == 'open_setting')
    return 'OPEN SETTINGS';
    if(type == 'denied') return "ALLOW LOCATION";
    return "ALLOW LOCATION";
   }

  render() {
    const {visible, bonusList} = this.state;
  
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={visible}
          onRequestClose={() => this.modalShowHide(false)}>
          <View style={styles.container}>
            <View style={styles.flexView}>
              <View style={styles.viewFlex}>
                <View style={styles.locationFlex}>
                    <Image source={Images.AppIcon} style={{width: 60, height: 60}} />
                  <Text style={styles.locationPermissionText}>Location Permission Required</Text>
                  <Text style={styles.descriptionText}>Allow Premium Sales Corportation to automatically detect your current location to show you near by complaints</Text>
                  <Text>To enable, go to Settings and turn on Location / Allow location permission.</Text>
                </View>
                <TouchableOpacity style={styles.locationAllow} onPress={()=> this.openSettingMenu()}>
                  <Text style={styles.locationAllowText}>{this.renderText()}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default LocationApprovedModal;
