// LIBRARIES
import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  BackHandler,
  StatusBar,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  AsyncStorage,
  Alert,
} from 'react-native';
import {changePasswordEndPoint} from '../../config/api-endpoint';
import {Color, Matrics} from '../../common/styles';
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import APICaller from '../../utils/api-caller';
import {TextInputView, SpinnerView, Header} from '../../common/components';

class ChangePassword extends Component {
  state = {
    loadingData: false,
    UserName: null,
    nPassword: null,
    oPassword: null,
    oPasswordSecure: true,
    nPasswordSecure: true,
  };

  componentDidMount() {
    AsyncStorage.getItem('userInfo').then(res => {
      if (res) {
        const result = JSON.parse(res);
        if (result) {
          const {UserName} = result;
          this.setState({UserName});
        }
      }
    });
  }

  // CHECK FOR API RESPONSE
  ChangePasswordAPI(oldPassword, newPassword) {
    if (this.state.userName === null) {
      this.setState({userNameError: 'In valid Username'});
      return;
    }
    if (!oldPassword) {
      this.setState({userNameError: 'Please enter old password'});
      return;
    }
    if (!newPassword) {
      this.setState({userNameError: 'Please enter new password'});
      return;
    }

    this.setState({
      loadingData: true,
      userNameError: null,
    });
    APICaller(
      changePasswordEndPoint(this.state.UserName, oldPassword, newPassword),
      'GET',
    ).then(json => {
      console.log(json, '**********');
      if (json.status !== 200) {
        this.setState({
          loadingData: false,
        });
        Alert.alert('Alert', `Something went to wrong - ${json.status}`);
      }
      if (json.data.Success === '1') {
        Alert.alert('Alert', 'Successfully password updated.');
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
  oldPassword(value) {
    this.password = value;
    this.setState({oPassword: value, passwordError: null});
  }
  nPassword() {
    this.setState({nPassword: value, passwordError: null});
  }

  passwordVisible(type) {
    this.setState({
      [type]: !this.state[type],
    });
  }

  // ----------->>>Render Method-------------->>>
  render() {
    const {nPassword, oPassword} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header title={'Change Password'} left="menu" />
        <KeyboardAvoidingView style={{flex: 1}}>
          <View style={styles.container}>
            <View style={styles.textBoxView}>
              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="Old Password"
                  placeholderTextColor={'#ccc'}
                  labelIcon={
                    <MIcon
                      name="lock-outline"
                      size={22}
                      color={Color.lightGray}
                    />
                  }
                  onChangeText={value => this.oldPassword(value)}
                  value={this.state.password}
                  secureTextEntry={this.state.oPasswordSecure}
                />
                <TouchableOpacity
                  style={styles.passwordVisible}
                  onPress={() => this.passwordVisible('oPasswordSecure')}>
                  <McIcon
                    name={this.state.passwordSecure ? 'eye' : 'eye-off'}
                    size={22}
                    color={Color.lightGray}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.subTextBoxView}>
                <TextInputView
                  placeholder="New Password"
                  placeholderTextColor={'#ccc'}
                  labelIcon={
                    <MIcon
                      name="lock-outline"
                      size={22}
                      color={Color.lightGray}
                    />
                  }
                  onChangeText={value => this.setState({nPassword: value})}
                  value={this.state.password}
                  secureTextEntry={this.state.nPasswordSecure}
                />
                <TouchableOpacity
                  style={styles.passwordVisible}
                  onPress={() => this.passwordVisible('nPasswordSecure')}>
                  <McIcon
                    name={this.state.passwordSecure ? 'eye' : 'eye-off'}
                    size={22}
                    color={Color.lightGray}
                  />
                </TouchableOpacity>
              </View>
              {this.state.userNameError ? (
                <View style={styles.errorView}>
                  <Text style={styles.errorText}>
                    {this.state.userNameError}
                  </Text>
                </View>
              ) : null}
              <View style={styles.loginView}>
                {this.state.loadingData ? (
                  <View style={styles.spinnerView}>
                    <SpinnerView />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.touchableLogin}
                    onPress={() =>
                      this.ChangePasswordAPI(oPassword, nPassword)
                    }>
                    <Text style={styles.loginText}>Update</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

export default ChangePassword;

//= =====STYLES DECLARATION======//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  txtStyle2: {
    color: Color.darkGrey,
    textAlign: 'center',
    fontSize: Matrics.ScaleValue(17),
  },
  txtStyle3: {
    color: Color.darkGrey,
    fontSize: Matrics.ScaleValue(14),
    alignSelf: 'center',
    marginLeft: Matrics.ScaleValue(5),
  },
  txtStyle4: {
    color: Color.darkGrey,
    fontSize: Matrics.ScaleValue(14),
    alignSelf: 'center',
  },
  txtStyle5: {
    fontSize: Matrics.ScaleValue(15),
    color: Color.darkGrey,
  },
  txtStyle6: {
    fontSize: Matrics.ScaleValue(15),
    color: Color.orangish,
  },
  checkboxStyle: {
    color: Color.white,
    backgroundColor: Color.darkGrey,
    borderColor: Color.darkGrey,
    borderRadius: Matrics.ScaleValue(2),
  },
  imageStyle: {
    alignSelf: 'center',
  },
  txtfieldStyle: {
    paddingTop: Matrics.ScaleValue(9),
  },
  backgroundImageStyle: {
    width: '100%',
    height: Matrics.ScaleValue(55),
    justifyContent: 'center',
  },
  remberpwdView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loginText: {
    color: Color.white,
    fontSize: Matrics.ScaleValue(18),
    fontWeight: 'bold',
  },
  fbLoginText: {
    color: Color.darkGrey,
    fontSize: Matrics.ScaleValue(18),
    fontWeight: 'bold',
  },
  signupLinkText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Matrics.ScaleValue(14),
  },
  textBoxView: {flex: 1, justifyContent: 'flex-start', alignItems: 'center'},
  subTextBoxView: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
  },
  subRadioBoxView: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  floatingView: {
    margin: 10,
    backgroundColor: Color.primary,
    borderRadius: 25,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotRememberView: {
    flexDirection: 'row',
    height: 20,
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 5,
  },
  rememberView: {
    flexDirection: 'row',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginView: {height: 40, width: '60%', marginTop: 15, alignItems: 'center'},
  touchableLogin: {
    backgroundColor: '#393184',
    width: 120,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  dontAccountView: {flex: 1, flexDirection: 'row', marginTop: 5},
  touchDontAccount: {justifyContent: 'center', flexDirection: 'row'},
  dontAccText: {color: '#000', fontSize: 14},
  createAccText: {color: '#393184', fontSize: 14},
  lastLineScreen: {
    height: 30,
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e5e5e5',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  errorView: {
    height: 15,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'flex-start',
    width: '80%',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
  },
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  passwordVisible: {
    marginRight: 5,
    position: 'absolute',
    right: 0,
    marginTop: 15,
  },
});
