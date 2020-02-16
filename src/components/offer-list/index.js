import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
  AsyncStorage,
} from 'react-native';
import {Matrics, Color} from '../../common/styles';

const styles = StyleSheet.create({
  container: {
    marginVertical: 3,
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: Matrics.screenWidth,
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 5,
    backgroundColor: Color.white,
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
  },
  friendImg: {
    height: Matrics.screenHeight * 0.12,
    width: Matrics.screenHeight * 0.12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderStaus: {
    backgroundColor: Color.black,
    borderRadius: 5,
    width: 10,
    height: 10,
  },
  orderStausBRD: {
    borderWidth: 2,
    flex: 1,
    height: 1,
  },
});

export default class OfferList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUserId: null,
      // apiRead: false,
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('userInfo').then(userInfo => {
      if (userInfo) {
        const user = JSON.parse(userInfo);
        this.setState({
          loggedInUserId: user.id,
        });
      }
    });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          padding: 10,
          margin: 10,
          shadowOffset: {width: 2, height: 0},
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 20,
          borderRadius: 10,
          elevation: 5,
        }}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          Rapo Wireless keyboard Combo
        </Text>
        <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap'}}>
          <Text>Order Date: |&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
          <Text>Order No: |&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
          <Text>Amount Rs: | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
          <Text>
            Approx Delivery Date: |&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </Text>
        </View>
      </View>
    );
  }
}
