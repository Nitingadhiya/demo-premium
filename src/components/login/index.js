import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {TextInputView, SpinnerView} from '../../common/components';
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import {Color} from '../../common/styles';
import styles from './styles';
import Helper from '../../utils/helper';
import APICaller from '../../utils/api-caller';
import {userLoginEndPoint} from '../../config/api-endpoint';
import Events from '../../utils/events';
import NavigationHelper from '../../utils/navigation-helper';

class LoginComponent extends Component {
  static navigationOptions = () => ({
    header: null,
  });
  state = {
    sliderImage: null,
    loginForm: {
      email: null,
      password: null,
    },
    passwordSecure: true,
    error: {
      email: null,
      password: null,
      formError: null,
    },
    rememberme: false,
  };

  async componentDidMount() {
    const loginForm = await Helper.getLocalStorageItem('userCredentials');
    if (loginForm) {
      this.setState({
        loginForm,
        rememberme: loginForm.email,
      });
    }
  }

  changeTexInputValue(type, value) {
    this.setState(prevState => {
      let loginForm = Object.assign({}, prevState.loginForm);
      loginForm[type] = value;
      return {loginForm};
    });
  }

  passwordVisible() {
    if (this.state.passwordSecure) {
      this.setState({password: null, passwordSecure: false});
      setTimeout(() => {
        this.setState({password: this.password});
      }, 10);
    } else {
      this.setState({password: null, passwordSecure: true});
      setTimeout(() => {
        this.setState({password: this.password});
      }, 10);
    }
  }

  resetFormState() {
    this.setState(prevState => {
      let error = Object.keys(prevState.error);
      error.map(err => (error[err] = null));
      return {error};
    });
  }

  loginWithCredentials() {
    const {rememberme, loginForm, error} = this.state;
    const {email, password} = loginForm;
    this.resetFormState();

    // Check validation
    if (!email || !password) {
      this.setState(prevState => {
        let error = Object.assign({}, prevState.error);
        if (!email) error.email = 'Please enter mobile number';
        if (!password) error.password = 'Please enter password';
        return {error};
      });
      return;
    }
    this.setState({loadingData: true});
    // Remember me
    if (rememberme) {
      Helper.setLocalStorageItem('userCredentials', loginForm);
    }

    // User Login API
    APICaller(userLoginEndPoint(email, password), 'GET').then(async json => {
      this.setState({loadingData: false});
      if (json.data.Success === '1') {
        const userInfo = json.data.Response;
        global.userInfo = userInfo;
        Events.trigger('userInfo-drawer', userInfo);
        await Helper.setLocalStorageItem('userInfo', userInfo);
        // global.LoginType = userInfo.LoginType;
        NavigationHelper.reset(this.props.navigation, 'UserNavigation');
      } else {
        const message = json.data.Message;
        this.setState(prevState => {
          let error = Object.assign({}, prevState.formError);
          error.formError = message;
          return {error};
        });
      }
    });
  }

  errorView = value => {
    if (!this.state.error[value]) return;
    return (
      <View style={styles.errorView}>
        <Text style={styles.errorText}>{this.state.error[value]}</Text>
      </View>
    );
  };

  render() {
    const {loginForm, passwordSecure, rememberme} = this.state;
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.textBoxView}>
          <View style={styles.subTextBoxView}>
            <TextInputView
              placeholder="Mobile Number"
              labelIcon={
                <McIcon
                  name="email-outline"
                  size={22}
                  color={Color.lightGray}
                />
              }
              onChangeText={value => this.changeTexInputValue('email', value)}
              value={loginForm.email}
            />
          </View>
          {this.errorView('email')}
          <View style={styles.subTextBoxView}>
            <TextInputView
              placeholder="Password"
              labelIcon={
                <McIcon name="lock-outline" size={22} color={Color.lightGray} />
              }
              onChangeText={value =>
                this.changeTexInputValue('password', value)
              }
              value={loginForm.password}
              secureTextEntry={passwordSecure}
            />
            <TouchableOpacity
              style={styles.passwordVisible}
              onPress={() => this.passwordVisible()}>
              <McIcon
                name={this.state.passwordSecure ? 'eye' : 'eye-off'}
                size={22}
                color={Color.lightGray}
              />
            </TouchableOpacity>
          </View>
          {this.errorView('password')}
          <View style={styles.forgotRememberView}>
            <TouchableOpacity
              style={styles.rememberView}
              activeOpacity={1}
              onPress={() =>
                this.setState({rememberme: !this.state.rememberme})
              }>
              <MIcon
                name={`${rememberme ? 'check-box' : 'check-box-outline-blank'}`}
                size={20}
                color={Color.primary}
              />
              <Text style={{marginLeft: 2}}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rememberView}
              onPress={() =>
                NavigationHelper.navigate(navigation, 'ForgotPassword')
              }>
              <Text>Forgot password?</Text>
            </TouchableOpacity>
          </View>
          {this.errorView('formError')}
          <View style={styles.loginView}>
            {this.state.loadingData ? (
              <SpinnerView />
            ) : (
              <TouchableOpacity
                style={styles.touchableLogin}
                onPress={() => this.loginWithCredentials()}>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.dontAccountView}>
            <TouchableOpacity
              style={styles.touchDontAccount}
              onPress={() => NavigationHelper.navigate(navigation, 'Register')}>
              <Text style={styles.dontAccText}>Don't have an Account?</Text>
              <Text style={styles.createAccText}> Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
export default LoginComponent;
