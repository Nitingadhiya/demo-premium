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
import {MIcon, McIcon, Ionicons} from '../../common/assets/vector-icon';
import APICaller from '../../utils/api-caller';
import {SpinnerView, Header, TextInputView} from '../../common/components';
import Helper from '../../utils/helper';
import Events from '../../utils/events';
import ComplaintPriceModal from '../../components/complaint-price-modal';
import {
  LandMarkTextPickerTextBox,
  RoadPickerTextBox,
  AreaPickerTextBox,
  CityPickerTextBox,
} from '../../components/profile-component';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ItemTypeSelectBox,
  SystemTypeSelectBox,
  BusinessTypeSelectBox,
} from '../../components/system-component';
import {
  ProblemListForComplaintBooking,
  SystemPartsListForComplaintBooking,
} from '../../components/complaint-booking';
import {
  getAreaFromRoadEndPoint,
  getAreaFromPincodeEndPoint,
} from '../../config/api-endpoint';

let filterComplainDesc = [];
let problemArray = [];
//= ===CLASS DECLARATION====//
export default class ComplaintBooking extends Component {
  state = {
    loadingData: true,

    complainCharge: 0,
    userInfo: null,
    systemTag: null,
    itemTypes: [],
    businessTypes: [],
    antiVirus: [],
    isAntivirus: false,
    thirdParty: [],
    systemTypes: [],
    problemComplaintList: [],
    selectedProblemList: [],
    modalProblemList: false,
    isMajor: false,
    selectedAntivirus: null,
    isThirdParty: false,
    thirdParty: [],
    selectedThirdParty: null,
    /*system modal */
    modalSystemList: false,
    systemPartsComplaintList: [],
    selectedSystemPartsList: [],
    totalCharge: 0,
    mobileNo: null,
    systemType: null,
    businessType: null,
    itemType: null,
    getRoadValue: false,
    getPincodeValue: false,
  };

  // ------------>>>LifeCycle Methods------------->>>

  componentDidMount() {
    this.getUserInfo();
    this.getOrderDetailFromSystemTag();
    this.getComplaintBookAllData();
    this.getcompDescList();
    this.getSystemPartsDescList();

    self = this;

    this.searchingDelayed = _.debounce(text => {
      this.getAreaFromPincode(text);
    }, 300);
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    console.log(userInfo, 'useriii');
    this.setState({
      userInfo,
    });
  }

