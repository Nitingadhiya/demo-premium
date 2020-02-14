import React, {Component} from 'react';
import {SafeAreaView, View, Text} from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import CodeInput from 'react-native-confirmation-code-input';
import APICaller from '../../utils/api-caller';
import {validateOtpEndPoint} from '../../config/api-endpoint';
import styles from './styles';
import {Matrics} from '../../common/styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';

class SubmitComplaint extends Component {
  state = {
    mobileNo: null,
  };

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>Submit Complaint</Text>
      </SafeAreaView>
    );
  }
}
export default SubmitComplaint;
