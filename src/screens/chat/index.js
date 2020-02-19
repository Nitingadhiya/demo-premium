// LIBRARIES
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from 'react-native';
import {Color, Images} from '../../common/styles';
import {Header} from '../../common/components';
// ASSETS
const data = [
  [
    {
      Name: 'John Doe',
      Time: '4:30 PM',
      Message: 'I Like it',
    },
    {
      Name: 'Michael Bone',
      Time: '5:30 PM',
      Message: 'Awesome!!',
    },
    {
      Name: 'Evan Leon',
      Time: '1:00 PM',
      Message: 'Doing good, how do you feel?',
    },
    {
      Name: 'Elaine Garza',
      Time: '9:37 AM',
      Message: 'Really Adorable',
    },
    {
      Name: 'Ernesto Lowenthal',
      Time: '11:30 PM',
      Message: 'How was your day?',
    },
    {
      Name: 'Henrietta Jones',
      Time: '10:30 AM',
      Message: 'Yesterday party is awesomegsgrgrwgwfewfewfe4wf34ewfe4wf.',
    },
    {
      Name: 'Rohan Mali',
      Time: '6:00 PM',
      Message: 'Kai train ma javana.',
    },
  ],
];

//= ===CLASS DECLARATION====//
class Chat extends Component {
  componentDidMount() {
    self = this;
  }

  renderItem = ({item}) => {
    return (
      <View
        style={{
          padding: 15,
          borderBottomWidth: 1,
          borderBottomColor: Color.silver,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{justifyContent: 'center'}}>
            <Image source={Images.SideMenuIcon} style={styles.UserImage} />
          </View>
          <View style={styles.viewStyle}>
            <Text style={styles.textStyle}>{item.Name}</Text>
            <Text numberOfLines={1} style={styles.textStyle1}>
              {item.Message}
            </Text>
          </View>

          <View style={styles.viewStyle2}>
            <Text style={styles.textStyle2}>{item.Time}</Text>
            <View style={{paddingTop: 8}}>
              <ImageBackground
                source={Images.dashBoardIcon}
                style={styles.imagebackgroundStyle}>
                <View style={{alignItems: 'center'}}>
                  <Text style={{color: Color.white}}>1</Text>
                </View>
              </ImageBackground>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // ----------->>>Render Method-------------->>>

  render() {
    return (
      <View style={styles.container}>
        <Header title={'Chat'} left="menu" />
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderItem}
        />
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
  UserImage: {
    height: 48,
    width: 48,
    borderRadius: 48 / 2,
  },
  viewStyle: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
  textStyle: {
    fontSize: 20,
  },
  textStyle1: {
    fontSize: 15,
    color: Color.orangish,
  },
  viewStyle1: {
    paddingRight: 2,
    justifyContent: 'space-between',
  },
  textStyle2: {
    fontSize: 13,
    color: Color.lightGray,
  },
  imagebackgroundStyle: {
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  viewStyle2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export default Chat;
