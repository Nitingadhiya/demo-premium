import React, {Component} from 'react';
import {Text, View, Alert, TouchableOpacity, Image} from 'react-native';
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import {VersionNumber} from '../../package';
import styles from './styles';
import APICaller from '../../utils/api-caller';
import {userDashboardEndPoint} from '../../config/api-endpoint';
import {Color} from '../../common/styles';

let img;
const ordTrue = 'green';
const ordFalse = 'grey';
class POrder extends Component {
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
            <Text style={{fontWeight: 'bold'}}>Amount ₹ : </Text>
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
export default POrder;
