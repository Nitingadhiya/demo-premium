import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StackActions, NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {
  Button,
  TextInputField,
  ActionModal,
  LoadWheel,
  TextInputView,
} from '../../components/index';
import {Color, Images, Matrics, Fonts, ApplicationStyles} from './index';
import Global from '../../../global';
import Styles from './styles';

class BottomButton extends Component {
  render() {
    const {
      onPress,
      buttonText,
      color,
      customStyle,
      customeTextStyle,
    } = this.props;
    return (
      <TouchableOpacity
        style={[Styles.flatButton, {backgroundColor: color}, customStyle]}
        onPress={onPress}
        activeOpacity={0.8}>
        <Text style={[Styles.flatText, customeTextStyle]}>{buttonText}</Text>
      </TouchableOpacity>
    );
  }
}
export default BottomButton;
