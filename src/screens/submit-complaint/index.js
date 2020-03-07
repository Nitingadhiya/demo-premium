// LIBRARIES
import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Picker,
  Modal,
} from 'react-native';
import _ from 'lodash';
import {WebView} from 'react-native-webview';
import styles from './styles';
import {Matrics, Color} from '../../common/styles';
import {MIcon} from '../../common/assets/vector-icon';
import APICaller from '../../utils/api-caller';
import {SpinnerView, Header} from '../../common/components';
import Helper from '../../utils/helper';

let filterComplainDesc = [];
//= ===CLASS DECLARATION====//
export default class submitComplaint extends Component {
  state = {
    loadingData: true,
    productListArr: [],
    toValue: false,
    we: -50,
    searchText: null,
    filterResult: [],
    searchFlag: false,
    refreshing: false,
    displayResult: false,
    subject: [],
    complainDesc: [],
    systemTag: null,
    filterComplainDesc: [],
    withOutQrCode: false,
    tmpSYS: [],
    selectedtempSYS: null,
    complainCharge: 0,
    complainChargeCOS: 350,
    ComplaintID: null,
    paymentMethod: '0',
    paymentServiceModal: false,
    paramsData: null,
    selectedServices: 'Advance',
    userInfo: null,
  };

  // ------------>>>LifeCycle Methods------------->>>

