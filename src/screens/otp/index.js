import React, {Component} from 'react';
import {SafeAreaView, View, Text, Alert} from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import CodeInput from 'react-native-confirmation-code-input';
import APICaller from '../../utils/api-caller';
import {validateOtpEndPoint} from '../../config/api-endpoint';
import {Header} from '../../common/components';
import styles from './styles';
import {Matrics} from '../../common/styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';

class OTPScreen extends Component {
  state = {
    mobileNo: null,
  };
  componentDidMount() {
    const {route} = this.props;
    console.log(route);
    if (route.params) {
      this.setState({
        mobileNo: route.params.mobileNo,
      });
    }
    Events.on('OTP', 'receive', res => {
      this.onFinishCheckingCode(res);
    });
  }

  getHash = () =>
    RNOtpVerify.getHash()
      .then(console.log)
      .catch(console.log);

  startListeningForOtp = () =>
    RNOtpVerify.getOtp()
      .then(p => RNOtpVerify.addListener(this.otpHandler))
      .catch(p => console.log(p));

  otpHandler = message => {
    console.log(message, 'msg');
    const otp = /(\d{6})/g.exec(message)[1];
    console.log(otp, 'otp');
    this.setState({otpText: otp});
    this.onFinishCheckingCode(otp);
    // RNOtpVerify.removeListener();
    Keyboard.dismiss();
  };

  componentWillUnmount() {
    RNOtpVerify.removeListener();
  }

  onFinishCheckingCode(valid) {
    this.setState({loadingData: true});
    APICaller(validateOtpEndPoint(this.state.mobileNo, valid), 'GET').then(
      json => {
        this.setState({loadingData: false});
        if (json.data.Success === 1 || json.data.Success === '1') {
          const userInfo = json.data.Response;
          Helper.setLocalStorageItem('userInfo', userInfo);
          NavigationHelper.reset(this.props.navigation, 'Dashboard');
          // Events.trigger('refreshMenu');
          // Events.trigger('appRouteRefresh', userInfo);
          // this.props.navigation.navigate('Home');
        } else {
          NavigationHelper.reset(this.props.navigation, 'Dashboard');
          Alert.alert('Failed', json.data.Message);
          this.setState({
            loginError: json.data.Message,
          });
        }
      },
    );
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header title="Verify otp" left="back" />
        <View
          style={{
            justifyContent: 'center',
            height: Matrics.height,
            alignItems: 'center',
            flex: 1,
          }}>
          <CodeInput
            ref="codeInputRef2"
            keyboardType="numeric"
            codeLength={6}
            activeColor="rgba(57,49,132, 1)"
            inactiveColor="rgba(57,49,132, 0.5)"
            autoFocus
            ignoreCase
            inputPosition="center"
            size={Matrics.screenWidth / 8}
            onFulfill={isValid => this.onFinishCheckingCode(isValid)}
            containerStyle={{marginTop: -50, alignItems: 'center'}}
            codeInputStyle={{borderWidth: 1.5}}
          />
        </View>
        <View style={styles.lastLineScreen}>
          <Text style={styles.bottomText}>SURAT</Text>
          <Text style={styles.bottomText}>BARODA</Text>
          <Text style={styles.bottomText}>AHMEDABAD</Text>
          <Text style={styles.bottomText}>NAVSARI</Text>
        </View>
      </SafeAreaView>
    );
  }
}
export default OTPScreen;
