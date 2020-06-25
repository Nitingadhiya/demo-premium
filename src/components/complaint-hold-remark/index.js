import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  Alert,
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
  complaintOnHoldEndPoint,
} from '../../config/api-endpoint';
import _ from 'lodash';
import NavigationHelper from '../../utils/navigation-helper';
import Events from '../../utils/events';
import {useNavigation} from '@react-navigation/native';

let tmpSys = [];
let self;
class ComplaintHoldRemarkModal extends Component {
  state = {
    complaintHoldModal: false,
    compImages: null,
    holdRemarkText: null,
  };
  componentDidMount() {
    self = this;
    Events.on('complaintOnHoldModal', 'Hold-remark', res => {
      this.complaintData = res;
      this.setState({complaintHoldModal: true});
    });
  }

  submitOnHoldComplaint() {
    const {holdRemarkText} = this.state;
    let ComplainId = _.get(this.complaintData, 'ComplainId', '');
    let OnHoldBy = _.get(this.complaintData, 'OnHoldBy', '');
    APICaller(
      complaintOnHoldEndPoint(ComplainId, OnHoldBy, holdRemarkText),
      'GET',
    ).then(json => {
      this.setState({
        loadingData: false,
      });
      console.log(json);
      if (json.data.Success === '1') {
        this.setState({complaintHoldModal: false});
        Alert.alert('Complaint', _.get(json, 'data.Message', ''));
      }
    });
  }

  render() {
    const {compImages, complaintHoldModal} = this.state;

    return (
      <View>
        <Modal
          transparent
          visible={complaintHoldModal}
          onRequestClose={() => {
            this.setState({complaintHoldModal: false});
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.imageOutsideTouchButton}
            onPress={() => {
              this.setState({complaintHoldModal: false});
            }}>
            <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
              <View
                style={{
                  marginTop: 100,
                  width: '95%',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 10,
                  alignSelf: 'center',
                  elevation: 3,
                }}>
                <Text
                  style={{
                    color: '#333',
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 10,
                  }}>
                  Remark
                </Text>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    borderBottomWidth: 1,
                    borderColor: '#d3d3d3',
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                  }}>
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    <TextInput
                      placeholder={'Please enter complaint hold remark'}
                      value={this.state.holdRemarkText}
                      multiline={true}
                      onChangeText={text =>
                        this.setState({holdRemarkText: text})
                      }
                      style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        height: 100,
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: '#ccc',
                        margin: 5,
                      }}
                    />
                  </View>
                </View>

                <View style={{flexDirection: 'row', height: 40}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 10,
                      flex: 1,
                    }}
                    onPress={() => {
                      this.setState({
                        complaintHoldModal: !this.state.complaintHoldModal,
                      });
                    }}>
                    <Text style={{color: '#fff'}}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 10,
                      flex: 1,
                    }}
                    onPress={() => {
                      this.submitOnHoldComplaint();
                    }}>
                    <Text style={{color: '#fff'}}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}
export default ComplaintHoldRemarkModal;
