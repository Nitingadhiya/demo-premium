import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Modal, Alert} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import styles from './styles';
import Events from '../../utils/events';

let self;
class ComponentRestockRequestWithQRCode extends Component {
  state = {
    qrCode: false,
    item: null,
    itemScanSerialNo: 0,
    errorMessage: null,
  };

  componentDidMount() {
    self = this;
    Events.on('component-restock-request-with-QRCodeEvent', 'Event', res => {
      this.setState({
        qrCode: res.isOpen,
        item: res.item,
      });
    });
    Events.on('restock-serial-no-added', 'Event', res => {
      self.setState({
        itemScanSerialNo: res,
        errorMessage: null,
      });
    });
    Events.on('restock-serial-no-added-error', 'Event', res => {
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
      // self.setState({
      //   itemScanSerialNo: self.state.itemScanSerialNo + 1,
      // });
      Events.trigger('restock-serial-scan', result);
    } else {
      self.setState({
        errorMessage: 'No data found!!',
      });
    }
  }

  render() {
    const {qrCode, itemScanSerialNo, errorMessage} = this.state;
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
export default ComponentRestockRequestWithQRCode;
