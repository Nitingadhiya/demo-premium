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
import {Images, Color, Matrics} from '../../common/styles';
const ordTrue = 'green';
const ordFalse = 'grey';
const styles = StyleSheet.create({
  container: {
    marginVertical: 3,
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
  },
  friendImg: {
    height: Dimensions.get('window').height * 0.12,
    width: Dimensions.get('window').height * 0.12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderStaus: {
    backgroundColor: '#000',
    borderRadius: 5,
    width: 10,
    height: 10,
  },
  orderStausBRD: {
    borderWidth: 2,
    flex: 1,
    height: 2,
  },
});

export default class POrder extends React.PureComponent {
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
    const {data, onPress} = this.props;
    return (
      <TouchableOpacity
        style={{
          backgroundColor: '#fff',
          padding: 10,
          margin: 10,
          shadowOffset: {width: 2, height: 0},
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 20,
          borderRadius: 10,
          elevation: 5,
        }}
        onPress={onPress}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          {data.Name || '-'}
        </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          {data.SystemName || '-'}
        </Text>
        <View style={{flexWrap: 'wrap'}}>
          <Text style={{fontSize: 16}}>
            <Text style={{fontWeight: 'bold'}}>Order Date : </Text>
            {data.OrderDate}
          </Text>
          <Text style={{fontSize: 16}}>
            <Text style={{fontWeight: 'bold'}}>Order No {'    '}: </Text>
            {data.OrderNo}
          </Text>

          <Text style={{fontSize: 16}}>
            <Text style={{fontWeight: 'bold'}}>Amount Rs : </Text>
            {data.Amount}
          </Text>

          {/* <Text>Approx Delivery Date: {data.InvoiceNo}|</Text> */}
        </View>
        <View
          style={{
            flex: 1,
            marginTop: 15,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            padding: 1,
          }}>
          {/* <View style={[styles.orderStaus, { backgroundColor: data.OrderGenerated ? 'black' : 'grey' }]} />
          <View style={[styles.orderStausBRD, { backgroundColor: data.OrderGenerated ? 'black' : 'grey' }]} /> */}

          <View
            style={[
              styles.orderStaus,
              {backgroundColor: data.OrderGenerated ? ordTrue : ordFalse},
            ]}
          />
          <View
            style={[
              styles.orderStausBRD,
              {borderColor: data.OrderGenerated ? ordTrue : orderFalse},
            ]}
          />

          <View
            style={[
              styles.orderStaus,
              {
                backgroundColor: data.SystemReadyToDispatch
                  ? ordTrue
                  : ordFalse,
              },
            ]}
          />
          <View
            style={[
              styles.orderStausBRD,
              {
                borderColor: data.SystemReadyToDispatch ? ordTrue : ordFalse,
              },
            ]}
          />

          <View
            style={[
              styles.orderStaus,
              {backgroundColor: data.SystemDispatched ? ordTrue : ordFalse},
            ]}
          />
          <View
            style={[
              styles.orderStausBRD,
              {borderColor: data.SystemDispatched ? ordTrue : ordFalse},
            ]}
          />

          <View
            style={[
              styles.orderStaus,
              {backgroundColor: data.SystemDelivered ? ordTrue : ordFalse},
            ]}
          />
          <View
            style={[
              styles.orderStausBRD,
              {borderColor: data.SystemDelivered ? ordTrue : ordFalse},
            ]}
          />

          <View
            style={[
              styles.orderStaus,
              {backgroundColor: data.SystemVerified ? ordTrue : ordFalse},
            ]}
          />
          <View
            style={[
              styles.orderStausBRD,
              {borderColor: data.SystemVerified ? ordTrue : ordFalse},
            ]}
          />
        </View>
        <View style={{marginVertical: 5}}>
          <Text style={{fontSize: 16}}>
            <Text style={{fontWeight: 'bold'}}>OrderStatus :</Text>{' '}
            {data.OrderStatus}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
