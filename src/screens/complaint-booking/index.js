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
import {SpinnerView, Header, TextInputView} from '../../common/components';
import Helper from '../../utils/helper';
import Events from '../../utils/events';
import ComplaintPriceModal from '../../components/complaint-price-modal';
import {
  LandMarkTextPickerTextBox,
  RoadPickerTextBox,
  AreaPickerTextBox,
} from '../../components/profile-component';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ItemTypeSelectBox,
  SystemTypeSelectBox,
  BusinessTypeSelectBox,
} from '../../components/system-component';

let filterComplainDesc = [];
//= ===CLASS DECLARATION====//
export default class ComplaintBooking extends Component {
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
    complaintId: null,
    paymentMethod: '0',
    paramsData: null,
    selectedServices: 'Advance',
    userInfo: null,
    systemTag: null,
  };

  // ------------>>>LifeCycle Methods------------->>>

  componentDidMount() {
    const {route} = this.props;
    const params = route.params;
    this.systemTag = '';
    this.getcompDescList();
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
        // this.setState({
        //   paymentServiceModal: true,
        // });
      }
      this.getUserInfo();
    }
    self = this;

    Events.on('complaint-advance-payment', 'complaint', res => {
      this.setState({
        webviewShow: res.visible,
        complaintId: res.complaintId,
        complainCharge: res.complainCharge,
      });
    });
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });
  }

  async getcompDescList() {
    if (!this.state.refreshing) {
      this.setState({loadingData: true});
    }

    const userInfo = await Helper.getLocalStorageItem('userInfo');

    const loginType = _.get(userInfo, 'LoginType', '');

    const endPoint = `GetComplainDescriptionList?LoginType=${loginType}`;
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

  nextAndSubmit() {
    const data = {
      visible: true,
      sysTag: this.state.systemTag,
    };
    Events.trigger('complaintPriceModal', data);
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

  submitComplaintMethod() {
    const {
      userInfo,
      selectedCompSubject,
      selectedCompDesc,
      systemTag,
      complainCharge,
    } = this.state;

    if (userInfo.UserName) {
      this.setState({
        loadingData: true,
      });

      const endPoint = `ComplaintSubmit`;
      const method = 'POST';
      const body = {
        An_Master_Complaint: [
          {
            ComplaintSubject: selectedCompSubject,
            ComplaintDesc: selectedCompDesc,
            ComplaintBy: userInfo.UserName,
            SystemTag: systemTag,
            TotalCharges: complainCharge,
            PaymentMode: null,
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
            if (
              complainCharge > 0 &&
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

  renderMobileNoTextBox = () => {
    const {systemTag} = this.state;
    return (
      <View style={styles.textinputViewStyle}>
        <TextInputView
          placeholder={'Enter Mobile No.'}
          placeholderTextColor={Color.silver}
          placeholderStyle={Styles.placeholderStyle}
          style={styles.textInput}
          value={systemTag}
          returnKeyType={'done'}
          keyboardType={'default'}
          maxLength={255}
          onChangeText={val => this.changeText(val)}
          onFocus={() => this.onFocus()}
        />
      </View>
    );
  };

  renderPartyName = () => {
    const {partyName} = this.state;
    return (
      <View style={styles.textinputViewStyle}>
        <TextInputView
          placeholder={'Enter Party Name'}
          placeholderTextColor={Color.silver}
          placeholderStyle={Styles.placeholderStyle}
          style={styles.textInput}
          value={partyName}
          returnKeyType={'done'}
          keyboardType={'default'}
          maxLength={255}
          onChangeText={val => this.changeText(val)}
          onFocus={() => this.onFocus()}
        />
      </View>
    );
  };

  renderCompanyName = () => {
    const {companyName} = this.state;
    return (
      <View style={styles.textinputViewStyle}>
        <TextInputView
          placeholder={'Enter Company Name'}
          placeholderTextColor={Color.silver}
          placeholderStyle={Styles.placeholderStyle}
          style={styles.textInput}
          value={companyName}
          returnKeyType={'done'}
          keyboardType={'default'}
          maxLength={255}
          onChangeText={val => this.changeText(val)}
          onFocus={() => this.onFocus()}
        />
      </View>
    );
  };

  renderHomeSociety = () => {
    const {companyName} = this.state;
    return (
      <View style={styles.textinputViewStyle}>
        <TextInputView
          placeholder={'Enter Home / Society'}
          placeholderTextColor={Color.silver}
          placeholderStyle={Styles.placeholderStyle}
          style={styles.textInput}
          value={companyName}
          returnKeyType={'done'}
          keyboardType={'default'}
          maxLength={255}
          onChangeText={val => this.changeText(val)}
          onFocus={() => this.onFocus()}
        />
      </View>
    );
  };

  renderLandMark = () => {
    return (
      <View style={styles.textinputViewStyle}>
        <LandMarkTextPickerTextBox landmark={'asdsa'} />
      </View>
    );
  };

  renderRoad = () => {
    return (
      <View style={styles.textinputViewStyle}>
        <RoadPickerTextBox road={'asdsa***'} />
      </View>
    );
  };

  renderPincodeTextBox = () => {
    const {pincode} = this.state;
    return (
      <View style={styles.textinputViewStyle}>
        <TextInputView
          placeholder={'Pincode'}
          placeholderTextColor={Color.silver}
          style={styles.textInput}
          value={pincode}
          returnKeyType={'done'}
          keyboardType={'numeric'}
          maxLength={6}
          onChangeText={val => this.changeText(val)}
          onFocus={() => this.onFocus()}
        />
      </View>
    );
  };

  renderArea = () => {
    return (
      <View style={styles.textinputViewStyle}>
        <AreaPickerTextBox area={'area***'} />
      </View>
    );
  };

  renderCityTextBox = () => {
    const {city} = this.state;
    return (
      <View style={styles.textinputViewStyle}>
        <TextInputView
          placeholder={'City'}
          placeholderTextColor={Color.silver}
          style={styles.textInput}
          value={city}
          returnKeyType={'done'}
          keyboardType={'default'}
          maxLength={6}
          onChangeText={val => this.changeText(val)}
          onFocus={() => this.onFocus()}
        />
      </View>
    );
  };

  renderStateTextBox = () => {
    const {division} = this.state;
    return (
      <View style={styles.textinputViewStyle}>
        <TextInputView
          placeholder={'Division'}
          placeholderTextColor={Color.silver}
          style={styles.textInput}
          value={division}
          returnKeyType={'done'}
          keyboardType={'default'}
          maxLength={6}
          onChangeText={val => this.changeText(val)}
          onFocus={() => this.onFocus()}
        />
      </View>
    );
  };

  renderReferenceBy = () => {
    const {referenceBy} = this.state;
    return (
      <View style={styles.textinputViewStyle}>
        <TextInputView
          placeholder={'Reference By'}
          placeholderTextColor={Color.silver}
          style={styles.textInput}
          value={referenceBy}
          returnKeyType={'done'}
          keyboardType={'default'}
          maxLength={6}
          onChangeText={val => this.changeText(val)}
          onFocus={() => this.onFocus()}
        />
      </View>
    );
  };

  renderRemark = () => {
    const {remark} = this.state;
    return (
      <View style={styles.textinputViewStyle}>
        <TextInputView
          placeholder={'Remark'}
          placeholderTextColor={Color.silver}
          style={styles.textInput}
          value={remark}
          returnKeyType={'done'}
          keyboardType={'default'}
          maxLength={6}
          onChangeText={val => this.changeText(val)}
          onFocus={() => this.onFocus()}
        />
      </View>
    );
  };

  renderItemType = () => {
    const {filterComplainDesc} = this.state;
    if (!_.size(filterComplainDesc)) return null;
    return <ItemTypeSelectBox item={filterComplainDesc} />;
  };

  renderSystemType = () => {
    const {filterComplainDesc} = this.state;
    if (!_.size(filterComplainDesc)) return null;
    return <SystemTypeSelectBox item={filterComplainDesc} />;
  };

  renderBusinessType = () => {
    const {filterComplainDesc} = this.state;
    if (!_.size(filterComplainDesc)) return null;
    return <BusinessTypeSelectBox item={filterComplainDesc} />;
  };

  render() {
    const {systemTag, complainCharge} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <Header title="Complaint Booking" left="back" />

        {!this.state.webviewLoad && this.state.webviewShow ? (
          <View style={styles.spinnerViewCenter}>
            <SpinnerView />
          </View>
        ) : null}
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.container}>
            <View style={styles.viewSystemName}>
              <Text>System Tag</Text>
            </View>
            <View style={styles.textinputViewStyle}>
              <TextInputView
                placeholder={'System Tag'}
                placeholderTextColor={Color.silver}
                placeholderStyle={Styles.placeholderStyle}
                style={styles.textInput}
                value={systemTag}
                returnKeyType={'done'}
                keyboardType={'default'}
                maxLength={255}
                onChangeText={val => this.changeText(val)}
                langType={'Words'}
                onFocus={() => this.onFocus()}
              />
            </View>
            {this.renderMobileNoTextBox()}
            {this.renderPartyName()}
            {this.renderCompanyName()}
            {this.renderHomeSociety()}
            {this.renderLandMark()}
            {this.renderRoad()}
            {this.renderPincodeTextBox()}
            {this.renderArea()}
            {this.renderCityTextBox()}
            {this.renderStateTextBox()}
            {this.renderReferenceBy()}
            {this.renderRemark()}

            {this.renderItemType()}
            {this.renderSystemType()}
            {this.renderBusinessType()}

            <View style={styles.borderW1}>
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
            <View style={styles.viewSystemName}>
              <Text>Enter Complaint Subject</Text>
            </View>
            <View style={styles.borderW1}>
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
                <View style={styles.viewSystemName}>
                  <Text>Enter System Name</Text>
                </View>
                <View style={styles.borderW1}>
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
            <View style={styles.nextandSubmitClass}>
              <TouchableOpacity
                onPress={() => {
                  complainCharge > 0
                    ? this.nextAndSubmit()
                    : this.submitComplaintMethod();
                }}
                style={styles.touchNextButton}>
                <Text style={styles.font16White}>
                  {complainCharge > 0 ? 'Next' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ComplaintPriceModal
            stateAll={this.state}
            navigation={this.props.navigation}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}
