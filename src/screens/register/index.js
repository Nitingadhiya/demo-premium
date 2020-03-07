import React, {Component} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  View,
  Text,
  KeyboardAvoidingView,
  Alert,
  Picker,
} from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import CityListModal from '../../components/city-list-modal';
import {MIcon, McIcon, FIcon} from '../../common/assets/vector-icon';
import APICaller from '../../utils/api-caller';
import styles from './styles';
import {userRegistrationEndPoint} from '../../config/api-endpoint';
import {TextInputView, SpinnerView, Header} from '../../common/components';
import {Color} from '../../common/styles';
import NavigationHelper from '../../utils/navigation-helper';

const radio_props = [
  {label: 'Male', value: 'Male'},
  {label: 'Female', value: 'Female'},
];
class Register extends Component {
  state = {
    registerForm: {
      firstName: null,
      lastName: null,
      email: null,
      mobileNo: null,
      gender: 'Male',
      password: null,
      cityList: [],
      selectedCity: '',
      cityText: null,
      businessType: 'B',
      pincode: '',
    },
    passwordSecure: true,
    cPasswordSecure: true,
    addressModalVisible: false,
    error: {
      firstName: null,
      lastName: null,
      email: null,
      mobileNo: null,
      password: null,
      mobileNo: null,
    },
    loadingData: false,
    modalType: null,
  };

