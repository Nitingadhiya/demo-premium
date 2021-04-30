import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import {MIcon} from '../../common/assets/vector-icon';
import styles from './styles';
import APICaller from '../../utils/api-caller';
import {getBonusEndPoint} from '../../config/api-endpoint';
import Events from '../../utils/events';

class LocationApprovedModal extends Component {
  state = {
    bonusModal: false,
    bonusList: null,
  };
  componentDidMount() {
    Events.on('location-modal', 'location', res => {
      this.setState({
        bonusModal: true,
      });
    });
  }

  modalShowHide(bool) {
    this.setState({bonusModal: bool});
  }

  render() {
    const {bonusModal, bonusList} = this.state;
  
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={true}
          onRequestClose={() => this.modalShowHide(false)}>
          <View style={styles.container}>
            <View style={styles.flexView}>
              <View style={styles.viewFlex}>
                <View style={styles.locationFlex}>
                  <Text>Allow Location</Text>
                </View>
                <TouchableOpacity style={styles.locationAllow}>
                  <Text style={styles.locationAllowText}>ALLOW</Text>
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
