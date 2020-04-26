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
import _ from 'lodash';
import {CommonActions} from '@react-navigation/native';
import {TextInputView, SpinnerView} from '../../common/components';
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import {Color, Matrics} from '../../common/styles';
import styles from './styles';
import Helper from '../../utils/helper';
import APICaller from '../../utils/api-caller';
import {
  getComplaintImageEndPoint,
  getComplaintChargeEndPoint,
} from '../../config/api-endpoint';
import NavigationHelper from '../../utils/navigation-helper';
import Events from '../../utils/events';
import {useNavigation} from '@react-navigation/native';

let tmpSys = [];
let self;
class ComplaintPriceModal extends Component {
  state = {
    paymentServiceModal: false,
    compImages: null,
    paymentMethod: '0',
    selectedServices: 'Advance',
    complainChargeJson: null,
  };
  componentDidMount() {
    self = this;
    Events.on('complaintPriceModal', 'modal visible', res => {
      this.setState({paymentServiceModal: res.visible});
      this.getComplainCharge(res.sysTag);
    });
    //this.fetchQRCodeImage();
  }

  fetchQRCodeImage() {
    APICaller(getComplaintImageEndPoint, 'GET').then(json => {
      this.setState({
        loadingData: false,
      });
      if (json.data.Success === '1') {
        this.setState({compImages: json.data.Response});
      }
    });
  }

  getComplainCharge(result) {
    const {UserName} = this.props.stateAll.userInfo;
    if (UserName) {
      this.setState({
        loadingData: true,
      });
      const endPoint = `GetComplaintCharges?SystemTag=${result}&BaseUserName=${UserName}`;
      const method = 'GET';
      APICaller(`${endPoint}`, method).then(json => {
        this.setState({
          loadingData: false,
        });
        if (json.data.Success === '1') {
          this.setState({
            complainChargeJson: json.data.Response,
          });
        }
      });
    }
  }

  submitComplaintMethod() {
    const {
      userInfo,
      selectedCompSubject,
      selectedCompDesc,
      systemTag,
    } = this.props.stateAll;
    const {complainChargeJson, paymentMethod} = this.state;
    if (userInfo.UserName) {
      this.setState({
        loadingData: true,
      });
      const totalCharge =
        paymentMethod === '1'
          ? complainChargeJson.ComplaintChargeCOS
          : complainChargeJson.ComplaintCharge;
      const endPoint = `ComplaintSubmit`;
      const method = 'POST';
      const body = {
        An_Master_Complaint: [
          {
            ComplaintSubject: selectedCompSubject,
            ComplaintDesc: selectedCompDesc,
            ComplaintBy: userInfo.UserName,
            SystemTag: systemTag,
            TotalCharges: totalCharge,
            PaymentMode: paymentMethod,
          },
        ],
      };

      APICaller(`${endPoint}`, method, JSON.stringify(body)).then(json => {
        this.setState({
          loadingData: false,
          paymentServiceModal: false,
        });
        if (!json) {
          Alert.alert('Something went to wrong');
        }
        if (json.status !== 200) {
          Alert.alert('Error Status', `${json.status}`);
          return;
        }
        if (json.data.Success === '1') {
          if (json.data.Response) {
            if (
              totalCharge > 0 &&
              this.state.selectedServices !== 'Cash on Service'
            ) {
              const dataEvent = {
                complaintId: _.get(json, 'data.Response[0].ComplaintID', ''), //json.data.Response[0].ComplaintID
                complainCharge: totalCharge,
                visible: true,
              };
              Events.trigger('complaint-advance-payment', dataEvent);
            } else {
              Alert.alert(
                'Complaint',
                'Complaint successfully submitted.',
                [{text: 'OK', onPress: () => this.props.navigation.goBack()}],
                {cancelable: false},
              );
            }
          } else {
            Alert.alert('Complaint', json.data.Message);
          }
        } else if (json.data.Success === '2') {
          Alert.alert('Alert', 'Complaint Already Booked');
        } else {
          Alert.alert('Alert', json.data.Message);
          // Alert.alert('Error -','Something went to wrong, please try again')
        }
      });
    }
  }

  selectPackageServices(value) {
    this.setState({
      paymentMethod: value,
      selectedServices: value === '1' ? 'Cash on Service' : 'Advance',
    });
  }

