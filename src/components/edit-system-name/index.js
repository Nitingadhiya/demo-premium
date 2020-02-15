import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {TextInputView, SpinnerView} from '../../common/components';
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import {Color, Matrics} from '../../common/styles';
import styles from './styles';
import Helper from '../../utils/helper';
import APICaller from '../../utils/api-caller';
import {getCityEndPoint} from '../../config/api-endpoint';
import NavigationHelper from '../../utils/navigation-helper';
import {updateSystemNameEndPoint} from '../../config/api-endpoint';
import Events from '../../utils/events';

class EditSystemNameModal extends Component {
  state = {
    systemNameUpdateModal: false,
    systemName: null,
    systemTag: null,
    showSystemNameError: null,
  };

  componentDidMount() {
    Events.on('systemNameUpdateModal', 'modal', res => {
      this.setState({
        systemNameUpdateModal: true,
        systemName: res.systemName,
        systemTag: res.systemTag,
      });
    });
  }

  updateSystemName(systemName) {
    const {userName} = this.props;
    if (!systemName) {
      this.setState({
        showSystemNameError: 'Please enter valid system name',
      });
      return;
    }
    if (!userName || !this.state.systemTag) {
      this.setState({
        showSystemNameError: 'Username OR System tag missing',
      });
      return;
    }
    this.setState({
      showSystemNameError: '',
    });
    APICaller(
      updateSystemNameEndPoint(systemName, userName, this.state.systemTag),
      'GET',
    ).then(json => {
      if (json.data.Success === '2') {
        Events.trigger('refreshDashboard');
        this.setState({
          systemNameUpdateModal: false,
        });
      }
      if (json.data.Success === '3') {
        this.setState({
          showSystemNameError: json.data.Message,
        });
      }
    });
  }

  render() {
    const {systemName, systemNameUpdateModal, showSystemNameError} = this.state;
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={systemNameUpdateModal}
          onRequestClose={() => {
            this.setState({systemNameUpdateModal: false});
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              padding: Matrics.ScaleValue(10),
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                elevation: 4,
                shadowColor: 'rgba(0,0,0,0.6)',
                shadowOffset: {width: 5, height: 2},
                shadowRadius: 0.4,
              }}>
              <View
                style={{
                  height: Matrics.ScaleValue(45),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: '#ccc',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => this.setState({systemNameUpdateModal: false})}
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    paddingHorizontal: 10,
                    left: 0,
                  }}>
                  <MIcon name="close" size={30} />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: Matrics.ScaleValue(18),
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  Update System Name
                </Text>
              </View>
              <View style={{margin: 10}}>
                <TextInput
                  placeholder={'System Name'}
                  value={systemName}
                  style={styles.systemTextInput}
                  onChangeText={text =>
                    this.setState({
                      systemName: text,
                    })
                  }
                />
                {showSystemNameError ? (
                  <Text
                    style={{
                      marginTop: Matrics.ScaleValue(10),
                      color: 'red',
                      fontSize: Matrics.ScaleValue(12),
                    }}>
                    {showSystemNameError}
                  </Text>
                ) : null}
                <TouchableOpacity
                  onPress={() => this.updateSystemName(systemName)}
                  style={styles.touchSave}>
                  <Text style={styles.touchSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default EditSystemNameModal;
