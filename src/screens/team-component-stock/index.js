import React, {Component} from 'react';
import {SafeAreaView, View, Text, TouchableOpacity} from 'react-native';
import APICaller from '../../utils/api-caller';
import _ from 'lodash';
import {InhandResponsibleInventoryEndPoint} from '../../config/api-endpoint';
import styles from './styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import {SpinnerView, Header} from '../../common/components';
import InhandInventoryForResponsiblePerson from '../../components/inhand-inventory-for-responsible-person';
import InhandInventory from '../../components/inhand-inventory';

class TeamComponentStock extends Component {
  state = {
    loadingData: false,
    InhandinventoryList: null,
    responsibleInventory: null,
    userInfo: null,
    activeTab: '1',
    refreshing: false,
  };

  componentDidMount() {
    this.getUserInfo();
    Events.on('refresh-inventory-stock', 'refresh', () => {
      this.setState({refreshing: true});
      this.getUserInfo();
    });
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    if (userInfo) {
      this.setState({userInfo: userInfo});
      this.getInhandInventoryForResponsible(userInfo.UserName);
    }
  }

  getData = (json, key) => _.get(json, `data.Response.${key}`, null);

  getInhandInventoryForResponsible(username) {
    if (!this.state.refreshing) {
      this.setState({loadingData: true});
    }
    APICaller(InhandResponsibleInventoryEndPoint(username), 'GET').then(
      json => {
        console.log(json);
        if (!this.state.refreshing) {
          this.setState({loadingData: false});
        }
        if (json.data.Success === '1') {
          this.setState({
            InhandinventoryList: _.concat(
              this.getData(json, 'InhandInventories'),
              this.getData(json, 'ResponsibleInventories'),
            ),
            //responsibleInventory: ,
          });
        }
      },
    );
  }

  switchTab(val) {
    this.setState({
      activeTab: val,
    });
  }

  activeTab = val =>
    this.state.activeTab === val ? styles.activeTabCss : styles.inActiveCss;

  tabView = () => (
    <View style={styles.tabView}>
      <TouchableOpacity
        onPress={() => this.switchTab('1')}
        style={[styles.touchButton, this.activeTab('1')]}>
        <Text style={styles.tabText}>Inhand Inventory</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.switchTab('2')}
        style={[styles.touchButton, this.activeTab('2')]}>
        <Text style={styles.tabText}>Responsible Person</Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    const {
      loadingData,
      InhandinventoryList,
      responsibleInventory,
      activeTab,
      userInfo,
    } = this.state;

    return (
      <SafeAreaView style={styles.flex1}>
        <Header title={'Team component stock'} left="back" />
        {loadingData ? (
          <View style={styles.spinnerView}>
            <SpinnerView />
          </View>
        ) : null}
        <View style={styles.container}>
          {/* {this.tabView()} */}
          {/* {activeTab === '1' ? ( */}
          <InhandInventory data={InhandinventoryList} userInfo={userInfo} />
          {/* // ) : ( */}
          {/* <InhandInventoryForResponsiblePerson data={responsibleInventory} /> */}
          {/* )} */}
        </View>
      </SafeAreaView>
    );
  }
}
export default TeamComponentStock;
