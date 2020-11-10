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
import { Color } from '../../common/styles';
import {SpinnerView} from "../../common/components/spinner"

class ComplaintPickerModal extends Component {
  state = {
    complaintPickerUserModal: false,
    bonusList: null,
    loadingData: false
  };
  componentDidMount() {
    Events.on('complaintPickerUserEvent', 'ComplaintPicker', res => {
      this.setState({
        complaintPickerUserModal: true,
      });
    });
  }

  modalShowHide(bool) {
    this.setState({complaintPickerUserModal: bool});
  }

  complaintAssigned() {
    this.modalShowHide(false)
  }

  assignedToFn(value) {
    if (!value) return;
    const {userInfo, complaintId} = this.props;
    if(!userInfo) {
      Alert.alert('User name not found');
    }
    if(!complaintId) {
      Alert.alert('Complaint Id not found');
    }
    
    this.setState({loadingData: true});
    const endPoint = `ComplaintAssign?ComplainId=${complaintId}&AssignBy=${
      userInfo.UserName
    }&AssignTo=${value}`;
    const method = 'GET';

    APICaller(`${endPoint}`, method).then(json => {
      this.setState({loadingData: false});
      this.complaintAssigned(false)
      if (json.data.Success === '0') {
        return;
      }
      if (json.data.Success === '1') {
        Alert.alert('Complaint', json.data.Message);
      } else {
        Alert.alert('Alert', json.data.Message);
      }
    });
  }

  render() {
    const {complaintPickerUserModal, loadingData} = this.state;
    const {userList} = this.props;
    if (!complaintPickerUserModal) return <View />;
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={complaintPickerUserModal}
          onRequestClose={() => this.modalShowHide(false)}>
          <View style={styles.container}>
            <View style={styles.flexView}>
              <View style={styles.viewHeader}>
                <TouchableOpacity
                  onPress={() => this.modalShowHide(false)}
                  style={styles.closeIcon}>
                  <MIcon name="close" size={25} color={Color.black30} />
                </TouchableOpacity>
                <Text style={styles.titleText}>Assign Complaint</Text>
              </View>
              <View>
                {userList && userList.map((data, index) => {
                  return (
                    <TouchableOpacity style={styles.userViewList} onPress={()=>this.assignedToFn(data.UserName)} key={`${index}`}>
                      <Text style={styles.userText} key={`${index.toString()}`}>{data.FirstName + ' ' + data.LastName}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {this.state.loadingData ? (
                <View style={styles.spinnerView}>
                  <SpinnerView />
                </View>
              ) : null}
            </View>
          </View>
        </Modal>
      </View>
    );
    //value={data.UserName}
  }
}
export default ComplaintPickerModal;