  getOrderDetailFromSystemTag() {
    const endPoint = `GetOrderDetailsFromSystemTag?SystemTag=TST-123456`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      console.log(json, 'json    88887');
      this.manageResponseOrderDetailData(json, 'array');
    });
  }

  getDetailFromMobileNo(mobileNo) {
    const endPoint = `GetUsersByMobileNo?MobileNo=${mobileNo}`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      console.log(json, 'json **');
      this.manageResponseOrderDetailData(json, 'object');
    });
  }

  manageResponseOrderDetailData = (json, type) => {
    let data;
    if (type == 'array') {
      data = _.get(json, 'data.Response[0]', '');
      this.setState({
        itemType: _.get(data, 'ItemType', ''),
        systemType: _.get(data, 'SystemType', ''),
        businessType: _.get(data, 'Business', ''),
      });
    } else {
      data = _.get(json, 'data.Response', '');
    }

    if (data) {
      this.setState({
        mobileNo: _.get(data, 'MobileNo1', ''),
        division: _.get(data, 'State', ''),
        partyName:
          _.get(data, 'FirstName', '') + ' ' + _.get(data, 'LastName', ''),
        companyName: _.get(data, 'CompanyName', ''),
        home: _.get(data, 'Home', ''),
        landMark: _.get(data, 'Landmark', ''),
        area: _.get(data, 'Area', ''),
        road: _.get(data, 'Road', ''),
        city: _.get(data, 'City', ''),
        referenceBy: _.get(data, 'ReferenceBy', ''),
        remark: _.get(data, 'Remark', ''),
        pincode: _.get(data, 'Pincode', ''),
        notFoundMessage: '',
      });
    } else {
      this.setState({
        notFoundMessage: _.get(json, 'data.Message', ''),
      });
    }
  };

  getComplaintBookAllData() {
    const endPoint = `getComplaintBookAllData`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      console.log(json, 'json');
      this.manageResponseBookAllData(json);
    });
  }

  manageResponseBookAllData(json) {
    const data = _.get(json, 'data.Response', '');
    if (data) {
      this.setState({
        itemTypes: _.get(data, 'ItemTypes', []),
        businessTypes: _.get(data, 'BusinessTypes', []),
        antiVirus: _.get(data, 'AntiVirus', []),
        thirdParty: _.get(data, 'ThirdParty', []),
        systemTypes: _.get(data, 'SystemTypes', []),
        selectedAntivirus: _.get(data, 'AntiVirus[0]', []),
        selectedThirdParty: _.get(data, 'ThirdParty[0]', []),
      });
    }
    console.log(data, 'FDD');
  }

  async getcompDescList() {
    this.setState({loadingData: true});
    const userInfo = await Helper.getLocalStorageItem('userInfo');

    const loginType = _.get(userInfo, 'LoginType', '');

    const endPoint = `GetComplainDescriptionList?LoginType=${loginType}`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      this.setState({
        loadingData: false,
      });

      this.manageComplaintDescription(json);
    });
  }

  manageComplaintDescription(json) {
    const data = _.get(json, 'data.Response', '');
    if (data) {
      this.setState({
        problemComplaintList: data,
      });
    }
  }

  /* system Parts api response */

  async getSystemPartsDescList() {
    this.setState({loadingData: true});
    const userInfo = await Helper.getLocalStorageItem('userInfo');

    const loginType = _.get(userInfo, 'LoginType', '');

    const endPoint = `GetComplainPartList?LoginType=${loginType}`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      this.setState({
        loadingData: false,
      });

      this.manageSystemPartsComplaintDescription(json);
    });
  }

  manageSystemPartsComplaintDescription(json) {
    const data = _.get(json, 'data.Response', '');
    if (data) {
      this.setState({
        systemPartsComplaintList: data,
      });
    }
  }

  /* system Parts api response */

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
      systemTag,
      businessType,
      systemType,
      itemType,
      totalCharge,
      isThirdParty,
      selectedThirdParty,
      isMajor,
      isAntivirus,
      selectedAntivirus,
      remark,
      selectedProblemList,
      selectedSystemPartsList,
      referenceBy,
    } = this.state;

    let prepareProblemsDesc = [];
    let prepareSystemPartDesc = [];

    selectedProblemList.map(res => {
      prepareProblemsDesc.push({
        Id: '0',
        Problem_Part_No: res.CodeId,
        Problem_Part: res.CodeDesc,
        Problem_Part_Rate: res.ParentCodeType,
        IsPart: 'false',
      });
    });
    console.log(selectedProblemList, 'selectedProblemList');
    console.log(selectedSystemPartsList, 'selectedSystemPartsList ***');
    selectedSystemPartsList.map(res => {
      console.log(res, 'reddd');
      prepareSystemPartDesc.push({
        Id: '0',
        Problem_Part_No: res.PartNo,
        Problem_Part: res.PartDescription,
        Problem_Part_Rate: res.Price,
        IsPart: 'true',
      });
    });

    console.log(prepareSystemPartDesc, 'prepareSystemPartDesc');

    let AN_Master_Complaint_Details = _.concat(
      prepareProblemsDesc,
      prepareSystemPartDesc,
    );

    console.log(AN_Master_Complaint_Details, 'AN_Master_Complaint_Details');

    if (userInfo.UserName) {
      this.setState({
        loadingData: true,
      });

      const endPoint = `AddComplaint`;
      const method = 'POST';
      // const body = {
      //   ComplaintViewModel: {
      //     AMC: {
      //       ID: '0',
      //       SystemTag: systemTag, //'SYS-XYMRUJ',
      //       BusinessType: businessType,
      //       SystemType: systemType, //'Home',
      //       ItemType: itemType, //'Desktop',
      //       ComplaintBy: 'bhariz001',
      //       EntryBy: userInfo.UserName,
      //       TotalCharges: totalCharge.toFixed(2), //'350',
      //       IsThirdParty: isThirdParty, //'false',
      //       ThirdParty: _.get(selectedThirdParty, 'CodeDesc', ''), // 'Nitin Variya (Laptop)',
      //       IsMajor: isMajor,
      //       IsAntivirus: isAntivirus, //'false',
      //       Antivirus: _.get(selectedAntivirus, 'CodeDesc', ''), //'ESET 1-Year Smart Security',
      //       IsBranded: 'false',
      //       ComplaintType: 'Paid Office Service',
      //       BookRemarks: remark,
      //       ReferenceBy: referenceBy,
      //     },
      //     AMCDList: {
      //       AN_Master_Complaint_Details,
      //     },
      //   },
      // };

      const body = {
        ComplaintViewModel: {
          AMC: {
            ID: '0',
            SystemTag: 'SYS-XYMRUJ',
            Antivirus: 'ESET 1-Year Smart Security',
            SystemType: 'Home',
            ItemType: 'Desktop',
            ComplaintBy: 'bhariz001',
            EntryBy: '10001',
            TotalCharges: '350',
            IsThirdParty: 'false',
            ThirdParty: 'Nitin Variya (Laptop)',
            IsMajor: 'true',
            IsAntivirus: 'false',
            IsBranded: 'false',
            ComplaintType: 'Paid Office Service',
            BookRemarks: 'Lenovo M72e SFF',
          },
          AMCDList: {
            AN_Master_Complaint_Details: [
              {
                Id: '0',
                Problem_Part_No: '1',
                Problem_Part: 'Laptop Body Top (A-Panel)',
                Problem_Part_Rate: '1600',
                IsPart: 'false',
              },
              {
                Id: '0',
                Problem_Part_No: 'PRT000509',
                Problem_Part: 'Graphics nVidia GeForce 4GB DDR5 1650 (New)',
                Problem_Part_Rate: '14784.00',
                IsPart: 'true',
              },
            ],
          },
        },
      };

      console.log(body);

      APICaller(`${endPoint}`, method, JSON.stringify(body)).then(json => {
        this.setState({
          loadingData: false,
        });
        // if (!json) {
        //   Alert.alert('Something went to wrong');
        // }
        // if (json.status !== 200) {
        //   Alert.alert('Error Status', `${json.status}`);
        //   return;
        // }
        // if (json.data.Success === '1') {
        //   if (json.data.Response) {
        //     if (
        //       complainCharge > 0 &&
        //       this.state.selectedServices !== 'Cash on Service'
        //     ) {
        //       const dataEvent = {
        //         complaintId: _.get(json, 'data.Response[0].ComplaintID', ''), //json.data.Response[0].ComplaintID
        //         complainCharge: totalCharge,
        //         visible: true,
        //       };
        //       Events.trigger('complaint-advance-payment', dataEvent);
        //     } else {
        //       Alert.alert(
        //         'Complaint',
        //         'Complaint successfully submitted.',
        //         [{text: 'OK', onPress: () => this.props.navigation.goBack()}],
        //         {cancelable: false},
        //       );
        //     }
        //   } else {
        //     Alert.alert('Complaint', json.data.Message);
        //   }
        // } else if (json.data.Success === '2') {
        //   Alert.alert('Alert', 'Complaint Already Booked');
        // } else {
        //   Alert.alert('Alert', json.data.Message);
        //   // Alert.alert('Error -','Something went to wrong, please try again')
        // }
      });
    }
  }

  renderSystemQRcodeTextbox = () => {
    return (
      <>
        <View style={styles.viewSystemName}>
          <Text>System Tag</Text>
        </View>

        <View style={styles.textinputViewStyle}>
          <TextInputView
            placeholder={'System Tag'}
            placeholderTextColor={Color.silver}
            placeholderStyle={Styles.placeholderStyle}
            style={styles.textInput}
            value={'SYS-XYZQWE'}
            returnKeyType={'done'}
            keyboardType={'default'}
            maxLength={255}
            editable={false}
          />
        </View>
      </>
    );
  };

  renderMobileNoTextBox = () => {
    const {mobileNo} = this.state;
    return (
      <View style={[styles.textinputViewStyle, styles.systemQRTextInput]}>
        <TextInputView
          placeholder={'Enter Mobile No.'}
          placeholderTextColor={Color.silver}
          placeholderStyle={Styles.placeholderStyle}
          style={styles.textInput}
          value={mobileNo}
          returnKeyType={'done'}
          keyboardType={'default'}
          maxLength={255}
          onChangeText={val => this.changeMobileNoText(val)}
          onFocus={() => this.onFocus()}
        />
      </View>
    );
  };

  changeMobileNoText = async val => {
    await this.setState({
      mobileNo: val,
    });
    console.log(_.size(val), 'Sizei');
    if (_.size(val) == 10) {
      console.log('val******', val);
      this.getDetailFromMobileNo(val);
    }
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
          onChangeText={val => this.changeText(val, 'partyName')}
          onFocus={() => this.onFocus()}
        />
      </View>
    );
  };

  changeText = (val, stateName) => {
    this.setState({
      [stateName]: val,
    });
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
          onChangeText={val => this.changeText(val, 'companyName')}
          onFocus={() => this.onFocus()}
        />
      </View>
    );
  };

  renderHomeSociety = () => {
    const {home} = this.state;
    return (
      <View style={styles.textinputViewStyle}>
        <TextInputView
          placeholder={'Enter Home / Society'}
          placeholderTextColor={Color.silver}
          placeholderStyle={Styles.placeholderStyle}
          style={styles.textInput}
          value={home}
          returnKeyType={'done'}
          keyboardType={'default'}
          maxLength={255}
          onChangeText={val => this.changeText(val, 'home')}
          onFocus={() => this.onFocus()}
        />
      </View>
    );
  };

  renderLandMark = () => {
    const {landMark} = this.state;
    return (
      <View style={styles.textinputViewStyle}>
        <LandMarkTextPickerTextBox
          landmark={landMark}
          setLandMarkValue={val => this.setState({landMark: val})}
        />
      </View>
    );
  };

  renderRoad = () => {
    const {road, getRoadValue, getPincodeValue} = this.state;
    return (
      <View style={styles.textinputViewStyle}>
        <RoadPickerTextBox
          road={road}
          setRoadValue={val => {
            this.setState({road: val});
            this.getAreaFromRoad(val);
          }}
          opacityValue={getRoadValue || getPincodeValue}
        />
      </View>
    );
  };

  getAreaFromRoad(road) {
    this.selectPincode = false;
    APICaller(getAreaFromRoadEndPoint(road), 'GET').then(async json => {
      if (json.data.Success === 1 || json.data.Success === '1') {
        const data = _.get(json, 'data.Response[0]', '');
        if (!data) return;
        this.setState({
          area: data.Area,
          city: data.City,
          pincode: data.Pincode,
          division: data.State,
          getRoadValue: true,
          loadingData: false,
        });
      } else {
        this.setState({
          getRoadValue: false,
        });
        //Alert.alert('Failed', json.data.Message || 'Failed to save address');
      }
    });
  }

  getAreaFromPincode(pincode) {
    this.setState({
      loadingData: true,
    });
    if (!pincode) return;
    if (pincode.length < 2) return;
    APICaller(getAreaFromPincodeEndPoint(pincode), 'GET').then(async json => {
      if (json.data.Success === 1 || json.data.Success === '1') {
        //Events.trigger('systemAdded'); //this for update address
        const data = _.get(json, 'data.Response[0]', '');
        if (!data) return;

        console.log('data', data);
        this.setState({
          area: data.Area,
          city: data.City,
          road: data.Road,
          division: data.State,
          getPincodeValue: true,
          loadingData: false,
        });
      } else {
        this.setState({
          getPincodeValue: false,
          loadingData: false,
        });
        //Alert.alert('Failed', json.data.Message || 'Failed to save address');
      }
    });
  }

  editableState() {
    if (this.selectPincode) {
      return !this.state.getPincodeValue === false ? false : true;
    } else {
      return !this.state.getRoadValue === false ? false : true;
    }
  }

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
          onChangeText={val => this.pincodeChange(val)}
          editable={this.editableState()}
        />
      </View>
    );
  };

  pincodeChange(value) {
    this.selectPincode = true;
    this.setState({pincode: value});
    this.searchingDelayed(value);
  }

  renderArea = () => {
    const {area, getRoadValue, getPincodeValue} = this.state;

    return (
      <View style={styles.textinputViewStyle}>
        <AreaPickerTextBox
          area={area}
          setAreaValue={val => this.setState({area: val})}
          opacityValue={getRoadValue || getPincodeValue}
        />
      </View>
    );
  };

  renderCityTextBox = () => {
    const {city, getRoadValue, getPincodeValue} = this.state;
    return (
      <View style={styles.textinputViewStyle}>
        <CityPickerTextBox
          city={city}
          setAreaValue={val => this.setState({city: val})}
          opacityValue={getRoadValue || getPincodeValue}
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
          maxLength={22}
          onChangeText={val => this.changeText(val, 'division')}
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
          maxLength={255}
          onChangeText={val => this.changeText(val, 'referenceBy')}
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
          maxLength={255}
          onChangeText={val => this.changeText(val, 'remark')}
          onFocus={() => this.onFocus()}
        />
      </View>
    );
  };

  itemChange = (stateName, val) => {
    this.setState({
      [stateName]: val,
    });
  };

  renderItemType = () => {
    const {itemTypes, itemType} = this.state;
    if (!_.size(itemTypes)) return null;
    return (
      <ItemTypeSelectBox
        item={itemTypes}
        selectedItem={itemType}
        itemChange={val => this.itemChange('itemType', val)}
      />
    );
  };

  renderSystemType = () => {
    const {systemTypes, systemType} = this.state;
    if (!_.size(systemTypes)) return null;
    return (
      <SystemTypeSelectBox
        item={systemTypes}
        selectedItem={systemType}
        itemChange={val => this.itemChange('systemType', val)}
      />
    );
  };

  renderBusinessType = () => {
    const {businessTypes, businessType} = this.state;
    if (!_.size(businessTypes)) return null;
    return (
      <BusinessTypeSelectBox
        item={businessTypes}
        selectedItem={businessType}
        itemChange={val => this.itemChange('businessType', val)}
      />
    );
  };

  renderIsMajor = () => {
    const {isMajor} = this.state;
    return (
      <TouchableOpacity
        style={styles.ismajorTouch}
        onPress={() => this.isMajorPress()}>
        <MIcon
          name={this.renderCheckBoxShow(isMajor)}
          color={Color.primary}
          size={Matrics.ScaleValue(20)}
        />
        <Text style={styles.isMajorText}>Is Major</Text>
      </TouchableOpacity>
    );
  };

  renderCheckBoxShow = bool => {
    return bool ? 'check-box' : 'check-box-outline-blank';
  };

  isMajorPress = () => {
    this.setState({
      isMajor: !this.state.isMajor,
    });
  };

  renderAntivirus = () => {
    const {antiVirus, isAntivirus} = this.state;
    return (
      <>
        <TouchableOpacity
          style={styles.ismajorTouch}
          onPress={() => this.isAntivirusPress()}>
          <MIcon
            name={this.renderCheckBoxShow(isAntivirus)}
            color={Color.primary}
            size={Matrics.ScaleValue(20)}
          />
          <Text style={styles.isMajorText}>Antivirus</Text>
        </TouchableOpacity>
        <View style={styles.radioButtonAntivirus}>
          {isAntivirus &&
            antiVirus.map((res, index) => {
              return (
                <TouchableOpacity
                  key={`${index}_string`}
                  style={styles.radioTouchSelection}
                  onPress={() => this.chooseAntivirus(res)}>
                  {this.renderRadioIcon(res)}
                  <Text style={[styles.text16Font, styles.mrg5]}>
                    {_.get(res, 'CodeDesc', '')}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </View>
      </>
    );
  };

  renderRadioIcon = antivirusObject => {
    const {selectedAntivirus} = this.state;

    if (
      _.get(antivirusObject, 'ID', '') == _.get(selectedAntivirus, 'ID', '')
    ) {
      return (
        <MIcon name="radio-button-checked" color={Color.primary} size={22} />
      );
    }

    return (
      <MIcon name="radio-button-unchecked" color={Color.primary} size={22} />
    );
  };

  chooseAntivirus = selectedAntivirus => {
    this.setState({
      selectedAntivirus,
    });
  };

  isAntivirusPress = () => {
    this.setState({
      isAntivirus: !this.state.isAntivirus,
    });
  };

  renderThirdPartyInvolvement = () => {
    const {thirdParty, isThirdParty} = this.state;
    return (
      <>
        <TouchableOpacity
          style={styles.ismajorTouch}
          onPress={() => this.isThirdPartyPress()}>
          <MIcon
            name={this.renderCheckBoxShow(isThirdParty)}
            color={Color.primary}
            size={Matrics.ScaleValue(20)}
          />
          <Text style={styles.isMajorText}>Third Party Involvement</Text>
        </TouchableOpacity>
        <View style={styles.radioButtonAntivirus}>
          {isThirdParty &&
            thirdParty.map((res, index) => {
              return (
                <TouchableOpacity
                  key={`${index}_string`}
                  style={styles.radioTouchSelection}
                  onPress={() => this.chooseThirdParty(res)}>
                  {this.renderThirdPartyRadioIcon(res)}
                  <Text style={[styles.text16Font, styles.mrg5]}>
                    {_.get(res, 'CodeDesc', '')}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </View>
      </>
    );
  };

  renderThirdPartyRadioIcon = thirdPartyObject => {
    const {selectedThirdParty} = this.state;
    if (
      _.get(thirdPartyObject, 'CodeDesc', '') ==
      _.get(selectedThirdParty, 'CodeDesc', '')
    ) {
      return (
        <MIcon name="radio-button-checked" color={Color.primary} size={22} />
      );
    }

    return (
      <MIcon name="radio-button-unchecked" color={Color.primary} size={22} />
    );
  };

  chooseThirdParty = selectedThirdParty => {
    this.setState({
      selectedThirdParty,
    });
  };

  isThirdPartyPress = () => {
    this.setState({
      isThirdParty: !this.state.isThirdParty,
    });
  };

  renderProblemList = () => {
    return (
      <TouchableOpacity
        style={styles.searchWithProblem}
        onPress={() => this.problemModalVisible(true)}>
        <MIcon name="search" size={24} color={Color.slateGrey} />
        <Text style={styles.problemText}>Problem</Text>
      </TouchableOpacity>
    );
  };

  renderSystemPartList = () => {
    const {systemPart} = this.state;
    return (
      <TouchableOpacity
        style={styles.searchWithProblem}
        onPress={() => this.systemModalVisible(true)}>
        <MIcon name="search" size={24} color={Color.slateGrey} />
        <Text style={styles.problemText}>System Parts</Text>
      </TouchableOpacity>
    );
  };

  systemModalVisible = bool => {
    this.setState({modalSystemList: bool});
  };

  problemModalVisible = bool => {
    this.setState({modalProblemList: bool});
  };

  renderProblemListModal = () => {
    const {
      problemComplaintList,
      modalProblemList, // modal close/open
      selectedProblemList, // after deselect options
    } = this.state;

    return (
      <ProblemListForComplaintBooking
        item={problemComplaintList}
        visible={modalProblemList}
        modalVisible={bool => this.problemModalVisible(bool)}
        selectedProblemsOptions={selectedProblemList}
        selectedProblems={async problems => {
          this.problemModalVisible(false);
          await this.setState({selectedProblemList: problems});
          this.calculateTotal();
        }}
        searchValue={''}
      />
    );
  };

  renderProblemTableList = () => {
    const {selectedProblemList} = this.state;
    if (!_.size(selectedProblemList)) return;
    return (
      <View style={styles.tableBg}>
        {selectedProblemList.map((res, index) => (
          <View key={`${index}_problems`} style={styles.problemTableRow}>
            <View style={styles.problemPriceDesc}>
              <Text style={styles.descCode}>{res.CodeDesc}</Text>
              <Text style={styles.priceCode}>{res.ParentCodeType}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButtonProblem}
              onPress={() => this.dSelectProblem(index)}>
              <McIcon name="close-circle-outline" size={25} color={'red'} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  async dSelectProblem(index) {
    let {selectedProblemList} = this.state;
    selectedProblemList.splice(index, 1);
    await this.setState({
      selectedProblemList,
    });
    this.calculateTotal();
  }

  calculateTotal() {
    const {selectedProblemList, selectedSystemPartsList} = this.state;

    let totalProblemCharge = 0;
    let totalPartsCharge = 0;
    selectedProblemList.map(res => {
      totalProblemCharge =
        Number(totalProblemCharge) + Number(_.get(res, 'ParentCodeType', 0));
    });

    selectedSystemPartsList.map(res => {
      totalPartsCharge =
        Number(totalPartsCharge) + Number(_.get(res, 'Price', 0));
    });

    this.setState({
      totalCharge: totalPartsCharge + totalProblemCharge,
    });
  }

  /* System parts modal start */

  renderSystemPartsListModal = () => {
    const {
      systemPartsComplaintList,
      modalSystemList, // modal close/open
      selectedSystemPartsList, // after deselect options
    } = this.state;
    return (
      <SystemPartsListForComplaintBooking
        item={systemPartsComplaintList}
        visible={modalSystemList}
        modalVisible={bool => this.systemModalVisible(bool)}
        selectedProblemsOptions={selectedSystemPartsList}
        selectedProblems={async problems => {
          this.systemModalVisible(false);
          await this.setState({selectedSystemPartsList: problems});
          this.calculateTotal();
        }}
        searchValue={''}
      />
    );
  };

  /* System parts modal End */

  /* System parts Table view */

  renderSystemTableList = () => {
    const {selectedSystemPartsList} = this.state;
    if (!_.size(selectedSystemPartsList)) return;
    return (
      <View style={styles.tableBg}>
        {selectedSystemPartsList.map((res, index) => (
          <View key={`${index}_problems`} style={styles.problemTableRow}>
            <View style={styles.problemPriceDesc}>
              <Text style={styles.descCode}>
                {_.get(res, 'PartDescription', '')}
              </Text>
              <Text style={styles.priceCode}>{_.get(res, 'Price', '')}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButtonProblem}
              onPress={() => this.dSelectSystemParts(index)}>
              <McIcon name="close-circle-outline" size={25} color={'red'} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  async dSelectSystemParts(index) {
    let {selectedSystemPartsList} = this.state;
    selectedSystemPartsList.splice(index, 1);
    await this.setState({
      selectedSystemPartsList,
    });
    this.calculateTotal();
  }

  /* System parts Table view end */

  renderFixedButton = complainCharge => {
    const {totalCharge} = this.state;
    return (
      <View style={styles.nextandSubmitClass}>
        <View style={styles.totalPriceView}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.priceTotalValue}>₹ {totalCharge}</Text>
        </View>
        <TouchableOpacity
          onPress={() => this.submitComplaintMethod()}
          style={styles.touchNextButton}>
          <Text style={styles.font16White}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  toggleMoreInfo = () => {
    this.setState({
      openMoreInfo: !this.state.openMoreInfo,
    });
  };

  renderQRcodeInfo = () => {
    const {openMoreInfo} = this.state;

    return (
      <TouchableOpacity
        style={styles.iconArrow}
        onPress={() => this.toggleMoreInfo()}>
        <Ionicons
          name={openMoreInfo ? 'arrow-up-circle' : 'arrow-down-circle'}
          color={this.checkSystemCodeAvailable()}
          size={Matrics.ScaleValue(30)}
        />
      </TouchableOpacity>
    );
  };

  checkSystemCodeAvailable = () => {
    const {mobileNo} = this.state;
    if (mobileNo) {
      return 'green';
    }
    if (!mobileNo) {
      return 'red';
    }
  };

  renderInformationFoundFromSystemTag = () => {
    const {openMoreInfo} = this.state;
    if (!openMoreInfo) return null;
    return (
      <>
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
      </>
    );
  };

  renderMessage = () => {
    const {notFoundMessage} = this.state;
    return (
      <View>
        <Text style={styles.foundMessage}>{notFoundMessage}</Text>
      </View>
    );
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
            {this.renderMessage()}
            {this.renderSystemQRcodeTextbox()}

            <View style={styles.systemQRcode}>
              {this.renderMobileNoTextBox()}
              {this.renderQRcodeInfo()}
            </View>
            {this.renderInformationFoundFromSystemTag()}

            {this.renderItemType()}
            {this.renderSystemType()}
            {this.renderBusinessType()}

            {this.renderIsMajor()}
            {this.renderAntivirus()}
            {this.renderThirdPartyInvolvement()}

            {this.renderProblemList()}
            {this.renderProblemTableList()}
            {this.renderSystemPartList()}
            {this.renderSystemTableList()}
          </View>
          {this.renderProblemListModal()}
          {this.renderSystemPartsListModal()}
        </ScrollView>
        {this.renderFixedButton(complainCharge)}
      </SafeAreaView>
    );
  }
}
