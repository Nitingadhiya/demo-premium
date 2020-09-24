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
import {_} from '../../package';

let tmpSys = [];
let self;
class ScanWithQRCodeForMobileNo extends Component {
  state = {
    qrCode: false,
    item: null,
  };

  componentDidMount() {
    self = this;
    Events.on('ScanQRCodeMobileNoEvent', 'Event', res => {
      this.setState({
        qrCode: res,
      });
    });
  }

  onSuccess(e) {
    if (e.data) {
      const url = e.data;
      self.setState({qrCode: false});
      const result = url.replace(/(^\w+:|^)\/\//, '');
      self.getOrderDetailFromSystemTag(result);
    }
  }

  getOrderDetailFromSystemTag(qrCode) {
    const endPoint = `GetOrderDetailsFromSystemTag?SystemTag=${qrCode}`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      this.manageResponseOrderDetailData(json, 'array');
    });
  }

  manageResponseOrderDetailData(json) {
    let data = _.get(json, 'data.Response[0]', '');
    if (data) {
      const mobileNo = _.get(data, 'MobileNo1', '');
      if (mobileNo) self.props.getQRCode(mobileNo);
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
            <View>
              <QRCodeScanner
                showMarker
                onRead={this.onSuccess}
                cameraStyle={styles.cameraStyles}
                customMarker={
                  <View style={styles.rectangleContainer}>
                    <View style={styles.topOverlay}>
                      <View style={{margin: 15}}>
                        <Text style={styles.centerText}>
                          Scan QR code on your products for get your Mobile No
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
export default ScanWithQRCodeForMobileNo;
