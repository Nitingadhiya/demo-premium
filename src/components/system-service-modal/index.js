import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {TextInputView, SpinnerView} from '../../common/components';
import {MIcon} from '../../common/assets/vector-icon';
import styles from './styles';
import Helper from '../../utils/helper';
import APICaller from '../../utils/api-caller';
import {getServiceEndPoint} from '../../config/api-endpoint';
import NavigationHelper from '../../utils/navigation-helper';
import Events from '../../utils/events';
import {useNavigation} from '@react-navigation/native';

class SystemServiceModal extends Component {
  state = {
    serviceModal: false,
    serviceList: null,
  };
  componentDidMount() {
    Events.on('systemServiceEvent', 'service', res => {
      this.setState({
        serviceModal: true,
        systemTag: res.systemTag,
      });
      this.getServiceDayFn(res.systemTag);
    });
  }

  getServiceDayFn(tag) {
    //this.setState({loading: true});
    APICaller(getServiceEndPoint(tag), 'GET').then(json => {
      if (json.data.Success === '1') {
        this.setState({
          serviceList: json.data.Response,
          serviceModal: true,
          // loading: false,
        });
      } else {
        Alert.alert('Alert', json.data.Message || 'No Services Found.');
      }
    });
  }

  modalShowHide(bool) {
    this.setState({serviceModal: bool});
  }

  render() {
    const {serviceModal, serviceList} = this.state;
    if (!serviceList) return <View />;
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={serviceModal}
          onRequestClose={() => {
            this.modalShowHide(false);
          }}>
          <View style={styles.container}>
            <View style={styles.viewFlex}>
              <View style={styles.modalTitleView}>
                <TouchableOpacity
                  onPress={() => this.modalShowHide(false)}
                  style={styles.closeIcon}>
                  <MIcon name="keyboard-arrow-left" size={40} />
                </TouchableOpacity>
                <Text style={styles.titleText}>Services</Text>
              </View>
              <ScrollView style={{flex: 1}}>
                {serviceList &&
                  this.state.serviceList.map(res => (
                    <View style={styles.bodyView}>
                      <Text style={styles.textProblem}>
                        <Text>
                          {res.Problem}({res.ComplaintID})
                        </Text>
                      </Text>
                      <Text style={styles.textComplaintBy}>
                        <Text style={styles.bold}>Complaint By : </Text>{' '}
                        {res.ComplaintBy}
                      </Text>

                      <Text style={styles.textComplaintBy}>
                        <Text style={styles.bold}>Part : </Text> {res.Part}
                      </Text>

                      <Text style={styles.textComplaintBy}>
                        <Text style={styles.bold}>Total Charges : </Text>
                        {res.TotalCharges}
                      </Text>

                      <Text style={styles.textComplaintBy}>
                        <Text style={styles.bold}>Complaint Status : </Text>
                        {res.ComplaintStatus}
                      </Text>

                      <Text style={styles.textComplaintBy}>
                        <Text style={styles.bold}>Book Date : </Text>{' '}
                        {res.BookDate}
                      </Text>
                    </View>
                  ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default SystemServiceModal;
