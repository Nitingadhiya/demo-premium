import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import _ from 'lodash';
import Moment from 'react-moment';
import Styles from './styles';
import {Color, Matrics} from '../../styles';
import {MIcon} from '../../assets/vector-icon';

export default class MessageTextInputView extends React.PureComponent {
  state = {
    messageText: '',
    validationMessage: '',
  };

  textInputChange = value => {
    this.setState({
      validationMessage: _.trim(value),
      messageText: value,
    });
  };

  clearTextInput() {
    this.setState({
      messageText: '',
      validationMessage: '',
    });
  }

  render() {
    const {onSendMessage} = this.props;
    const {messageText, validationMessage} = this.state;
    return (
      <View style={Styles.bottomView}>
        <TextInput
          style={Styles.textInput}
          placeholder={'Write message here'}
          placeholderTextColor={Color.silver}
          placeholderStyle={Styles.placeholderStyle}
          value={messageText}
          maxLength={255}
          multiline
          onChangeText={text => this.textInputChange(text)}
        />
        <TouchableOpacity
          style={[Styles.sendButton, {opacity: validationMessage ? 1 : 0.5}]}
          onPress={() => {
            this.clearTextInput();
            onSendMessage(messageText, validationMessage);
          }}
          disabled={!validationMessage}>
          <MIcon name={'send'} color={Color.white} size={25} />
        </TouchableOpacity>
      </View>
    );
  }
}
