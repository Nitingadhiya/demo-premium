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
import style from 'react-native-datepicker/style';

let self;
class ComponentRestockRequestWithQRCode extends Component {
  state = {
    qrCode: false,
    item: null,
    itemScanSerialNo: 0,
  };

  componentDidMount() {
    self = this;
    Events.on('component-restock-request-with-QRCodeEvent', 'Event', res => {
      this.setState({
        qrCode: res.isOpen,
        item: res.item,
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
      self.setState({
        itemScanSerialNo: self.state.itemScanSerialNo + 1,
      });
      Events.trigger('restock-serial-scan', result);
    }
  }

  render() {
    const {qrCode, itemScanSerialNo} = this.state;
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
                  <View style={styles.rectangleContainer}>
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
                }
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default ComponentRestockRequestWithQRCode;
