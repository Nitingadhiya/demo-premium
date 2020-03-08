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

class AddSystem extends Component {
  state = {
    mobileNo: null,
    itemTypeList: null,
    systemTypeList: null,
    loadingData: false,
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
      ),
      'GET',
    ).then(json => {
      this.setState({
        loadingData: false,
      });

      if (json.data.Success === '1') {
        Events.trigger('systemAdded', 'refresh');
        NavigationHelper.navigate(this.props.navigation, 'Dashboard');
      } else {
        Alert.alert(
          `Error code - ${json.status}`,
          json.data.Message || 'Something went to wrong, please try again.',
        );
      }
    });
  }

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
              <Text style={styles.saveButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
export default AddSystem;
