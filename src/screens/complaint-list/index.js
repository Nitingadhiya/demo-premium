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
  Modal,
  AsyncStorage,
  Dimensions,
  Linking,
  CheckBox,
} from 'react-native';
import _ from 'lodash';
//import * as Animatable from 'react-native-animatable';
import QRCodeScanner from 'react-native-qrcode-scanner';
// ASSETS
import {Images, Color, Matrics} from '../../common/styles';
import {MIcon} from '../../common/assets/vector-icon';
import APICaller from '../../utils/api-caller';

let self;

const SCREEN_WIDTH = Dimensions.get('window').width;
const overlayColor = 'rgba(0,0,0,0.5)'; // this gives us a black color with a 50% transparency

const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = '#fff';

const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; // this is equivalent to 1 from a 393 device width
const scanBarColor = 'red';
let statusC = 'ALL';
const iconScanColor = 'blue';

class ComplainList extends Component {
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
    modalVisible: false,
    compDetails: null,
    complainListStatusArr: [],
    complaintSelectedValue: 'ASSIGN',
    filterComplaintArr: [],
    UserName: null,
    qrCode: false,
    closeRemarkModal: false,
    closeRemarkText: null,
    cancelRemarkModal: false,
    cancelRemarkText: null,
    LoginType: null,
    userList: [],
    antivirusCheckbox: false,
    antivirusData: [],
    selectAntivirus: '',
    validationAntivirus: '',
    antivirusKey: '',
    complaintRemarkValidation: null,
  };

  constructor(props) {
    super(props);
  }
  // ------------>>>LifeCycle Methods------------->>>

  componentDidMount() {
    self = this;
    AsyncStorage.getItem('userInfo').then(res => {
      if (res) {
        const result = JSON.parse(res);
        if (result) {
          const {UserName, LoginType} = result;
          this.setState({UserName, LoginType});
          this.UserName = UserName;

          if (result.LoginType === '3' || result.LoginType === 3) {
            statusC = 'ASSIGN';
          }
          if (result.LoginType === '2' || result.LoginType === '1') {
            statusC = 'ASSIGN';
          }
          this.getComplainList(statusC);
          this.getComplaintStatus();
          this.getAntivirusList();
        }
      }
      this.getUser();
    });
    // Events.on('refreshProductList', 'List', () => {
    //   console.log('Receive')
    //   this.getComplainList()
    // });
  }

  setModalVisible(visible, index) {
    this.setState({modalVisible: visible});
    this.setState({compDetails: this.state.complainListArr[index]});
  }

  getComplainList(status) {
    if (!this.state.refreshing) {
      this.setState({loadingData: true});
    }
    if (!this.UserName) {
      this.props.navigation.navigate('Login');
    }
    const endPoint = `GetComplaint?ComplainId=&ComplainType=${status}&ComplaintBy=${this.UserName}`;
    // console.log(endPoint, 'end');
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      //  console.log(json, 'json');
      if (json.data.Success === '1') {
        if (json.data.Response && json.data.Response.length === 0) {
          this.setState({
            noResult: 'No complaints found',
          });
        }
        this.setState({
          complainListArr: json.data.Response,
          displayResult: true,
          filterComplaintArr: json.data.Response,
        });
        setTimeout(() => {
          this.setState({loadingData: false, refreshing: false});
        }, 500);
      } else {
        this.setState({
          loginError: json.data.Message,
          displayResult: true,
        });
      }
    });
  }
  makeSlideOutTranslation(translationType, fromValue) {
    return {
      from: {
        [translationType]: SCREEN_WIDTH * -0.18,
      },
      to: {
        [translationType]: fromValue,
      },
    };
  }

  onSuccess(e) {
    if (e.data) {
      const url = e.data;
      this.setState({qrCode: false});
      const result = url.replace(/(^\w+:|^)\/\//, '');
      const splt = this.complaintCloseQRcode.split('-');
      const checksplt = splt[0];
      if (checksplt === 'SYS' || checksplt === 'SER') {
        if (this.complaintCloseQRcode === result) {
          this.setState({closeRemarkModal: true});
        } else {
          Alert.alert(
            'Complaint',
            'Your Complaint QR Code does not match with Scan QR Code.',
          );
        }
      } else {
        this.complaintCloseQRcode = result;

        this.setState({closeRemarkModal: true});
      }
    }
  }

  getAntivirusList() {
    const endPoint = `GetAntivirusList`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      if (json.data.Success === '1') {
        this.setState({
          antivirusData: json.data.Response,
        });
      }
    });
  }

  getComplaintStatus() {
    const {navigation} = this.props;
    if (!this.UserName) {
      navigation.navigate('Login');
    }
    const endPoint = `GetComplaintStatusList?Username=${this.UserName}`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      if (json.data.Success === '1') {
        this.setState({
          complainListStatusArr: json.data.Response,
        });
      }
    });
  }

  filterComplaintFn(itemValue) {
    statusC = itemValue;
    this.getComplainList(itemValue);
  }

  closeComplaint(item) {
    this.complaintCloseQRcode = item.SystemTag;
    this.complaintId = item.ComplaintID;
    this.setState({
      qrCode: true,
    });
    //this.setState({ closeRemarkModal: true });
  }

  closeComplaintRemark() {
    if (this.state.antivirusCheckbox && !this.state.selectAntivirus) {
      this.setState({
        validationAntivirus: 'Please select antivirus',
      });
      return;
    }

    if (this.state.antivirusCheckbox && !this.state.antivirusKey) {
      this.setState({
        validationAntivirus: 'Please enter antivirus key',
      });
      return;
    }

    this.setState({
      closeRemarkModal: !this.state.closeRemarkModal,
    });

    const endPoint = `ComplaintComplete?ComplainId=${this.complaintId}&CompleteBy=${this.UserName}&CloseRemark=${this.state.closeRemarkText}&SystemTag=${this.complaintCloseQRcode}&IsAntivirus=${this.state.antivirusCheckbox}&Antivirus=${this.state.selectAntivirus}&AntivirusKey=${this.state.antivirusKey}`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      this.setState({loadingData: false, refreshing: false});
      if (json.data.Success === '1') {
        this.getComplainList(statusC);
        Alert.alert('Complaint', 'Successfully close complaint');
      } else {
        Alert.alert('Alert', json.data.Message);
      }
    });
  }

  cancelComplaint(item) {
    this.complaintId = item.ComplaintID;
    this.setState({
      cancelRemarkModal: !this.state.cancelRemarkModal,
    });
  }

  cancelComplaintRemark() {
    if (!this.state.cancelRemarkText) {
      this.setState({
        complaintRemarkValidation: 'Please enter complaint remark text',
      });
      return;
    }
    this.setState({
      cancelRemarkModal: !this.state.cancelRemarkModal,
    });
    const endPoint = `ComplaintCancel?ComplainId=${this.complaintId}&CancelledBy=${this.UserName}&CancelReason=${this.state.cancelRemarkText}`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      this.setState({loadingData: false, refreshing: false});
      if (json.data.Success === '1') {
        this.getComplainList(statusC);
        Alert.alert('Complaint', 'Successfully Cancel complaint');
      } else {
        Alert.alert('Alert', json.data.Message);
      }
    });
  }

  getUser() {
    this.setState({loadingData: true, refreshing: false});
    const endPoint = `GetUsers?UserType=${this.state.LoginType}`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      this.setState({loadingData: false, refreshing: false});
      if (json.data.Success === '1') {
        this.setState({
          userList: json.data.Response,
        });
      } else {
        Alert.alert('Alert', json.data.Message);
      }
    });
  }

  assignedToFn(value, item) {
    if (!value) return;
    this.setState({loadingData: true, refreshing: false});
    this.complaintId = item.ComplaintID;
    const endPoint = `ComplaintAssign?ComplainId=${this.complaintId}&AssignBy=${this.UserName}&AssignTo=${value}`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      this.setState({loadingData: false, refreshing: false});
      if (json.data.Success === '0') {
        return;
      }
      if (json.data.Success === '1') {
        this.getComplainList(statusC);
        Alert.alert('Complaint', json.data.Message);
      } else {
        Alert.alert('Alert', json.data.Message);
      }
    });
  }

  complaintDetail(item, bool, index) {
    if (
      (item.ComplaintStatus === 'Cancelled' ||
        item.ComplaintStatus === 'Completed') &&
      (global.LoginType === 3 ||
        global.LoginType === 2 ||
        global.LoginType === '3' ||
        global.LoginType === '2')
    ) {
      return;
    }

    this.setModalVisible(bool, index);
  }

  onRefresh = () => {
    this.getComplainList(statusC);
  };

  dateSplit(date) {
    const spl = date.split('T');
    return spl[0] || null;
  }

  // ----------->>>Render Method-------------->>>

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#d3d3d3',
            borderRadius: 5,
            marginHorizontal: 5,
            marginTop: 10,
          }}>
          <Picker
            prompt="Select complaint Status"
            selectedValue={this.state.complaintSelectedValue}
            style={{height: 50}}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({complaintSelectedValue: itemValue});
              this.filterComplaintFn(itemValue);
            }}>
            {this.state.complainListStatusArr.map(data => {
              return (
                <Picker.Item label={data.CodeDesc} value={data.CodeDesc} />
              );
            })}
          </Picker>
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.qrCode}
          onRequestClose={() => {
            this.setState({qrCode: false});
          }}>
          <View
            style={{
              backgroundColor: '#000',
              height: Dimensions.get('window').height,
            }}>
            <View style={{flex: 1}}>
              <QRCodeScanner
                showMarker
                onRead={this.onSuccess.bind(this)}
                cameraStyle={{
                  height: Dimensions.get('window').height - 50,
                  width: Dimensions.get('window').width,
                  marginTop: 50,
                }}
                customMarker={
                  <View style={styles.rectangleContainer}>
                    <View style={styles.topOverlay}>
                      <Text style={styles.centerText}>
                        Scan QR code on your products for book your complaint
                      </Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                      <View style={styles.leftAndRightOverlay} />

                      <View style={styles.rectangle}>
                        <Animatable.View
                          style={styles.scanBar}
                          direction="alternate-reverse"
                          iterationCount="infinite"
                          duration={1700}
                          easing="linear"
                          animation={this.makeSlideOutTranslation(
                            'translateY',
                            SCREEN_WIDTH * 0.22,
                          )}
                        />
                      </View>

                      <View style={styles.leftAndRightOverlay} />
                    </View>

                    <View style={styles.bottomOverlay} />
                  </View>
                }
              />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            {this.state.compDetails && (
              <View
                style={{
                  marginTop: 100,
                  width: '95%',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 10,
                  alignSelf: 'center',
                  elevation: 3,
                }}>
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
                    <Text style={{fontSize: 16, fontWeight: 'bold', flex: 0.8}}>
                      {this.state.compDetails.Name} #
                      {this.state.compDetails.SystemTag}
                    </Text>
                    {this.state.compDetails.ComplaintStatus === 'Completed' && (
                      <Text
                        style={{
                          flex: 0.2,
                          color: 'green',
                          textAlign: 'right',
                        }}>
                        {this.state.compDetails.ComplaintStatus}
                      </Text>
                    )}
                    {this.state.compDetails.ComplaintStatus === 'Cancelled' && (
                      <Text
                        style={{flex: 0.2, color: 'red', textAlign: 'right'}}>
                        {this.state.compDetails.ComplaintStatus}
                      </Text>
                    )}
                  </View>
                  <Text>{this.state.compDetails.ComplaintSubject}</Text>
                  <Text>{this.state.compDetails.ComplaintDesc}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: 'black', padding: 5, paddingLeft: 0}}>
                      {this.state.compDetails.AssignedBy}
                    </Text>
                    <Text style={{padding: 5}}>=></Text>
                    <Text style={{color: 'black', padding: 5}}>
                      {this.state.compDetails.AssignedTo}
                    </Text>
                  </View>
                  <Text style={{fontWeight: 'bold'}}>User Details</Text>
                  <Text>{this.state.compDetails.Address}</Text>
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: Color.primary,
                      padding: 5,
                      borderRadius: 5,
                      width: 60,
                      justifyContent: 'center',
                      alignItems: 'center',
                      margingTop: 5,
                    }}
                    onPress={() => {
                      Linking.openURL(`tel:${this.state.compDetails.MobileNo}`);
                    }}>
                    <Text style={{fontSize: 14, color: Color.primary}}>
                      Call
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: Color.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  }}
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text style={{color: '#fff'}}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent
          visible={this.state.closeRemarkModal}
          onRequestClose={() => {
            this.setState({closeRemarkModal: false});
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
                    placeholder={'Please enter complaint close remark'}
                    value={this.state.closeRemarkText}
                    multiline={true}
                    onChangeText={text =>
                      this.setState({closeRemarkText: text})
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
                <View
                  style={{
                    flexDirection: 'row',
                    width: Matrics.SCREEN_WIDTH,
                    alignItems: 'center',
                  }}>
                  <CheckBox
                    onValueChange={() =>
                      this.setState({
                        antivirusCheckbox: !this.state.antivirusCheckbox,
                      })
                    }
                    value={this.state.antivirusCheckbox}
                  />
                  <Text
                    style={{
                      fontSize: Matrics.ScaleValue(14),
                    }}>
                    Antivirus
                  </Text>
                </View>
                {this.state.antivirusCheckbox ? (
                  <View
                    style={{
                      height: 50,
                      borderColor: '#ccc',
                      borderWidth: 1,
                      borderRadius: 5,
                      marginBottom: 5,
                      margin: 5,
                    }}>
                    <Picker
                      prompt="Antivirus list"
                      style={{
                        height: 50,
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({
                          selectAntivirus: itemIndex === 0 ? '' : itemValue,
                        });
                      }}
                      selectedValue={this.state.selectAntivirus}>
                      <Picker.Item
                        label={'Please choose below user'}
                        value={''}
                        disabled={true}
                      />
                      {this.state.antivirusData.map(data => {
                        return (
                          <Picker.Item
                            label={data.CodeDesc}
                            value={data.CodeDesc}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                ) : null}
                {this.state.antivirusCheckbox ? (
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    <TextInput
                      placeholder={'Please enter antivirus key'}
                      value={this.state.antivirusKey}
                      onChangeText={text => this.setState({antivirusKey: text})}
                      style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        height: 45,
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: '#ccc',
                        margin: 5,
                      }}
                    />
                  </View>
                ) : null}
                {this.state.validationAntivirus ? (
                  <Text
                    style={{
                      color: 'red',
                      fontSize: Matrics.ScaleValue(14),
                      marginBottom: 5,
                    }}>
                    {this.state.validationAntivirus}
                  </Text>
                ) : null}
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
                      closeRemarkModal: !this.state.closeRemarkModal,
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
                    this.closeComplaintRemark();
                  }}>
                  <Text style={{color: '#fff'}}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent
          visible={this.state.cancelRemarkModal}
          onRequestClose={() => {
            this.setState({cancelRemarkModal: false});
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
                    placeholder={'Please enter complaint cancel remark'}
                    value={this.state.cancelRemarkText}
                    multiline={true}
                    onChangeText={text =>
                      this.setState({cancelRemarkText: text})
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
                {this.state.complaintRemarkValidation ? (
                  <Text
                    style={{
                      fontSize: Matrics.ScaleValue(16),
                      color: 'red',
                      marginLeft: Matrics.ScaleValue(5),
                    }}>
                    {this.state.complaintRemarkValidation}
                  </Text>
                ) : null}
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
                      cancelRemarkModal: !this.state.cancelRemarkModal,
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
                    this.cancelComplaintRemark();
                  }}>
                  <Text style={{color: '#fff'}}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior="padding"
          enabled
          keyboardVerticalOffset={64}>
          {this.state.loadingData ? (
            <View style={styles.spinnerView}>
              <Spinner
                color={Color.primary}
                isVisible
                type="ThreeBounce"
                size={60}
              />
            </View>
          ) : null}
          <FlatList
            data={this.state.complainListArr}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            extraData={this.state}
            ListEmptyComponent={() =>
              this.state.displayResult ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: Matrics.ScaleValue(16),
                      fontWeight: 'bold',
                      color: 'black',
                    }}>
                    {this.state.noResult}
                  </Text>
                </View>
              ) : null
            }
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.refreshing}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => this.complaintDetail(item, true, index)}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  borderBottomWidth: 1,
                  borderColor: '#d3d3d3',
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                }}
                activeOpacity={1}>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      position: 'absolute',
                      zIndex: 1,
                      left: -5,
                      top: -7,
                      backgroundColor: item.IsFromWeb ? 'green' : 'red',
                      borderRadius: 7.5,
                    }}
                  />
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      position: 'absolute',
                      zIndex: 1,
                      left: 7,
                      top: -7,
                      backgroundColor:
                        item.PaymentType === 'Cash on service'
                          ? 'purple'
                          : 'transParent',
                      borderRadius: 7.5,
                    }}
                  />
                  <Text style={{fontSize: 16, fontWeight: 'bold', flex: 0.8}}>
                    {item.Name}{' '}
                    {item.CompanyName ? `, ${item.CompanyName}` : null}
                    {/* #{item.SystemTag} */}
                  </Text>
                  {item.ComplaintStatus === 'Completed' && (
                    <Text
                      style={{flex: 0.2, color: 'green', textAlign: 'right'}}>
                      {item.ComplaintStatus}
                    </Text>
                  )}

                  {item.ComplaintStatus === 'Assigned' &&
                    this.state.LoginType === '3' && (
                      <View style={{alignItems: 'flex-end', flex: 0.5}}>
                        <TouchableOpacity
                          onPress={() => this.closeComplaint(item)}
                          style={{
                            backgroundColor: Color.primary,
                            paddingHorizontal: 5,
                            justifyContent: 'center',
                            height: 30,
                            borderRadius: 3,
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 14,
                            }}>
                            Close
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  {item.ComplaintStatus === 'Active' ||
                    (item.ComplaintStatus === 'Assigned' &&
                      this.state.LoginType === '2' && (
                        <View
                          style={{
                            alignItems: 'flex-end',
                            flex: 0.5,
                            flexDirection: 'row',
                          }}>
                          <TouchableOpacity
                            style={{
                              backgroundColor: Color.primary,
                              paddingHorizontal: 5,
                              justifyContent: 'center',
                              height: 30,
                              borderRadius: 3,
                              marginRight: 5,
                            }}>
                            <Picker
                              prompt="Assign to User"
                              style={{
                                height: 50,
                                position: 'absolute',
                                zIndex: 1,
                                width: 80,
                                opacity: 0,
                              }}
                              onValueChange={(itemValue, itemIndex) => {
                                if (itemValue === 'a' || itemValue === '') {
                                  return;
                                }
                                this.assignedToFn(itemValue, item);
                              }}>
                              <Picker.Item
                                label={'Please choose below user'}
                                value={''}
                                disabled={true}
                              />
                              {this.state.userList.map(data => {
                                return (
                                  <Picker.Item
                                    label={data.FirstName + ' ' + data.LastName}
                                    value={data.UserName}
                                  />
                                );
                              })}
                            </Picker>
                            <Text
                              style={{
                                color: 'white',
                                fontSize: 14,
                              }}>
                              AssignTo
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => this.closeComplaint(item)}
                            style={{
                              backgroundColor: Color.primary,
                              paddingHorizontal: 5,
                              justifyContent: 'center',
                              height: 30,
                              borderRadius: 3,
                            }}>
                            <Text
                              style={{
                                color: 'white',
                                fontSize: 14,
                              }}>
                              Close
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                  {item.ComplaintStatus === 'Cancelled' && (
                    <Text style={{flex: 0.2, color: 'red', textAlign: 'right'}}>
                      {item.ComplaintStatus}
                    </Text>
                  )}
                </View>
                <Text>{item.ComplaintSubject}</Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: 'black', padding: 5, paddingLeft: 0}}>
                    {item.AssignedBy}
                  </Text>
                  <Text style={{padding: 5}}>=></Text>
                  <Text style={{color: 'black', padding: 5}}>
                    {item.AssignedTo}
                  </Text>
                </View>
                {item.PaymentType ? (
                  <Text style={{color: 'black'}}>{item.PaymentType}</Text>
                ) : null}
                <Text style={{color: 'black'}}>
                  Date: {this.dateSplit(item.ComplaintDate)}
                </Text>
                {(item.ComplaintStatus === 'Active' ||
                  item.ComplaintStatus === 'Assigned') &&
                  this.state.LoginType === '1' && (
                    <View
                      style={{
                        alignItems: 'flex-end',
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                      }}>
                      <TouchableOpacity
                        onPress={() => this.cancelComplaint(item)}
                        style={{
                          backgroundColor: Color.primary,
                          paddingHorizontal: 5,
                          justifyContent: 'center',
                          height: 30,
                          borderRadius: 3,
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 14,
                          }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          backgroundColor: Color.primary,
                          paddingHorizontal: 5,
                          justifyContent: 'center',
                          height: 30,
                          borderRadius: 3,
                        }}>
                        <Picker
                          prompt="Assign to User"
                          style={{
                            height: 50,
                            position: 'absolute',
                            zIndex: 1,
                            width: 80,
                            opacity: 0,
                          }}
                          selectedValue={'Please Assign to user'}
                          onValueChange={(itemValue, itemIndex) => {
                            if (itemValue === 'a' || itemValue === '') return;
                            this.assignedToFn(itemValue, item);
                          }}>
                          <Picker.Item
                            label={'Please choose assign complaint to '}
                            value={''}
                          />
                          {this.state.userList.map(data => {
                            return (
                              <Picker.Item
                                label={data.FirstName + ' ' + data.LastName}
                                value={data.UserName}
                              />
                            );
                          })}
                        </Picker>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 14,
                          }}>
                          AssignTo
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.closeComplaint(item)}
                        style={{
                          backgroundColor: Color.primary,
                          paddingHorizontal: 5,
                          justifyContent: 'center',
                          height: 30,
                          borderRadius: 3,
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 14,
                          }}>
                          Close
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
              </TouchableOpacity>
            )}
          />
          {this.state.searchFlag ? (
            <View style={styles.spinnerViewPOS}>
              <Spinner
                color={Color.primary}
                isVisible
                type="ThreeBounce"
                size={60}
              />
            </View>
          ) : null}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

//= =====STYLES DECLARATION======//

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
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

  centerText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
    marginHorizontal: 20,
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: rectDimensions,
    width: rectDimensions,
    borderWidth: rectBorderWidth,
    borderColor: rectBorderColor,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  topOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    paddingBottom: SCREEN_WIDTH * 0.25,
  },

  leftAndRightOverlay: {
    height: SCREEN_WIDTH * 0.65,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
  },
  scanBar: {
    width: scanBarWidth,
    height: scanBarHeight,
    backgroundColor: scanBarColor,
  },
});

export default ComplainList;
