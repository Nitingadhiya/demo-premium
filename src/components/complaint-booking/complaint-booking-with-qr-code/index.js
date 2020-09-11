import React, {Component} from 'react';
import {Text, View, Modal, Alert} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import styles from './styles';
import Helper from '../../../utils/helper';
import Events from '../../../utils/events';

let tmpSys = [];
let self;
class ComplaintBookingWithQRCode extends Component {
  state = {
    qrCode: false,
    item: null,
  };

  componentDidMount() {
    self = this;
    Events.on('ComplaintBookingWithQRCodeEvent', 'Event', res => {
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

      self.props.scanQrCode(result);
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
export default ComplaintBookingWithQRCode;
