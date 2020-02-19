// LIBRARIES
import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Color} from '../../common/styles';

//= ===CLASS DECLARATION====//
class Chat extends Component {
  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        <Header title={'Location'} left="menu" />
        <Text>sd</Text>
      </View>
    );
  }
}

//= =====STYLES DECLARATION======//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
});

export default Chat;
