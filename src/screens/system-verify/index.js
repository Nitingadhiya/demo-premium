// LIBRARIES
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  Dimensions,
  Modal,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import QRCodeScanner from 'react-native-qrcode-scanner';
// import * as Animatable from 'react-native-animatable';

import _ from 'lodash';
// ASSETS
import CodeInput from 'react-native-confirmation-code-input';
import { Color, Matrics } from '../../common/styles';
import APICaller from '../../utils/api-caller';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import { Header, SpinnerView } from '../../common/components';
import SystemVerifyWithQRCode from '../../components/system-verify-qr-code';
import NavigationHelper from '../../utils/navigation-helper';

/** ******* QR code ********** */
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const overlayColor = 'rgba(0,0,0,0.5)'; // this gives us a black color with a 50% transparency

const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = '#fff';

const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; // this is equivalent to 1 from a 393 device width
const scanBarColor = 'red';

const Codelength = Dimensions.get('window').width / 6;

export class SystemVerify extends Component {
  state = {
    loadingData: false,
    cartListArr: [],
    qrCode: false,
    validateError: null,
    systemOTP: false,
    cameraOpen: false,
    imageData: null,
    userInfo: null,
  };
  // ------------>>>LifeCycle Methods------------->>>

  componentDidMount() {
    this.getUserInfo();
    Events.on('system-verify-event', 'systemTag', result => {
      this.qrcodeVerify(result);
    });
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });
  }

  // onSuccess(e) {
  //   if (e.data) {
  //     const url = e.data;
  //     this.setState({ qrCode: false });
  //     const result = url.replace(/(^\w+:|^)\/\//, '');
  //     this.qrcodeVerify(result);
  //   }
  // }

  makeSlideOutTranslation(translationType, fromValue) {
    return {
      from: {
        [translationType]: SCREEN_WIDTH * -0.18,
      },
      to: {
        [translationType]: fromValue,
      },
    };
  }

  qrcodeVerify(result) {
    //console.log(result);
    this.setState({
      loadingData: true,
    });
    this.sysyemCode = result;
    const endPoint = `SystemOTP?SystemTag=${result}`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      if (json.data.Success === '1') {
        this.setState({
          cameraOpen: true,
          qrCode: false,
          loadingData: false,
        });
        setTimeout(() => {
          this.openCameraModal();
        }, 100);
      } else {
        this.setState({
          validateError: 'Please scan right Qr-code, try again.',
          cameraOpen: false,
          loadingData: false,
        });
      }
    });
  }

  openCameraModal() {
    //  setTimeout(()=> { },1000)
    ImagePicker.openCamera({
      width: 150,
      height: 150,
      //cropping: true,
      includeBase64: true,
      mediaType: 'photo',
      useFrontCamera: false,
      compressImageQuality: 0.4,
      //cropperCircleOverlay: true,
    }).then(image => {
      this.setState({
        systemOTP: true,
        imageData: image.path,
        cameraOpen: false,
      });
      // this.setState({ modalVisible: !this.state.modalVisible });
      this.media = {
        uri: image.path,
        type: image.mime,
        name: this.state.UserName + '.jpg',
        data: image.data,
      };
    });
  }

  onFinishCheckingCode(valid) {
    this.setState({ loadingData: true });
    const endPoint = `UploadVerifyImage`;
    const formData = {
      FileContents: this.media.data,
      FileName: `${this.sysyemCode}_Verify.jpg`,
      OTP: valid,
    };

    APICaller(`${endPoint}`, 'POST', JSON.stringify(formData)).then(json => {
      this.setState({ loadingData: false });
      if (json.data.Success === 1 || json.data.Success === '1') {
        NavigationHelper.navigate(this.props.navigation, 'Dashboard');
      } else {
        Alert.alert('Failed', json.data.Message);
      }
    });
  }

  render() {
    const { loadingData, cameraOpen, validateError } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="System Verify" left="menu" />
        {loadingData ? (
          <View style={styles.spinnerView}>
            <SpinnerView />
          </View>
        ) : null}
        {/* {!cameraOpen && !loadingData ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{marginBottom: 10, fontSize: 14, fontWeight: 'bold'}}>
              {validateError}
            </Text>
            <TouchableOpacity
              onPress={() => Events.trigger('qrCode', 'open again')}
              style={{
                borderRadius: 5,
                paddingHorizontal: 10,
                height: 45,
                backgroundColor: Color.primary,
                justifyContent: 'center',
              }}>
              <Text style={{color: '#fff', fontSize: 14}}>
                Retry, Scan QR-Code
              </Text>
            </TouchableOpacity>
          </View>
        ) : null} */}
        <View style={{ flex: 1 }}>
          {this.state.systemOTP && !loadingData ? (
            <View
              style={{
                height: Dimensions.get('window').height - 50,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <Image
                source={{ uri: this.state.imageData }}
                style={{ height: 150, width: 150 }}
              />
              <CodeInput
                ref="codeInputRef2"
                keyboardType="numeric"
                codeLength={4}
                activeColor="rgba(57,49,132, 1)"
                inactiveColor="rgba(57,49,132, 0.5)"
                autoFocus
                ignoreCase
                inputPosition="center"
                size={Codelength}
                onFulfill={isValid => this.onFinishCheckingCode(isValid)}
                containerStyle={{
                  marginTop: 10,
                }}
                codeInputStyle={{ borderWidth: 1.5 }}
              />
            </View>
          ) : null}
        </View>
        <SystemVerifyWithQRCode userInfo={userInfo} />

        <Text style={{ marginBottom: 10, fontSize: 14, fontWeight: 'bold' }}>
          {validateError}
        </Text>
        <TouchableOpacity
          onPress={() => Events.trigger('qrCode', 'open again')}
          style={{
            paddingHorizontal: 10,
            height: 45,
            backgroundColor: Color.primary,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ color: '#fff', fontSize: 14 }}>Retry, Scan QR-Code</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

//= =====STYLES DECLARATION======//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  textStyle2: {
    fontSize: Matrics.ScaleValue(14),
    color: Color.lightGray,
    justifyContent: 'flex-end',
  },
  UserImage: {
    height: Matrics.ScaleValue(50),
    width: Matrics.ScaleValue(50),
    borderRadius: Matrics.ScaleValue(50 / 2),
  },
  textStyle: {
    fontSize: Matrics.ScaleValue(16),
    fontWeight: 'bold',
    color: Color.black,
    flex: 1,
  },
  textStyle1: {
    fontSize: Matrics.ScaleValue(13),
    color: Color.lightGray,
  },
  textinputViewStyle: {
    flexDirection: 'row',
    backgroundColor: Color.white,
    borderColor: Color.black,
    height: Matrics.ScaleValue(50),
    justifyContent: 'space-between',
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.75,
    shadowRadius: 15,
    elevation: 1,
  },
  userDetailView: {
    justifyContent: 'space-around',
    flex: 3,
    marginLeft: Matrics.ScaleValue(10),
  },
  imageViewSetting: {
    paddingVertical: Matrics.ScaleValue(6),
    paddingHorizontal: Matrics.ScaleValue(12),
  },
  messageView: {
    borderBottomColor: Color.silver,
    borderBottomWidth: 1,
    marginTop: Matrics.ScaleValue(5),
  },
  flatView: {
    padding: Matrics.ScaleValue(10),
    paddingRight: Matrics.ScaleValue(0),
  },
  textinputStyle: {
    marginLeft: Matrics.ScaleValue(20),
    fontSize: Matrics.ScaleValue(15),
    flex: 1,
  },
  sendIconStyle: {
    alignSelf: 'center',
    marginRight: Matrics.ScaleValue(15),
  },
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    top: '45%',
  },
  checkout: {
    height: 45,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primary,
    flexDirection: 'row',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
  },

  centerText: { fontSize: 18, textAlign: 'center', color: '#fff' },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: rectDimensions,
    width: rectDimensions,
    borderWidth: rectBorderWidth,
    borderColor: rectBorderColor,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  topOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    paddingBottom: SCREEN_WIDTH * 0.25,
  },

  leftAndRightOverlay: {
    height: SCREEN_WIDTH * 0.65,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
  },
  scanBar: {
    width: scanBarWidth,
    height: scanBarHeight,
    backgroundColor: scanBarColor,
  },
});

export default SystemVerify;
