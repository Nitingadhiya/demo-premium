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

let tmpSys = [];
class ComplaintOptionsModal extends Component {
  state = {
    complaintRegisterModal: false,
    compImages: null,
  };
  componentDidMount() {
    Events.on('complaintRegisterModal', 'Image', res => {
      this.setState({complaintRegisterModal: true});
    });
    this.fetchQRCodeImage();
  }

  fetchQRCodeImage() {
    APICaller(getComplaintImageEndPoint, 'GET').then(json => {
      this.setState({
        loadingData: false,
      });
      if (json.data.Success === '1') {
        this.setState({compImages: json.data.Response});
      }
    });
  }

  getComplainCharge(result) {
    const {userName, navigation} = this.props;
    if (userName) {
      this.setState({
        loadingData: true,
      });
      APICaller(getComplaintChargeEndPoint(result, userName), 'GET').then(
        json => {
          this.setState({
            loadingData: false,
          });
          if (json.data.Success === '1') {
            //if (json.data.Response.ComplaintCharge) {
            if (result) {
              NavigationHelper.navigate(navigation, 'SubmitComplaint', {
                systemTag: result,
                complainCharge: json.data.Response.ComplaintCharge,
                data: json.data.Response,
              });
            } else {
              NavigationHelper.navigate(navigation, 'SubmitComplaint', {
                systemTag: '',
                tmpSystemName: tmpSys,
                complainCharge: json.data.Response.ComplaintCharge,
                data: json.data.Response,
              });
            }
            //}
          }
        },
      );
    }
  }

  withoutQRCode = () => {
    const {systemDescription} = this.props;
    this.setState({complaintRegisterModal: false});
    tmpSys = [];
    systemDescription.map(res => {
      if (res.SystemTag) {
        const sysTg = res.SystemTag.split('-');
        if (sysTg[0] === 'TMP') {
          tmpSys.push({
            sysName: res.SystemName,
            sysTag: res.SystemTag,
          });
        }
      }
    });
    this.getComplainCharge('');
  };

  render() {
    const {compImages, complaintRegisterModal} = this.state;

    return (
      <View>
        <Modal
          transparent
          visible={complaintRegisterModal}
          onRequestClose={() => {
            this.setState({complaintRegisterModal: false});
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.imageOutsideTouchButton}
            onPress={() => {
              this.setState({complaintRegisterModal: false});
            }}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={[styles.scanTouch, styles.borderRight]}
                onPress={() => {
                  this.setState({complaintRegisterModal: false});
                  setTimeout(() => {
                    this.setState({qrCode: true});
                  }, 500);
                }}>
                {compImages ? (
                  <View>
                    <Image
                      source={{uri: this.state.compImages[1].Slide}}
                      style={styles.imageHeight}
                      resizeMode="center"
                    />
                  </View>
                ) : (
                  <Text>With QR-Code</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.scanTouch}
                onPress={() => this.withoutQRCode()}>
                {compImages ? (
                  <View>
                    <Image
                      source={{uri: this.state.compImages[0].Slide}}
                      style={styles.imageHeight}
                      resizeMode="center"
                    />
                  </View>
                ) : (
                  <Text>Without QR-Code</Text>
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}
export default ComplaintOptionsModal;
