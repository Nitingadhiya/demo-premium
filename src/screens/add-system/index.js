import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Picker,
  TouchableOpacity,
  Alert,
} from 'react-native';
import APICaller from '../../utils/api-caller';
import {
  getItemTypeListEndPoint,
  getSystemTypeListEndPoint,
  addSystemEndPoint,
} from '../../config/api-endpoint';
import styles from './styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';
import {SpinnerView, TextInputView, Header} from '../../common/components';
import { Color, Matrics } from '../../common/styles';
import {MIcon} from "../../common/assets/vector-icon"

class AddSystem extends Component {
  state = {
    mobileNo: null,
    itemTypeList: null,
    systemTypeList: null,
    loadingData: false,
    selectedBusinessType: 'B',
  };

  async componentDidMount() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({userName: userInfo.UserName});
    this.getItemTypeList();
    this.getSystemTypeList();
  }

  getItemTypeList() {
    APICaller(getItemTypeListEndPoint, 'GET').then(json => {
      this.setState({
        loadingData: false,
      });
      if (json.data.Success === '1') {
        this.setState({
          itemTypeList: json.data.Response,
        });
      }
    });
  }

  getSystemTypeList() {
    APICaller(getSystemTypeListEndPoint, 'GET').then(json => {
      this.setState({
        loadingData: false,
      });
      if (json.data.Success === '1') {
        this.setState({
          systemTypeList: json.data.Response,
        });
      }
    });
  }

  changeSystemName(value) {
    this.setState({
      systemName: value,
    });
  }

  saveSystem() {
    const {
      userName,
      selectedItemType,
      selectedSystemType,
      systemName,
      selectedBusinessType,
    } = this.state;
    if (!userName) {
      Alert.alert('Invalid username');
      return;
    }
    if (!this.state.systemName) {
      Alert.alert('Alert', 'Please Enter System Name');
      return;
    }

    APICaller(
      addSystemEndPoint(
        selectedItemType,
        selectedSystemType,
        systemName,
        userName,
        selectedBusinessType,
      ),
      'GET',
    ).then(json => {
      this.setState({
        loadingData: false,
      });
      if (json.data.Success === '1') {
        Events.trigger('systemAdded', 'refresh');
        const systemTag = json.data.SystemTag
        let tmpSys = {
          sysName: systemName,
          sysTag: systemTag,
        };
        this.props.addSystemSuccess(tmpSys)
        //NavigationHelper.navigate(this.props.navigation, 'Dashboard');
      } else {
        Alert.alert(
          `Error code - ${json.status}`,
          json.data.Message || 'Something went to wrong, please try again.',
        );
      }
    });
  }

  renderBusinessType = () => {
    const {selectedBusinessType} = this.state;
    return (
      <>
        <View style={styles.viewItemTypeText}>
          <Text>Enter Use Type</Text>
        </View>
        <View style={styles.viewPicker}>
          <Picker
            selectedValue={selectedBusinessType}
            style={styles.cityList}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({selectedBusinessType: itemValue});
            }}>
            <Picker.Item label="Business Use" value="B" />
            <Picker.Item label="Home Use" value="H" />
          </Picker>
        </View>
      </>
    );
  };

  render() {
    const {
      loadingData,
      itemTypeList,
      selectedItemType,
      systemTypeList,
      selectedSystemType,
      systemName,
    } = this.state;

    return (
      <SafeAreaView style={styles.flex1}>
        <Header title={'Add System'} left="back" />
        {loadingData ? <SpinnerView /> : null}
        <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'center'}}>
          {/* <View style={{ flexDirection: 'row', alignItems: 'center'}}>  
            <View style={{ backgroundColor: Color.primary, justifyContent: 'center', height: 28, width: 28, borderRadius: 28, alignItems: 'center'}}>
              <MIcon name="arrow-back" size={Matrics.ScaleValue(20)} color={Color.white} />
            </View>
          </View> */}
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <View style={{ backgroundColor: Color.primary, width: Matrics.screenWidth / 4.3, height: 2}}></View>
            <View style={{ backgroundColor: Color.primary, justifyContent: 'center', height: 28, width: 28, borderRadius: 28, alignItems: 'center'}}>
              <Text style={{color: Color.white, fontSize: 12}}>1</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
          <View style={{ backgroundColor: Color.lightGray, width: Matrics.screenWidth / 4.3, height: 2}}></View>
            <View style={{ backgroundColor: Color.darkGrey, justifyContent: 'center', height: 28, width: 28, borderRadius: 28, alignItems: 'center'}}>
              <Text style={{color: Color.white, fontSize: 12}}>2</Text>
            </View>
            
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
          <View style={{ backgroundColor: Color.lightGray, width: Matrics.screenWidth / 4.3, height: 2}}></View>
            <View style={{ backgroundColor: Color.darkGrey, justifyContent: 'center', height: 28, width: 28, borderRadius: 28, alignItems: 'center'}}>
              <Text style={{color: Color.white, fontSize: 12}}>3</Text>
            </View>
            
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.viewItemTypeText}>
            <Text>Enter Item Type</Text>
          </View>
          <View style={styles.viewPicker}>
            <Picker
              prompt="Enter Item Type"
              selectedValue={selectedItemType || 0}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({selectedItemType: itemValue});
              }}>
              {itemTypeList &&
                itemTypeList.map((data, index) => (
                  <Picker.Item
                    label={data.CodeDesc}
                    value={data.CodeDesc}
                    key={`${index}`}
                  />
                ))}
            </Picker>
          </View>

          {this.renderBusinessType()}

          <View style={styles.viewItemTypeText}>
            <Text>Enter System Type</Text>
          </View>
          <View style={styles.viewPicker}>
            <Picker
              prompt="Enter System Type"
              selectedValue={selectedSystemType || 0}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({selectedSystemType: itemValue});
              }}>
              {systemTypeList &&
                systemTypeList.map((data, index) => (
                  <Picker.Item
                    label={data.CodeDesc}
                    value={data.CodeDesc}
                    key={`${index}`}
                  />
                ))}
            </Picker>
          </View>

          <View style={styles.viewItemTypeText}>
            <Text>Enter System Name</Text>
          </View>

          <TextInputView
            placeholder="Enter System Name - XYZ"
            placeholderTextColor="#ccc"
            onChangeText={value => this.changeSystemName(value)}
            value={systemName}
            customStyle={styles.systemNameTextInput}
          />

          <View style={styles.saveButtonview}>
            <TouchableOpacity
              onPress={() => this.saveSystem()}
              style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
export default AddSystem;
