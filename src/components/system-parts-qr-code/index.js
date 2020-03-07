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
class SystemPartsWithQRCode extends Component {
  state = {
    qrCode: true,
    item: null,
  };

  componentDidMount() {
    self = this;
    Events.on('qrCode-syste-parts', 'open again', res => {
      this.setState({
        qrCode: true,
      });
    });
  }

  onSuccess(e) {
    if (e.data) {
      const url = e.data;
      self.setState({qrCode: false});
      const result = url.replace(/(^\w+:|^)\/\//, '');
      const {userInfo} = self.props;
      if (!userInfo) {
        Alert.alert('No User Found, Please Login again.');
      }
      Events.trigger('system-parts-tag-event', result);
    }
  }

  render() {
    const {qrCode} = this.state;

    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={qrCode}
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
                      <View style={styles.rectangle} />
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
export default SystemPartsWithQRCode;
