import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {TextInputView, SpinnerView} from '../../common/components';
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import {Color, Matrics} from '../../common/styles';
import styles from './styles';
import Helper from '../../utils/helper';
import APICaller from '../../utils/api-caller';
import {
  getComplaintImageEndPoint,
  complaintOnHoldEndPoint,
} from '../../config/api-endpoint';
import _ from 'lodash';
import NavigationHelper from '../../utils/navigation-helper';
import Events from '../../utils/events';
import {useNavigation} from '@react-navigation/native';

let tmpSys = [];
let self;
class OrderCancelRemarkModal extends Component {
  state = {
    orderCancelModal: false,
    compImages: null,
    orderCancelRemarkText: null,
  };
  componentDidMount() {
    self = this;
    Events.on('orderCancelRemarkModal', 'order-cancel-remark', res => {
      this.orderNo = res.orderNo;
      this.userName = res.userName;
      this.setState({orderCancelModal: true});
    });
  }

  submitOrderCancelRemark() {
    const { orderCancelRemarkText } =  this.state;

    APICaller(
      `CancelOrder?OrderNo=${this.orderNo}&LoginUser=${this.userName}&CancelReason=${orderCancelRemarkText}`,
      'GET',
    ).then(json => {
      this.setState({
        loadingData: false,
      });

      if (json.data.Success === '1') {
        this.setState({orderCancelModal: false});
        Events.trigger('order-refresh','refresh');
        Alert.alert(`Success`, json.data.Message);
        
      } else {
        Alert.alert(
          `Error code - ${json.status}`,
          json.data.Message || 'Something went to wrong, please try again.',
        );
      }
    });
  }

  render() {
    const {compImages, orderCancelModal} = this.state;

    return (
      <View>
        <Modal
          transparent
          visible={orderCancelModal}
          onRequestClose={() => {
            this.setState({orderCancelModal: false});
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.imageOutsideTouchButton}
            onPress={() => {
              this.setState({orderCancelModal: false});
            }}>
            <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
              <View
                style={{
                  marginTop: 100,
                  width: '95%',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 10,
                  alignSelf: 'center',
                  elevation: 3,
                }}>
                <Text
                  style={{
                    color: '#333',
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 10,
                  }}>
                  Remark
                </Text>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    borderBottomWidth: 1,
                    borderColor: '#d3d3d3',
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                  }}>
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    <TextInput
                      placeholder={'Please enter order cancel reason'}
                      value={this.state.orderCancelRemarkText}
                      multiline={true}
                      onChangeText={text =>
                        this.setState({orderCancelRemarkText: text})
                      }
                      style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        height: 100,
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: '#ccc',
                        margin: 5,
                      }}
                    />
                  </View>
                </View>

                <View style={{flexDirection: 'row', height: 40}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 10,
                      flex: 1,
                    }}
                    onPress={() => {
                      this.setState({
                        orderCancelModal: !this.state.orderCancelModal,
                      });
                    }}>
                    <Text style={{color: '#fff'}}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Color.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 10,
                      flex: 1,
                    }}
                    onPress={() => {
                      this.submitOrderCancelRemark();
                    }}>
                    <Text style={{color: '#fff'}}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}
export default OrderCancelRemarkModal;
