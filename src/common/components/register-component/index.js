import React, {Component} from 'react';
import {View} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
//import Events from "../../../util/events";
import {Matrics, Color} from '../../styles';
import {TextInputView, Button} from '..';
import Styles from './styles';
// import Helper from "../../../util/helper";
import {TermsAndCondition} from '../../../contact-types-general/general/inputs';
import RegisterObj from '../../../api/register-data';
import {registerEndPoint} from '../../../api/http';
import GlobalVar from '../../../global';
import HeroesVar from '../../../../config/heroes-config';
import {APICaller, Events, Helper} from '../../../util';
//import APICaller from "../../../util/apiCaller";
import ErrorComponent from '../error-message';
import {ErrorObj} from '../../../api/error-data';
import AsyncStorage from '@react-native-community/async-storage';
import ServerVar from '../../../../config/server-config';

class RegisterComponent extends Component {
  state = {
    satisfiedProfile: [
      {
        key: 'agree',
        label:
          'I agree that my data will be provided to companies for the purpose of finding a potential new job and I agree to be contacted by these companies',
        checked: false,
      },
    ],
    textInputRegisterArray: [
      {
        placeholder: 'First Name',
        stateName: 'first_name',
        returnKeyType: 'next',
        keyboardType: 'default',
        nextRef: 'lastName',
        multiline: false,
        phoneInput: false,
        langType: 'Register',
      },
      {
        placeholder: 'Last Name',
        stateName: 'last_name',
        returnKeyType: 'next',
        keyboardType: 'default',
        nextRef: 'phoneNumber',
        multiline: false,
        phoneInput: false,
        langType: 'Register',
      },
      {
        placeholder: 'Phone Number',
        stateName: 'phone',
        returnKeyType: 'next',
        keyboardType: 'phone-pad',
        nextRef: 'email',
        multiline: false,
        phoneInput: true,
        langType: 'Register',
      },
      {
        placeholder: 'Email Id',
        stateName: 'email',
        returnKeyType: 'done',
        keyboardType: 'email-address',
        nextRef: '',
        multiline: false,
        phoneInput: false,
        langType: 'Register',
      },
    ],
    lang: null,
    errorsMsg: null,
    buttonValidate: 'true',
  };

  componentDidMount() {
    Events.on('refreshSignup', 'refresh', data => {
      this.setState({
        lang: data,
      });
    });
    Events.on('registerValidateButton', 'refresh', data => {
      this.setState({
        buttonValidate: data,
      });
    });
  }

  textInput = (
    placeholder,
    stateName,
    returnKeyType,
    keyboardType,
    nextRef,
    value,
    multiline,
    phoneInput,
    langType,
  ) => (
    <View key={`${nextRef}_Text`}>
      <TextInputView
        placeholder={placeholder}
        placeholderTextColor={Color.silver}
        placeholderStyle={Styles.placeholderStyle}
        style={Styles.textInput}
        value={value[stateName]}
        returnKeyType={returnKeyType}
        keyboardType={keyboardType}
        maxLength={multiline ? 250 : 40}
        multiline={multiline}
        phoneInput={phoneInput}
        onSubmitEditing={() =>
          nextRef === 'Password' ? this.Password.focus() : this.Password.focus()
        }
        onChangeText={email => this.textInputChange(stateName, email)}
        Ref={r => {
          nextRef === 'Password' ? (this.Password = r) : (this.Password = r);
        }}
        langType={langType}
      />
      <ErrorComponent stateName={stateName} errorsMsg={this.state.errorsMsg} />
    </View>
  );

  /* text input change */
  textInputChange = (stateVal, value) => {
    RegisterObj[stateVal] = value;
    this.setState({[stateVal]: value});
  };

  componentRender = navigation => {
    const {textInputRegisterArray, buttonValidate} = this.state;
    return (
      <View style={{flex: 1}}>
        <View>
          {textInputRegisterArray &&
            textInputRegisterArray.map(res => {
              return this.textInput(
                res.placeholder,
                res.stateName,
                res.returnKeyType,
                res.keyboardType,
                res.nextRef,
                this.state,
                res.multiline,
                res.phoneInput,
                res.langType,
              );
            })}
          <TermsAndCondition />
        </View>
        <View
          style={{
            justifyContent: 'flex-end',
            flex: 1,
            marginTop: Matrics.ScaleValue(10),
          }}>
          <Button
            label={Helper.translation('Register.Here we go!', 'Here we go!')}
            onPress={() => this.hereWeGo(navigation)}
            disabled={buttonValidate === 'true' ? true : false}
            customStyle={{opacity: buttonValidate === 'true' ? 0.2 : 1}}
          />
        </View>
      </View>
    );
  };

  hereWeGo(navigation) {
    this.setState({
      errorsMsg: null,
    });

    Events.trigger('loading', true);
    const extraParams = {
      contact_type: ServerVar.contactType,
      country: HeroesVar.country,
      step: HeroesVar.activeStep,
    };
    const body = Object.assign({}, RegisterObj, extraParams);

    APICaller(registerEndPoint, 'POST', '', body).then(json => {
      Events.trigger('loading', false);
      if (json.status && json.status === GlobalVar.responseInvalidCode) {
        const errors = json.data.errors;
        this.setState({
          errorsMsg: errors, // set state Error message
        });
        return;
      } else if (json.status && json.status === 201) {
        Helper.customTrackEvent('ProfileStepsFinished');
        Helper.customTrackEvent('ContactSignedUp');
        if (ServerVar.contactType === 'driver') {
          Helper.customTrackEvent('DriverSignedUp');
        }
        AsyncStorage.clear();
        const response = json.data.data;
        Helper.asyncStorage('apiToken', response.api_token);
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'TabHome'})],
        });
        this.props.navigation.dispatch(resetAction);
        HeroesVar.activeStep = 1;
        //navigation.navigate("Dashboard");
      }
    });
  }

  errorFunction = json => {
    const errors = json.data.errors;
    const errArr = Object.keys(errors);

    errArr.map(res => {
      ErrorObj[res] = errors[res][0];
    });
    Events.trigger('RegisterValidate', errArr[0]);
  };

  render() {
    const {navigation} = this.props;
    return (
      <View style={{flex: 1}}>
        <View style={Styles.mainView}>{this.componentRender(navigation)}</View>
        <View style={{marginVertical: Matrics.ScaleValue(20)}} />
      </View>
    );
  }
}

export default RegisterComponent;