  changeTexInputValue(type, value) {
    this.setState(prevState => {
      let registerForm = Object.assign({}, prevState.registerForm);
      registerForm[type] = value;
      return {registerForm};
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

  first3Words = strings => {
    return strings.substring(0, 3);
  };

  last3Words = strings => {
    //str.substring(0,3); first 3 char
    return strings.substr(strings.length - 3);
  };

  createUsername(firstName, lastName, mobile) {
    this.genrateUserName =
      this.first3Words(firstName) +
      this.first3Words(lastName) +
      this.last3Words(mobile);
  }

  resetFormState() {
    this.setState(prevState => {
      let error = Object.keys(prevState.error);
      error.map(err => (error[err] = null));
      return {error};
    });
  }

  signupWithCredentials() {
    const {
      firstName,
      lastName,
      email,
      mobileNo,
      password,
      cityText,
      gender,
      businessType,
      pincode,
    } = this.state.registerForm;

    // Reset Validation error
    this.resetFormState();

    // Check validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !mobileNo ||
      !password ||
      !cityText ||
      !pincode ||
      !businessType
    ) {
      this.setState(prevState => {
        let error = Object.assign({}, prevState.error);
        if (!firstName) error.firstName = 'Please enter first name';
        if (firstName && firstName.length < 3)
          error.firstName = 'Please enter minimum 3 characters';
        if (!lastName) error.lastName = 'Please enter last name';
        if (lastName && lastName.length < 3)
          error.lastName = 'Please enter minimum 3 characters';
        if (!email) error.email = 'Please enter email number';
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email && reg.test(email) === false) {
          error.email = 'Please enter correct email';
          return;
        }
        if (!mobileNo) error.mobileNo = 'Please enter mobile number';
        if (mobileNo && mobileNo.length < 9)
          error.mobileNo = 'Please enter mobile number';
        if (!password) error.password = 'Please enter password';
        if (!cityText) error.cityText = 'Please enter city';
        if (!pincode) error.pincode = 'Please enter pincode';
        if (!businessType) error.businessType = 'Please select Usage type';
        return {error};
      });
      return;
    }

    // Create Username
    this.createUsername(firstName, lastName, mobileNo);

    this.setState({
      loadingData: true,
    });

    const body = {
      An_Master_Users: [
        {
          UserName: this.genrateUserName, //this.state.userName,
          FirstName: firstName,
          LastName: lastName,
          Password: password,
          Gender: gender,
          MobileNo1: mobileNo,
          EmailId: email,
          City: cityText,
          Pincode: pincode,
          BusinessType: businessType,
        },
      ],
    };
    console.log(body, 'body');
    return;
    if (!this.genrateUserName) return;
    APICaller(userRegistrationEndPoint, 'POST', JSON.stringify(body)).then(
      json => {
        if (json.data.Success === '0' || json.data.Success === 0) {
          Alert.alert('Alert', json.data.Message);
        }
        this.setState({
          loadingData: false,
        });
        if (json.data.Success === '1') {
          NavigationHelper.navigate(this.props.navigation, 'OTPScreen');
        }
      },
    );
  }

  render() {
    const {
      registerForm,
      passwordSecure,
      addressModalVisible,
      modalType,
      loadingData,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Register" left="back" />
        <KeyboardAvoidingView
          style={{flex: 1}}
          keyboardShouldPersistTaps={'handled'}
          enableAutomaticScroll>
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.textBoxView}>
                <View style={styles.subTextBoxView}>
                  <TextInputView
                    placeholder="First name"
                    labelIcon={
                      <MIcon name="person" size={22} color={Color.lightGray} />
                    }
                    value={registerForm.firstName}
                    autoCorrect={false}
                    onChangeText={value =>
                      this.changeTexInputValue('firstName', value)
                    }
                    blurOnSubmit={false}
                  />
                </View>
                {this.errorView('firstName')}
                <View style={styles.subTextBoxView}>
                  <TextInputView
                    placeholder="Last name"
                    labelIcon={
                      <MIcon name="person" size={22} color={Color.lightGray} />
                    }
                    value={registerForm.lastName}
                    autoCorrect={false}
                    onChangeText={value =>
                      this.changeTexInputValue('lastName', value)
                    }
                    blurOnSubmit={false}
                  />
                </View>
                {this.errorView('lastName')}

                <View style={styles.subTextBoxView}>
                  <TextInputView
                    placeholder="Email"
                    labelIcon={
                      <McIcon
                        name="email-outline"
                        size={22}
                        color={Color.lightGray}
                      />
                    }
                    value={registerForm.email}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    onChangeText={value =>
                      this.changeTexInputValue('email', value)
                    }
                  />
                </View>
                {this.errorView('email')}

                <View style={styles.subRadioBoxView}>
                  <FIcon name="female" size={18} color={Color.lightGray} />
                  <FIcon
                    name="male"
                    size={18}
                    color={Color.lightGray}
                    style={{marginRight: 8}}
                  />
                  {/* {!addressModalVisible ? ( */}
                  <RadioForm
                    radio_props={radio_props}
                    formHorizontal
                    buttonColor={Color.primary}
                    selectedButtonColor={Color.primary}
                    buttonSize={14}
                    animation
                    initial={0}
                    labelStyle={{marginRight: 10}}
                    onPress={value => this.changeTexInputValue('gender', value)}
                  />
                  {/* ) : null} */}
                </View>

                <View style={styles.subTextBoxView}>
                  <TextInputView
                    placeholder="Mobile no"
                    labelIcon={
                      <MIcon name="call" size={22} color={Color.lightGray} />
                    }
                    value={this.state.mobileNo}
                    keyboardType="phone-pad"
                    maxLength={10}
                    onChangeText={value =>
                      this.changeTexInputValue('mobileNo', value)
                    }
                  />
                </View>
                {this.errorView('mobileNo')}

                <View style={styles.subTextBoxView}>
                  <TextInputView
                    placeholder="Password"
                    labelIcon={
                      <McIcon
                        name="lock-outline"
                        size={22}
                        color={Color.lightGray}
                      />
                    }
                    value={registerForm.password}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={passwordSecure}
                    onChangeText={value =>
                      this.changeTexInputValue('password', value)
                    }
                  />
                  <TouchableOpacity
                    style={styles.passwordVisible}
                    onPress={() => this.passwordVisible()}>
                    <McIcon
                      name={passwordSecure ? 'eye' : 'eye-off'}
                      size={22}
                      color={Color.lightGray}
                    />
                  </TouchableOpacity>
                </View>
                {this.errorView('password')}

                <TouchableOpacity
                  style={styles.cityList}
                  onPress={() =>
                    this.setState({
                      addressModalVisible: true,
                      modalType: 'City',
                    })
                  }>
                  <Text style={{color: '#000', fontSize: 14}}>
                    {registerForm.cityText || 'City'}
                  </Text>

                  <MIcon
                    name="keyboard-arrow-down"
                    color={'black'}
                    size={25}
                    style={{right: 0}}
                  />
                </TouchableOpacity>
                {this.errorView('cityText')}
                <View style={styles.subTextBoxView}>
                  <TextInputView
                    placeholder="Pincode"
                    value={this.state.pincode}
                    labelIcon={
                      <McIcon name="pin" size={22} color={Color.lightGray} />
                    }
                    autoCorrect={false}
                    onChangeText={value =>
                      this.changeTexInputValue('pincode', value)
                    }
                    blurOnSubmit={false}
                    customStyle={styles.customStyle}
                  />
                </View>
                {this.errorView('pincode')}
                <Picker
                  selectedValue={this.state.registerForm.businessType}
                  style={styles.cityList}
                  onValueChange={(itemValue, itemIndex) => {
                    console.log(itemValue, 'value');
                    this.changeTexInputValue('businessType', itemValue);
                  }}>
                  <Picker.Item label="Business Use" value="B" />
                  <Picker.Item label="Home Use" value="H" />
                </Picker>
                <View
                  style={{
                    width: '80%',
                    borderBottomWidth: 1,
                    borderBottomColor: '#d3d3d3',
                  }}
                />
                {this.errorView('businessType')}

                <View style={styles.loginView}>
                  {loadingData ? (
                    <SpinnerView />
                  ) : (
                    <TouchableOpacity
                      style={styles.touchableLogin}
                      onPress={() => this.signupWithCredentials()}>
                      <Text style={styles.loginText}>Signup</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.extraBottomSpace} />
          </ScrollView>
        </KeyboardAvoidingView>
        {addressModalVisible ? (
          <CityListModal
            searchPlaceholderText="Search city here"
            closeModalPress={value => {
              this.setState(prevState => {
                let registerForm = Object.assign({}, prevState.registerForm);
                registerForm.cityText = value;
                return {registerForm};
              });
              this.setState({addressModalVisible: false});
            }}
          />
        ) : null}
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
export default Register;
