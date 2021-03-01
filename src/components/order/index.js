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
  renderVerification = type => {
    if (type == 0 || type == '0') {
      return 'white';
    }
    if (type == 1 || type == '1') {
      return 'grey';
    }
    if (type == 2 || type == '2') {
      return 'green';
    }
  };

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
        <View
          style={{
            marginVertical: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 16}}>
            <Text style={{fontWeight: 'bold'}}>OrderStatus :</Text>{' '}
            {data.OrderStatus}
          </Text>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{borderRadius: 25, width:25, height: 25, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center'}}
              onPress={() => this.props.cancelOrder()}>
              <McIcon name="close" size={18} color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{paddingHorizontal: 10}}
              onPress={() => this.props.plugOnPress()}>
              <McIcon
                name="power-plug"
                size={24}
                color={this.renderVerification(
                  data.IsAdvanceVerificationRequired,
                )}
              />
            </TouchableOpacity>

            {data.IsDeliveryRequired ? (
              <McIcon name="truck-delivery" size={24} color={'#00bcd4'} />
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
export default POrder;
