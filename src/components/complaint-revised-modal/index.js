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
import {complaintRevisedEndPoint} from '../../config/api-endpoint';
import _ from 'lodash';
import NavigationHelper from '../../utils/navigation-helper';
import Events from '../../utils/events';
import {useNavigation} from '@react-navigation/native';

let tmpSys = [];
let self;
class ComplaintRevisedModal extends Component {
  state = {
    complaintRevisedModal: false,
    compImages: null,
    chargeText: null,
  };
  componentDidMount() {
    self = this;
    Events.on('complaintRevisedModal', 'complaint-revised', res => {
      this.complaintData = res;
      this.setState({complaintRevisedModal: true});
    });
  }

  submitRevisedComplaint() {
    const {chargeText} = this.state;
    let ComplainId = _.get(this.complaintData, 'ComplainId', '');
    let RevisedBy = _.get(this.complaintData, 'RevisedBy', '');
    const index = _.get(this.complaintData, 'index', '');
    APICaller(
      complaintRevisedEndPoint(ComplainId, RevisedBy, chargeText),
      'GET',
    ).then(json => {
      this.setState({
        loadingData: false,
      });
      console.log(json);
      if (json.data.Success === '1') {
        this.setState({complaintRevisedModal: false});
        Alert.alert('Complaint', _.get(json, 'data.Message', ''));
        this.props.successOnHold(index);
      }
    });
  }

  render() {
    const {compImages, complaintRevisedModal} = this.state;

    return (
      <View>
        <Modal
          transparent
          visible={complaintRevisedModal}
          onRequestClose={() => {
            this.setState({complaintRevisedModal: false});
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.imageOutsideTouchButton}
            onPress={() => {
              this.setState({complaintRevisedModal: false});
            }}>
            <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
              <View
                style={{
                  marginTop: 200,
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
                  Complaint Revised
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
                      placeholder={'Revised charges'}
                      value={this.state.chargeText}
                      onChangeText={text => this.setState({chargeText: text})}
                      style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        height: 40,
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: '#ccc',
                        margin: 5,
                      }}
                      keyboardType="number-pad"
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
                        complaintRevisedModal: !this.state
                          .complaintRevisedModal,
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
                      this.submitRevisedComplaint();
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
export default ComplaintRevisedModal;
