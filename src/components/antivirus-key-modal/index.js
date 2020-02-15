import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {TextInputView, SpinnerView} from '../../common/components';
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import {Color, Matrics} from '../../common/styles';
import styles from './styles';
import Helper from '../../utils/helper';
import APICaller from '../../utils/api-caller';
import {
  getComplaintImageEndPoint,
  getComplaintChargeEndPoint,
} from '../../config/api-endpoint';
import NavigationHelper from '../../utils/navigation-helper';
import Events from '../../utils/events';
import {useNavigation} from '@react-navigation/native';

class AntivirusKeyModal extends Component {
  state = {
    antivirusKeyModal: false,
  };
  componentDidMount() {
    Events.on('antivirusKeyEvent', 'antivirus', res => {
      this.setState({
        antivirusKeyModal: true,
        antivirusType: res.antivirus,
        antivirusKeyText: res.key,
      });
    });
  }

  modalShowHide(bool) {
    this.setState({antivirusKeyModal: bool});
  }

  render() {
    const {antivirusKeyModal, antivirusType, antivirusKeyText} = this.state;

    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={antivirusKeyModal}
          onRequestClose={() => this.modalShowHide(false)}>
          <View style={styles.container}>
            <View style={styles.subModalView}>
              <View style={styles.modalTitleView}>
                <Text style={styles.titleText}>Antivirus</Text>
              </View>
              <View style={styles.viewBody}>
                <Text style={styles.textName}>
                  <Text style={styles.bold}>Name:</Text>{' '}
                  {antivirusType || 'Not found'}
                </Text>
                <Text style={styles.textName}>
                  <Text style={styles.bold}>Key:</Text>{' '}
                  {antivirusKeyText || 'Not found'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => this.modalShowHide(false)}>
                <Text
                  style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default AntivirusKeyModal;
