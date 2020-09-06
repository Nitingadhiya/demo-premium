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

let filterComplainDesc = [];
let problemArray = [];
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
    itemTypes: [],
    businessTypes: [],
    antiVirus: [],
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
  };

  // ------------>>>LifeCycle Methods------------->>>

  componentDidMount() {
    const {route} = this.props;
    const params = route.params;
    this.systemTag = '';
    this.getcompDescList();
    this.getSystemPartsDescList();
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

    this.getComplaintBookAllData();
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });
  }

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
      <View style={[styles.textinputViewStyle, styles.systemQRTextInput]}>
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
    const {itemTypes} = this.state;
    if (!_.size(itemTypes)) return null;
    return <ItemTypeSelectBox item={itemTypes} />;
  };

  renderSystemType = () => {
    const {systemTypes} = this.state;
    if (!_.size(systemTypes)) return null;
    return <SystemTypeSelectBox item={systemTypes} />;
  };

  renderBusinessType = () => {
    const {businessTypes} = this.state;
    if (!_.size(businessTypes)) return null;
    return <BusinessTypeSelectBox item={businessTypes} />;
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
            antiVirus.map(res => {
              return (
                <TouchableOpacity
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
            thirdParty.map(res => {
              return (
                <TouchableOpacity
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
      console.log(res);
      totalProblemCharge =
        Number(totalProblemCharge) + Number(_.get(res, 'ParentCodeType', 0));
    });

    selectedSystemPartsList.map(res => {
      console.log(res, 'YYYYY');
      totalPartsCharge =
        Number(totalPartsCharge) + Number(_.get(res, 'Price', 0));
    });

    this.setState({
      totalCharge: totalPartsCharge + totalProblemCharge,
    });

    console.log(totalPartsCharge, 'totalPartsCharge');
    console.log(totalProblemCharge, 'chaege');
  }

  /* System parts modal start */

  renderSystemPartsListModal = () => {
    const {
      systemPartsComplaintList,
      modalSystemList, // modal close/open
      selectedSystemPartsList, // after deselect options
    } = this.state;
    console.log(systemPartsComplaintList, 'systemPartsComplaintList');
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
    console.log(index, 'indexx');
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
    const {checkSystemAvailable} = this.state;
    if (checkSystemAvailable) {
      return 'green';
    }
    if (!checkSystemAvailable) {
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
