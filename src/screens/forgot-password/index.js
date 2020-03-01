import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import {Appbar} from 'react-native-paper';
import RNOtpVerify from 'react-native-otp-verify';
import CodeInput from 'react-native-confirmation-code-input';
import APICaller from '../../utils/api-caller';
import {
  validateOtpEndPoint,
  forgotPasswordendPoint,
} from '../../config/api-endpoint';
import styles from './styles';
import {Matrics, Color} from '../../common/styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';
import {TextInputView, Header, SpinnerView} from '../../common/components';
import {MIcon} from '../../common/assets/vector-icon';

class ForgotPassword extends Component {
  state = {
    userName: null,
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
          NavigationHelper.reset(this.props.navigation, 'FeedList');
          // Events.trigger('refreshMenu');
          // Events.trigger('appRouteRefresh', userInfo);
          // this.props.navigation.navigate('Home');
        } else {
          NavigationHelper.reset(this.props.navigation, 'FeedList');
          Alert.alert('Failed', json.data.Message);
          this.setState({
            loginError: json.data.Message,
          });
        }
      },
    );
  }

  forgotPasswordMethod() {
    if (this.state.userName === null) {
      this.setState({userNameError: 'Please enter username'});
      return;
    }
    if (this.state.userName < 4) {
      this.setState({userNameError: 'Please enter correct username'});
      return;
    }
    this.setState({
      loadingData: true,
    });

    APICaller(forgotPasswordendPoint(this.state.userName), 'GET').then(json => {
      if (json.data.Success === '1') {
        NavigationHelper.navigate(this.props.navigation, 'Login');
        Alert.alert('Alert', json.data.Message);
      } else {
        this.setState({
          userNameError: json.data.Message || 'something went to wrong',
        });
      }
      this.setState({
        loadingData: false,
      });
    });
  }

  render() {
    const {userName, userNameError, loadingData} = this.state;

    return (
      <SafeAreaView style={{flex: 1}}>
        <Header title={'Forgot Password'} left="back" />
        <KeyboardAvoidingView style={{flex: 1}}>
          <View style={styles.container}>
            <View style={styles.textBoxView}>
              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="Mobile No / Username"
                  labelIcon={
                    <MIcon name="person" size={22} color={Color.lightGray} />
                  }
                  value={userName}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={value =>
                    this.setState({userName: value, userNameError: null})
                  }
                />
              </View>
              {userNameError ? (
                <View style={styles.errorView}>
                  <Text style={styles.errorText}>{userNameError}</Text>
                </View>
              ) : null}
              <View style={styles.loginView}>
                {loadingData ? (
                  <SpinnerView />
                ) : (
                  <TouchableOpacity
                    style={styles.touchableLogin}
                    onPress={() => this.forgotPasswordMethod()}>
                    <Text style={styles.loginText}>Send</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
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
export default ForgotPassword;