  render() {
    const {
      compImages,
      paymentServiceModal,
      complainChargeJson,
      paymentMethod,
      selectedServices,
      loadingData,
    } = this.state;

    return (
      <View>
        {loadingData ? (
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              top: '45%',
              alignSelf: 'center',
            }}>
            <SpinnerView />
          </View>
        ) : null}
        <Modal
          animationType="slide"
          transparent={false}
          visible={paymentServiceModal}
          onRequestClose={() => {
            this.setState({paymentServiceModal: false});
          }}>
          <View
            style={{
              backgroundColor: '#fff',
            }}>
            <View>
              <View style={styles.paymentMethodHeader}>
                <Text style={styles.SelectPaymentText}>
                  Select Payment Method
                </Text>
              </View>
              <View>
                <View style={styles.subHeader}>
                  <View style={styles.paymentView}>
                    <Text style={styles.PaymentMText}>Advance</Text>
                    <Text style={styles.PaymentMText}>(PrePaid)</Text>
                  </View>
                  <View style={styles.paymentView}>
                    <Text style={styles.PaymentMText}>Cash on Service</Text>
                    <Text style={styles.PaymentMText}>(PostPaid)</Text>
                  </View>
                </View>
                <View style={styles.subHeader}>
                  <View style={styles.servicetView}>
                    <Text>1st Service </Text>
                    <Text>
                      {_.get(complainChargeJson, 'ComplaintCharge1st', '-')}
                    </Text>
                  </View>
                  <View style={styles.servicetView}>
                    <Text>1st Service </Text>
                    <Text>
                      {_.get(complainChargeJson, 'ComplaintChargeCOS', '-')}
                    </Text>
                  </View>
                </View>
                <View style={styles.subHeader}>
                  <View style={styles.servicetView}>
                    <Text>2nd Service </Text>
                    <Text>
                      {_.get(complainChargeJson, 'ComplaintCharge2nd', '-')}
                    </Text>
                  </View>
                  <View style={styles.servicetView}>
                    <Text>2nd Service </Text>
                    <Text>
                      {_.get(complainChargeJson, 'ComplaintChargeCOS', '-')}
                    </Text>
                  </View>
                </View>
                <View style={styles.subHeader}>
                  <View style={styles.servicetView}>
                    <Text>3rd Service </Text>
                    <Text>
                      {_.get(complainChargeJson, 'ComplaintCharge3rd', '-')}
                    </Text>
                  </View>
                  <View style={styles.servicetView}>
                    <Text>3rd Service </Text>
                    <Text>
                      {_.get(complainChargeJson, 'ComplaintChargeCOS', '-')}
                    </Text>
                  </View>
                </View>
                <View style={{height: Matrics.ScaleValue(100)}}>
                  <View style={styles.servicetView}>
                    <Text>|</Text>
                  </View>
                  <View style={styles.servicetView}>
                    <Text>|</Text>
                  </View>
                  <View style={styles.servicetView}>
                    <Text>|</Text>
                  </View>
                  <View style={styles.servicetView}>
                    <Text>|</Text>
                  </View>
                </View>
                <View style={styles.subHeader}>
                  <View style={styles.servicetView}>
                    <Text>nth Service </Text>
                    <Text>
                      {_.get(complainChargeJson, 'ComplaintCharge3rd', '-')}
                    </Text>
                  </View>
                  <View style={styles.servicetView}>
                    <Text>nth Service </Text>
                    <Text>
                      {_.get(complainChargeJson, 'ComplaintChargeCOS', '-')}
                    </Text>
                  </View>
                </View>
                <View style={styles.subHeader}>
                  <View style={[styles.servicetView, styles.bgAppview]}>
                    <TouchableOpacity
                      onPress={() => this.selectPackageServices('0')}
                      style={styles.touchRadioButton}>
                      <Text style={styles.txtpayment}>Advance </Text>
                      <MIcon
                        name={
                          paymentMethod === '0'
                            ? 'radio-button-checked'
                            : 'radio-button-unchecked'
                        }
                        size={Matrics.ScaleValue(20)}
                        color={'white'}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.servicetView, styles.bgAppview]}>
                    <TouchableOpacity
                      onPress={() => this.selectPackageServices('1')}
                      style={styles.touchRadioButton}>
                      <Text style={styles.txtpayment}>Cash on Service </Text>
                      <MIcon
                        name={
                          paymentMethod === '1'
                            ? 'radio-button-checked'
                            : 'radio-button-unchecked'
                        }
                        size={Matrics.ScaleValue(20)}
                        color={'white'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.selectedView}>
                  <Text style={styles.selectedText}>
                    You have Selected{' '}
                    <Text style={styles.selectedTextService}>
                      {selectedServices}
                    </Text>{' '}
                    payment method
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.submitComplaintMethod()}
                  style={styles.btnSave}>
                  <Text style={styles.btnText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default ComplaintPriceModal;
