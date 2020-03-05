import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  Alert,
  CheckBox,
  Picker,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {TextInputView, SpinnerView} from '../../common/components';
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import {Color, Matrics} from '../../common/styles';
import styles from './styles';
import Helper from '../../utils/helper';
import APICaller from '../../utils/api-caller';
import {
  getAntivirusListEndPoint,
  complaintCompleteEndPoint,
} from '../../config/api-endpoint';
import NavigationHelper from '../../utils/navigation-helper';
import Events from '../../utils/events';
import {useNavigation} from '@react-navigation/native';

class ComplaintRemarkModal extends Component {
  state = {
    closeRemarkModal: false,
    item: null,
    antivirusCheckbox: false,
    selectAntivirus: '',
    antivirusKey: '',
    closeRemarkText: '',
    antivirusData: null,
  };

  componentDidMount() {
    Events.on('closeRemarkModal', 'Event', res => {
      this.setState({
        closeRemarkModal: res.isOpen,
        item: res.item,
        antivirusCheckbox: false,
        closeRemarkText: '',
        antivirusKey: '',
        selectAntivirus: '',
      });
    });
    this.getAntivirusList();
  }

  getAntivirusList() {
    APICaller(getAntivirusListEndPoint, 'GET').then(json => {
      if (json.data.Success === '1') {
        this.setState({
          antivirusData: json.data.Response,
        });
      }
    });
  }

  closeComplaintRemark() {
    const {
      antivirusCheckbox,
      selectAntivirus,
      antivirusKey,
      closeRemarkText,
      item,
    } = this.state;
    if (antivirusCheckbox && !selectAntivirus) {
      this.setState({
        validationAntivirus: 'Please select antivirus',
      });
      return;
    }

    if (antivirusCheckbox && !antivirusKey) {
      this.setState({
        validationAntivirus: 'Please enter antivirus key',
      });
      return;
    }

    this.setState({
      closeRemarkModal: false,
    });
    const {userInfo} = this.props;
    APICaller(
      complaintCompleteEndPoint(
        item.ComplaintID,
        userInfo.UserName,
        closeRemarkText,
        item.SystemTag,
        antivirusCheckbox,
        selectAntivirus,
        antivirusKey,
      ),
      'GET',
    ).then(json => {
      this.setState({loadingData: false, refreshing: false});
      if (json.data.Success === '1') {
        Events.trigger('RefreshComplaint', 'refresh');
        Alert.alert('Complaint', 'Successfully close complaint');
      } else {
        Alert.alert('Alert', json.data.Message);
      }
    });
  }

  render() {
    const {
      closeRemarkModal,
      antivirusCheckbox,
      selectAntivirus,
      antivirusKey,
      closeRemarkText,
      antivirusData,
    } = this.state;

    return (
      <View>
        <Modal
          animationType="fade"
          transparent
          visible={closeRemarkModal}
          onRequestClose={() => {
            this.setState({closeRemarkModal: false});
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
                    placeholder={'Please enter complaint close remark'}
                    value={closeRemarkText}
                    multiline={true}
                    onChangeText={text =>
                      this.setState({closeRemarkText: text})
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
                <View
                  style={{
                    flexDirection: 'row',
                    width: Matrics.SCREEN_WIDTH,
                    alignItems: 'center',
                  }}>
                  <CheckBox
                    onValueChange={() =>
                      this.setState({
                        antivirusCheckbox: !this.state.antivirusCheckbox,
                      })
                    }
                    value={antivirusCheckbox}
                  />
                  <Text
                    style={{
                      fontSize: Matrics.ScaleValue(14),
                    }}>
                    Antivirus
                  </Text>
                </View>
                {antivirusCheckbox ? (
                  <View
                    style={{
                      height: 50,
                      borderColor: '#ccc',
                      borderWidth: 1,
                      borderRadius: 5,
                      marginBottom: 5,
                      margin: 5,
                    }}>
                    <Picker
                      prompt="Antivirus list"
                      style={{
                        height: 50,
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({
                          selectAntivirus: itemIndex === 0 ? '' : itemValue,
                        });
                      }}
                      selectedValue={selectAntivirus}>
                      <Picker.Item
                        label={'Please choose below user'}
                        value={''}
                        disabled={true}
                      />
                      {antivirusData.map((data, index) => {
                        return (
                          <Picker.Item
                            label={data.CodeDesc}
                            value={data.CodeDesc}
                            key={`${index.toString()}`}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                ) : null}
                {antivirusCheckbox ? (
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    <TextInput
                      placeholder={'Please enter antivirus key'}
                      value={antivirusKey}
                      onChangeText={text => this.setState({antivirusKey: text})}
                      style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        height: 45,
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: '#ccc',
                        margin: 5,
                      }}
                    />
                  </View>
                ) : null}
                {this.state.validationAntivirus ? (
                  <Text
                    style={{
                      color: 'red',
                      fontSize: Matrics.ScaleValue(14),
                      marginBottom: 5,
                    }}>
                    {this.state.validationAntivirus}
                  </Text>
                ) : null}
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
                      closeRemarkModal: false,
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
                    this.closeComplaintRemark();
                  }}>
                  <Text style={{color: '#fff'}}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default ComplaintRemarkModal;
