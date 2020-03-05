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
import QRCodeScanner from 'react-native-qrcode-scanner';
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
let self;
class ComplaintWithQRCode extends Component {
  state = {
    qrCode: false,
    item: null,
  };

  componentDidMount() {
    self = this;
    Events.on('ComplaintWithQRCodeEvent', 'Event', res => {
      this.setState({
        qrCode: res.isOpen,
        item: res.item,
      });
    });
  }

  onSuccess(e) {
    if (e.data) {
      const url = e.data;
      self.setState({qrCode: false});
      const result = url.replace(/(^\w+:|^)\/\//, '');
      const {userInfo} = self.props;
      if (userInfo.LoginType === '2' || userInfo.LoginType === '3') {
        self.complaintClose(result);
      }
      if (userInfo.LoginType === '4') {
        self.getComplaintCharge(result);
      }
    }
  }

  getComplaintCharge(result) {
    const {navigation, userName} = this.props;
    Helper.getComplaintCharge(navigation, userName, result);
  }

  complaintClose(result) {
    const {item} = this.state;
    if (!item) return;
    console.log(item, '*************' + result);

    const splt = item.SystemTag.split('-');
    const checksplt = splt[0];
    if (checksplt === 'SYS' || checksplt === 'SER') {
      if (item.SystemTag === result) {
        console.log('Close Remark modal');
        const params = {
          isOpen: true,
          item,
        };
        Events.trigger('closeRemarkModal', params);
        //this.setState({closeRemarkModal: true});
      } else {
        Alert.alert(
          'Complaint',
          'Your Complaint QR Code does not match with Scan QR Code.',
        );
      }
    } else {
      console.log('Close Remark modal ***');
      const params = {
        isOpen: true,
        item,
      };
      Events.trigger('closeRemarkModal', params);

      //this.setState({closeRemarkModal: true});
    }
  }

  render() {
    const {qrCode} = this.state;

    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.qrCode}
          onRequestClose={() => {
            this.setState({qrCode: false});
          }}>
          <View style={styles.container}>
            <View style={{flex: 1}}>
              <QRCodeScanner
                showMarker
                onRead={this.onSuccess}
                cameraStyle={styles.cameraStyles}
                customMarker={
                  <View style={styles.rectangleContainer}>
                    <View style={styles.topOverlay}>
                      <View style={{margin: 15}}>
                        <Text style={styles.centerText}>
                          Scan QR code on your products for book your complaint
                        </Text>
                      </View>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                      <View style={styles.leftAndRightOverlay} />

                      <View style={styles.rectangle}>
                        {/* <Animatable.View
                          style={styles.scanBar}
                          direction="alternate-reverse"
                          iterationCount="infinite"
                          duration={1700}
                          easing="linear"
                          animation={this.makeSlideOutTranslation(
                            'translateY',
                            SCREEN_WIDTH * 0.22,
                          )}
                        /> */}
                      </View>

                      <View style={styles.leftAndRightOverlay} />
                    </View>

                    <View style={styles.bottomOverlay} />
                  </View>
                }
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default ComplaintWithQRCode;
