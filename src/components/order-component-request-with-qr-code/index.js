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
import _ from 'lodash';
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
import style from 'react-native-datepicker/style';

let tmpSys = [];
let self;
class OrderComponentRequestWithQRCode extends Component {
  state = {
    qrCode: false,
    itemScanSerialNo: 0,
    errorMessage: null,
    textQrcode: null,
  };

  componentDidMount() {
    self = this;
    Events.on('order-component-request-with-QRCode', 'Event', res => {
      this.setState({
        qrCode: true,
        itemScanSerialNo: 0,
        textQrcode: res,
      });
    });
    Events.on('order-part-serial-no-added', 'Event', res => {
      self.setState({
        itemScanSerialNo: res,
        errorMessage: null,
      });
    });
    Events.on('order-part-serial-no-added-error', 'Event', res => {
      self.setState({
        errorMessage: res,
      });
    });
  }

  onSuccess(e) {
    if (e.data) {
      const url = e.data;
      const result = url.replace(/(^\w+:|^)\/\//, '');
      const {userInfo} = self.props;
      if (!userInfo) {
        Alert.alert('No User Found, Please Login again.');
      }
      const res = result.split('-');
      const check_serial = _.get(res, '[0]', '');
      if (check_serial == 'SYS') {
        Events.trigger('SYS-serial-scan-order', result);
        self.setState({
          qrCode: false,
        });
      } else {
        Events.trigger('parts-serial-scan-order', result);
      }
    }
  }

  render() {
    const {qrCode, itemScanSerialNo, errorMessage, textQrcode} = this.state;
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
                reactivate={true}
                reactivateTimeout={2000}
                cameraStyle={styles.cameraStyles}
                customMarker={
                  <View style={styles.customView}>
                    <View style={styles.rectangleContainer}>
                      <View style={styles.scanQRCodeView}>
                        <Text style={styles.textQrcode}>{textQrcode}</Text>
                      </View>
                      <View style={styles.topOverlay} />

                      <View style={{flexDirection: 'row'}}>
                        <View style={styles.leftAndRightOverlay} />

                        <View style={styles.rectangle} />

                        <View style={styles.leftAndRightOverlay} />
                      </View>

                      <View style={styles.bottomOverlay} />
                      {errorMessage ? (
                        <View style={styles.errorView}>
                          <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                      ) : (
                        <View />
                      )}
                      {itemScanSerialNo ? (
                        <View style={styles.itemScanView}>
                          <Text style={styles.textColorCamera}>
                            {itemScanSerialNo}
                          </Text>
                        </View>
                      ) : (
                        <View />
                      )}
                      <TouchableOpacity
                        style={styles.finishTouchButton}
                        onPress={() => this.setState({qrCode: false})}>
                        <Text style={styles.finishText}>Finish</Text>
                      </TouchableOpacity>
                    </View>
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
export default OrderComponentRequestWithQRCode;
