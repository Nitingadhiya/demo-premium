// LIBRARIES
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import {Color, Matrics} from '../../common/styles';
import OfferList from '../../components/offer-list';
import {Header} from '../../common/components';

let self;

//= ===CLASS DECLARATION====//
class Offer extends Component {
  componentDidMount() {
    self = this;
  }

  // ------------->>>Controllers/Functions------------>>>>

  renderViewComment() {
    this.props.navigation.navigate('HomeScreen', {change: true});
  }

  renderSettings() {
    Alert.alert(
      'Alert',
      '',
      [
        {text: 'Edit', onPress: () => this.renderEdit()},
        {text: 'Delete', onPress: () => console.log('Delete')},
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  }

  renderEdit() {
    return (
      <View>
        <TextInput
          placeholder="Add Comment..."
          placeholderTextColor={Color.black}
          style={{marginLeft: Matrics.ScaleValue(20)}}
        />
        <Image
          source={Images.SendIcon}
          style={{alignSelf: 'center', marginRight: Matrics.ScaleValue(15)}}
        />
        />
      </View>
    );
  }

  renderItem = ({item}) => {
    return (
      <View style={styles.flatView}>
        <View style={{flexDirection: 'row'}}>
          <View>
            <View style={{justifyContent: 'center'}}>
              <Image source={Images.SideMenuIcon} style={styles.UserImage} />
            </View>
          </View>

          <View style={styles.userDetailView}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text style={styles.textStyle}>{item.Name}</Text>
              </View>
              <View>
                <Text style={styles.textStyle2}>{item.Time}</Text>
              </View>
              <View style={{marginTop: Matrics.ScaleValue(-3)}}>
                <TouchableOpacity onPress={this.renderSettings.bind(this)}>
                  <View style={styles.imageViewSetting}>
                    <Image
                      source={Images.SettingsIcon}
                      resizeMode="center"
                      style={{justifyContent: 'flex-end'}}
                    />
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text numberOfLines={1} style={styles.textStyle1}>
                {item.Message}
              </Text>
              <View style={styles.messageView} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  // ----------->>>Render Method-------------->>>

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header title="Offer" left="menu" />

        <OfferList />
        <OfferList />
        <OfferList />
        <OfferList />
        <OfferList />
      </SafeAreaView>
    );
  }
}

//= =====STYLES DECLARATION======//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  textStyle2: {
    fontSize: Matrics.ScaleValue(14),
    color: Color.ligh,
    justifyContent: 'flex-end',
  },
  UserImage: {
    height: Matrics.ScaleValue(50),
    width: Matrics.ScaleValue(50),
    borderRadius: Matrics.ScaleValue(50 / 2),
  },
  textStyle: {
    fontSize: Matrics.ScaleValue(16),
    fontWeight: 'bold',
    color: Color.black,
    flex: 1,
  },
  textStyle1: {
    fontSize: Matrics.ScaleValue(13),
    color: Color.lightGray,
  },
  textinputViewStyle: {
    flexDirection: 'row',
    backgroundColor: Color.white,
    borderColor: Color.black,
    height: Matrics.ScaleValue(50),
    justifyContent: 'space-between',
    shadowColor: 'red',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.75,
    shadowRadius: 15,
    elevation: 1,
  },
  userDetailView: {
    justifyContent: 'space-around',
    flex: 3,
    marginLeft: Matrics.ScaleValue(10),
  },
  imageViewSetting: {
    paddingVertical: Matrics.ScaleValue(6),
    paddingHorizontal: Matrics.ScaleValue(12),
  },
  messageView: {
    borderBottomColor: Color.silver,
    borderBottomWidth: 1,
    marginTop: Matrics.ScaleValue(5),
  },
  flatView: {
    padding: Matrics.ScaleValue(10),
    paddingRight: Matrics.ScaleValue(0),
  },
  textinputStyle: {
    marginLeft: Matrics.ScaleValue(20),
    fontSize: Matrics.ScaleValue(15),
    flex: 1,
  },
  sendIconStyle: {
    alignSelf: 'center',
    marginRight: Matrics.ScaleValue(15),
  },
});

export default Offer;
