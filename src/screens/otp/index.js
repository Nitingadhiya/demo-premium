import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Alert,
  Platform,
  Keyboard,
} from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import CodeInput from 'react-native-confirmation-code-input';
import APICaller from '../../utils/api-caller';
import {
  validateOtpEndPoint,
  resendOTPEndPoint,
} from '../../config/api-endpoint';
import {Header, SpinnerView} from '../../common/components';
import styles from './styles';
import {Color, Matrics} from '../../common/styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';
import {TouchableOpacity} from 'react-native';
import {MIcon} from '../../common/assets/vector-icon';
import Spinner from 'react-native-spinkit';

class OTPScreen extends Component {
  state = {
    mobileNo: null,
    loading: false,
  };
  componentDidMount() {
    const {params} = this.props.route;
    if (params && params.mobileNo) {
      this.setState({
        mobileNo: params.mobileNo,
      });
    }
    Events.on('OTP', 'receive', res => {
      this.onFinishCheckingCode(res);
    });
    if (Platform.OS === 'android') {
      this.getHash();
      this.startListeningForOtp();
    }
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
    const otp = /(\d{6})/g.exec(message)[1];
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
          NavigationHelper.reset(this.props.navigation, 'UserNavigation');
          // Events.trigger('refreshMenu');
          // Events.trigger('appRouteRefresh', userInfo);
          // this.props.navigation.navigate('Home');
        } else {
          Alert.alert('Failed', json.data.Message);
          this.setState({
            loginError: json.data.Message,
          });
        }
      },
    );
  }

  loadingView(loading) {
    this.setState({loading});
  }

  resendOTP = () => {
    this.loadingView(true);
    const {mobileNo} = this.state;
    APICaller(resendOTPEndPoint(mobileNo), 'GET').then(json => {
      this.loadingView(false);
      if (Helper.responseSuccess(json)) {
        console.log('Successfully');
      } else if (Helper.responseInvalid(json)) {
        const message = _.get(json, 'data.Message', '');
        Alert.alert('Failed', message || 'Something went to wrong');
      }
    });
  };

  renderResendOTP = () => {
    return (
      <View style={styles.resendOTPView}>
        <TouchableOpacity
          style={styles.smsResendTouch}
          onPress={() => this.resendOTP()}>
          <MIcon
            name="sms"
            size={Matrics.ScaleValue(18)}
            color={Color.primary}
          />
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderSpinner = () => {
    const {loading} = this.state;
    if (!loading) return;
    return <SpinnerView color={Color.primary} />;
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header title="Verify otp" left="back" />
        {this.renderSpinner()}
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
        {this.renderResendOTP()}
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
