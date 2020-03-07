import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Events from '../../../utils/events';
import styles from './styles';

class ToastComponent extends Component {
  state = {
    isVisible: false,
    message: null,
  };
  componentDidMount() {
    Events.on('toast', 'toast', message => {
      this.setState({
        isVisible: true,
        message: message || 'Something went to wrong, please try next time.',
      });
      setTimeout(() => {
        this.setState({
          isVisible: false,
        });
      }, 3000);
    });
  }

  render() {
    const {isVisible, message} = this.state;
    if (!isVisible) return <View />;
    return (
      <View style={styles.toastMessage}>
        <Text style={styles.textNoData}>{message}</Text>
      </View>
    );
  }
}
export default ToastComponent;