  componentDidMount() {
    const {route} = this.props;
    const params = route.params;
    this.systemTag = '';
    if (params) {
      this.setState({
        systemTag: params.systemTag,
        complainCharge: params.complainCharge,
        paramsData: params.data,
      });
      if (params.tmpSystemName && params.tmpSystemName.length > 0) {
        this.setState({
          tmpSYS: params.tmpSystemName,
          withOutQrCode: true,
          systemTag: params.tmpSystemName[0].sysTag,
        });
        this.systemTag = params.tmpSystemName[0].sysTag;
      }
      if (params.complainCharge > 0) {
        this.setState({
          paymentServiceModal: true,
        });
      }
      this.getUserInfo();
    }
    self = this;
    this.getcompDescList();
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });
    this.getComplainCharge(this.systemTag, userInfo.UserName);
  }

  getComplainCharge(result, userName) {
    if (userName) {
      this.setState({
        loadingData: true,
      });
      const endPoint = `GetComplaintCharges?SystemTag=${result}&BaseUserName=${userName}`;
      const method = 'GET';
      APICaller(`${endPoint}`, method).then(json => {
        this.setState({
          loadingData: false,
        });
        if (json.data.Success === '1') {
          this.setState({
            complainCharge: json.data.Response.ComplaintCharge,
            complainChargeCOS: json.data.Response.ComplaintChargeCOS,
          });
        }
      });
    }
  }

  // ------------->>>Controllers/Functions------------>>>>
  setIndicator() {
    const {loader} = getLoader().loader;
    this.setState({
      loadingData: this.state.refreshing ? !loader : loader,
      refreshing: false,
    });
  }

  getcompDescList() {
    if (!this.state.refreshing) {
      this.setState({loadingData: true});
    }
    //setLoader({loader: true});
    //  APIController.getProduct();
    this.setState({
      loadingData: true,
    });

    const endPoint = `GetComplainDescriptionList`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      this.setState({
        loadingData: false,
      });
      if (json.data.Success === '1') {
        if (json.data.Response) {
          const dataList = json.data.Response;
          const subject = [];
          const complainDesc = [];
          dataList.map((data, index) => {
            const exsitSubject = _.findIndex(subject, {
              ParentCodeTypeID: data.ParentCodeTypeID,
            });
            if (exsitSubject < 0) {
              subject.push({
                ParentCodeTypeID: data.ParentCodeTypeID,
                ParentCodeType: data.ParentCodeType,
              });
            }
            complainDesc.push({
              id: `${index}_id`,
              ParentCodeTypeID: data.ParentCodeTypeID,
              CodeDesc: data.CodeDesc,
            });
          });
          this.setState({
            subject,
            complainDesc,
            selectedCompSubject: subject[0].ParentCodeType,
            selectedCompDesc: complainDesc[0].CodeDesc,
          });
          // ////

          complainDesc.map(res => {
            if (res.ParentCodeTypeID === subject[0].ParentCodeTypeID) {
              filterComplainDesc.push(res);
            }
          });
          this.setState({
            filterComplainDesc,
          });
        }
      }
    });
  }

  submitComplaintFn() {
    const {userInfo} = this.state;
    if (userInfo.UserName) {
      this.setState({
        loadingData: true,
      });
      const endPoint = `ComplaintSubmit`;
      const method = 'POST';
      const body = {
        An_Master_Complaint: [
          {
            ComplaintSubject: this.state.selectedCompSubject,
            ComplaintDesc: this.state.selectedCompDesc,
            ComplaintBy: userInfo.UserName,
            SystemTag: this.state.systemTag,
            TotalCharges:
              this.state.paymentMethod === '1'
                ? this.state.complainChargeCOS
                : this.state.complainCharge,
            PaymentMode: this.state.paymentMethod,
          },
        ],
      };
      APICaller(`${endPoint}`, method, JSON.stringify(body)).then(json => {
        this.setState({
          loadingData: false,
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
            this.setState({
              ComplaintID: json.data.Response[0].ComplaintID,
            });
            if (
              this.state.complainCharge > 0 &&
              this.state.selectedServices !== 'Cash on Service'
            ) {
              this.setState({webviewShow: true});
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

  subjectChange(value) {
    let dataTypeId = null;
    this.state.subject.map(data => {
      if (data.ParentCodeType == value) {
        dataTypeId = data.ParentCodeTypeID;
      }
    });

    this.state.subject.map(data => {
      if (data.ParentCodeType == value) {
        dataTypeId = data.ParentCodeTypeID;
      }
    });
    filterComplainDesc = [];
    this.state.complainDesc.map(res => {
      if (res.ParentCodeTypeID === dataTypeId) {
        filterComplainDesc.push(res);
      }
    });
    this.setState({
      filterComplainDesc,
      selectedCompDesc: filterComplainDesc
        ? filterComplainDesc[0].CodeDesc
        : '',
    });
  }

  checkAndSubmit() {
    this.submitComplaintFn();
    // if (this.state.complainCharge > 0) {
    //   this.setState({ webviewShow: true });
    // } else {
    //   this.submitComplaintFn();
    // }
  }

  webviewStartLoad() {
    this.setState({
      webviewLoad: false,
    });
  }

  webviewEndLoad() {
    this.setState({
      webviewLoad: true,
    });
  }
  selectPackageServices(value) {
    this.setState({
      paymentMethod: value,
      selectedServices: value === '1' ? 'Cash on Service' : 'Advance',
    });
  }
  // ----------->>>Render Method-------------->>>
  //'http://premiumsales.in/Home/CreatePaymentMobile?mobilenumber=9725682497&email=arkeshkorat404@gmail.com&amount=',
  render() {
    const {paymentMethod, selectedServices, paramsData, userInfo} = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header title="Submit Complaint" left="back" />

        {!this.state.webviewLoad && this.state.webviewShow ? (
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
        {userInfo && this.state.webviewShow ? (
          <WebView
            onLoadStart={() => this.webviewStartLoad()}
            onLoadEnd={() => this.webviewEndLoad()}
            source={{
              uri: `http://premiumitware.com/Home/CreatePaymentMobile?mobilenumber=${userInfo.MobileNo}&email=${userInfo.EmailId}&amount=${this.state.complainCharge}&DocumentNo=${this.state.ComplaintID}&UserName=${userInfo.UserName}`,
            }}
            style={{flex: 1}}
            onLoad={syntheticEvent => {
              const {nativeEvent} = syntheticEvent;
              this.url = nativeEvent.url;
              const paytmURL = this.url;
              if (paytmURL) {
                const splitURL = paytmURL.split('?');
                const urlQuery = splitURL[0];
                const splitURLQuery = urlQuery.split('/').pop();
                if (splitURLQuery === 'PaytmResponseMobileSuccess') {
                  Alert.alert(
                    'Success',
                    'Thank you, your payment was successful and complain successfully submitted',
                    [
                      {
                        text: 'OK',
                        onPress: () => this.props.navigation.navigate('Home'),
                      },
                    ],
                    {cancelable: false},
                  );
                } else if (splitURLQuery === 'PaytmResponseMobileFailure') {
                  Alert.alert(
                    'Failure',
                    'Sorry, we were unable to process your payment',
                    [
                      {
                        text: 'OK',
                        onPress: () => this.props.navigation.navigate('Home'),
                      },
                    ],
                    {cancelable: false},
                  );
                }
              }
            }}
          />
        ) : (
          <View style={styles.container}>
            <View style={{height: 40, justifyContent: 'center'}}>
              <Text>Enter Complaint Subject</Text>
            </View>
            <View style={{borderColor: '#d3d3d3', borderWidth: 1}}>
              <Picker
                prompt="Enter Complaint Subject"
                selectedValue={this.state.selectedCompSubject || 0}
                onValueChange={(itemValue, itemIndex) => {
                  this.subjectChange(itemValue);
                  this.setState({selectedCompSubject: itemValue});
                }}>
                {this.state.subject.map((data, index) => {
                  return (
                    <Picker.Item
                      label={data.ParentCodeType}
                      value={data.ParentCodeType}
                      key={`${index}`}
                    />
                  );
                })}
              </Picker>
            </View>
            <View style={{height: 40, justifyContent: 'center', marginTop: 10}}>
              <Text>Enter Complaint Subject</Text>
            </View>
            <View style={{borderColor: '#d3d3d3', borderWidth: 1}}>
              <Picker
                prompt="What is the problem"
                selectedValue={this.state.selectedCompDesc || 0}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedCompDesc: itemValue});
                }}>
                {this.state.filterComplainDesc.map((data, index) => {
                  return (
                    <Picker.Item
                      label={data.CodeDesc}
                      value={data.CodeDesc}
                      key={`${index}`}
                    />
                  );
                })}
              </Picker>
            </View>
            {this.state.tmpSYS && this.state.tmpSYS.length > 0 && (
              <View>
                <View
                  style={{
                    height: 40,
                    justifyContent: 'center',
                    marginTop: 10,
                  }}>
                  <Text>Enter System Name</Text>
                </View>
                <View style={{borderColor: '#d3d3d3', borderWidth: 1}}>
                  <Picker
                    prompt="Enter System Name"
                    selectedValue={this.state.systemTag || 0}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({systemTag: itemValue});
                    }}>
                    {this.state.tmpSYS.map((data, index) => {
                      return (
                        <Picker.Item
                          label={data.sysName}
                          value={data.sysTag}
                          key={`${index}`}
                        />
                      );
                    })}
                  </Picker>
                </View>
              </View>
            )}
            <View style={styles.selectedView}>
              <Text style={styles.selectedText}>
                You have Selected{' '}
                <Text style={styles.selectedTextService}>
                  {selectedServices}
                </Text>{' '}
                payment method
              </Text>
            </View>
            <View style={{height: 45, alignItems: 'center', marginTop: 10}}>
              <TouchableOpacity
                onPress={() => this.checkAndSubmit()}
                style={{
                  width: '60%',
                  height: 45,
                  backgroundColor: Color.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                }}>
                <Text style={{color: '#fff', fontSize: 16}}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.paymentServiceModal}
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
                    <Text>{_.get(paramsData, 'ComplaintCharge1st', '-')}</Text>
                  </View>
                  <View style={styles.servicetView}>
                    <Text>1st Service </Text>
                    <Text>{_.get(paramsData, 'ComplaintChargeCOS', '-')}</Text>
                  </View>
                </View>
                <View style={styles.subHeader}>
                  <View style={styles.servicetView}>
                    <Text>2nd Service </Text>
                    <Text>{_.get(paramsData, 'ComplaintCharge2nd', '-')}</Text>
                  </View>
                  <View style={styles.servicetView}>
                    <Text>2nd Service </Text>
                    <Text>{_.get(paramsData, 'ComplaintChargeCOS', '-')}</Text>
                  </View>
                </View>
                <View style={styles.subHeader}>
                  <View style={styles.servicetView}>
                    <Text>3rd Service </Text>
                    <Text>{_.get(paramsData, 'ComplaintCharge3rd', '-')}</Text>
                  </View>
                  <View style={styles.servicetView}>
                    <Text>3rd Service </Text>
                    <Text>{_.get(paramsData, 'ComplaintChargeCOS', '-')}</Text>
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
                    <Text>{_.get(paramsData, 'ComplaintCharge3rd', '-')}</Text>
                  </View>
                  <View style={styles.servicetView}>
                    <Text>nth Service </Text>
                    <Text>{_.get(paramsData, 'ComplaintChargeCOS', '-')}</Text>
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
                  onPress={() => this.setState({paymentServiceModal: false})}
                  style={styles.btnSave}>
                  <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}
