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
  RefreshControl,
  Animated,
  NativeModules,
  LayoutAnimation,
  Picker,
  WebView,
  AsyncStorage,
  Modal,
  Dimensions,
} from 'react-native';
import {Appbar} from 'react-native-paper';
import _ from 'lodash';
import {Matrics, Color} from '../../common/styles';
import {MIcon} from '../../common/assets/vector-icon';
import APICaller from '../../utils/api-caller';
import {SpinnerView} from '../../common/components';
import {useNavigation} from '@react-navigation/native';

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
  };

  // ------------>>>LifeCycle Methods------------->>>

  componentDidMount() {
    const {route} = this.props;
    const params = route.params;
    //console.log(params, 'pass');
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
      }
      if (params.complainCharge > 0) {
        this.setState({
          paymentServiceModal: true,
        });
      }
      // if() {
      //   this.setState({
      //     withOutQrCode: true
      //   })
      // }
      AsyncStorage.getItem('userInfo').then(res => {
        if (res) {
          const result = JSON.parse(res);
          if (result) {
            const {UserName, EmailId, MobileNo} = result;
            this.setState({
              UserName,
              EmailId,
              MobileNo,
            });
            this.getComplainCharge(this.state.systemTag, UserName);
          }
        }
      });
    }
    self = this;
    this.getcompDescList();
  }

  getComplainCharge(result, UserName) {
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
        //console.log(json, 'json');
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
    const {UserName} = this.state;
    if (UserName) {
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
            ComplaintBy: UserName,
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
    const {paymentMethod, selectedServices, paramsData} = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={'Submit Complaint'} />
        </Appbar.Header>
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
        {this.state.webviewShow ? (
          <WebView
            onLoadStart={() => this.webviewStartLoad()}
            onLoadEnd={() => this.webviewEndLoad()}
            source={{
              uri: `http://premiumitware.com/Home/CreatePaymentMobile?mobilenumber=${this.state.MobileNo}&email=${this.state.EmailId}&amount=${this.state.complainCharge}&DocumentNo=${this.state.ComplaintID}&UserName=${this.state.UserName}`,
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
                {this.state.subject.map(data => {
                  return (
                    <Picker.Item
                      label={data.ParentCodeType}
                      value={data.ParentCodeType}
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
                {this.state.filterComplainDesc.map(data => {
                  return (
                    <Picker.Item label={data.CodeDesc} value={data.CodeDesc} />
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
                    {this.state.tmpSYS.map(data => {
                      return (
                        <Picker.Item label={data.sysName} value={data.sysTag} />
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

//= =====STYLES DECLARATION======//

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    padding: 10,
  },
  textStyle2: {
    fontSize: Matrics.ScaleValue(14),
    color: Color.lightGray,
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
    borderColor: Color.BLACK,
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
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    top: '45%',
  },
  spinnerViewPOS: {
    position: 'absolute',
    zIndex: 1,
    top: '45%',
    left: '40%',
  },
  badgeCountView: {
    backgroundColor: Color.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    right: 0,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Matrics.ScaleValue(45),
    borderWidth: 1,
    borderColor: '#ccc',
  },
  paymentMethodHeader: {
    height: Matrics.ScaleValue(50),
    borderTopWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentView: {
    flex: 1,
    alignItems: 'center',
  },
  SelectPaymentText: {
    color: Color.black,
    fontSize: Matrics.ScaleValue(18),
    fontWeight: 'bold',
  },
  PaymentMText: {
    fontSize: Matrics.ScaleValue(16),
    color: Color.black,
    fontWeight: 'bold',
  },
  servicetView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgAppview: {
    backgroundColor: Color.primary,
  },
  selectedView: {
    padding: Matrics.ScaleValue(10),
  },
  selectedText: {
    color: 'black',
    fontSize: Matrics.ScaleValue(18),
    textAlign: 'center',
  },
  selectedTextService: {
    fontWeight: 'bold',
  },
  touchRadioButton: {
    flexDirection: 'row',
    paddingHorizontal: Matrics.ScaleValue(5),
    paddingVertical: Matrics.ScaleValue(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtpayment: {
    color: 'white',
    fontSize: Matrics.ScaleValue(14),
    fontWeight: 'bold',
  },
  btnSave: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: Matrics.ScaleValue(80),
    backgroundColor: Color.primary,
    alignItems: 'center',
    height: Matrics.ScaleValue(40),
  },
  btnText: {
    color: 'white',
    fontSize: Matrics.ScaleValue(16),
    fontWeight: 'bold',
  },
});
