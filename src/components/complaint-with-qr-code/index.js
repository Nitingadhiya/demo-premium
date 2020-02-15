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
class ComplaintWithQRCode extends Component {
  state = {
    qrCode: false,
  };

  componentDidMount() {
    Events.on('ComplaintWithQRCodeEvent', 'Event', res => {
      this.setState({
        qrCode: res,
      });
    });
  }

  onSuccess(e) {
    if (e.data) {
      const url = e.data;
      this.setState({qrCode: false});
      const result = url.replace(/(^\w+:|^)\/\//, '');
      this.getComplaintCharge(result);
    }
  }

  getComplaintCharge(result) {
    const {navigation, userName} = this.props;
    Helper.getComplaintCharge(navigation, userName, result);
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
                      <Text style={styles.centerText}>
                        Scan QR code on your products for book your complaint
                      </Text>
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
