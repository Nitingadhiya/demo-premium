import React, {Component} from 'react';
import {
  View,
  SafeAreaView,
  Text
} from 'react-native';
import _ from 'lodash';
import {Color} from '../../common/styles';
import APICaller from '../../utils/api-caller';
import {SpinnerView, TextInputView} from '../../common/components';
import { McIcon } from '../../common/assets/vector-icon';
import { Appbar } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles'
import { activeDeactiveUserEndPoint } from '../../config/api-endpoint';
import NavigationHelper from '../../utils/navigation-helper';

export class ActiveDeactiveUser extends Component {
  state = {
    username: '',
    loadingData: false
  };

  changeTexInputValue(value) {
    this.setState({
      username: value
    })
  }

  renderUserName = () => {
    const {username} = this.state;
    return (
      <View style={styles.subTextBoxView}>
        <TextInputView
          placeholder="User Name"
          labelIcon={
            <McIcon name="account" size={22} color={Color.lightGray} />
          }
          onChangeText={value => this.changeTexInputValue(value)}
          value={username}
        />
      </View>
    );
  };

  activeDeactiveUser() { 
    const {username} = this.state;   
    // Check validation
    if (!username) {
      alert('Please enter user name');
      return;
    }
   
    this.setState({loadingData: true});
  
    // User Login API
    APICaller(activeDeactiveUserEndPoint(username), 'GET').then(async json => {
      this.setState({loadingData: false});
      if (json.data.Success === '1') {
        const res = json.data.Response;
        const message = _.get(res,'[0].TranXaction','Something went to wrong');
        alert(message);
        NavigationHelper.navigate(this.props.navigation,'UserNavigation');
       }  else {
        const res = json.data;
        alert(res.Message +', Status:- '+res.Success);   
       }
       
    });
  }


  render() {
    const {loadingData} = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <Appbar.Header style={{backgroundColor: Color.primary}}>
          <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
          <Appbar.Content title={'Active / Deactive User'} />
        </Appbar.Header>     
        {loadingData ? (
          <View style={styles.spinnerView}>
            <SpinnerView />
          </View>
        ) : null}

        {this.renderUserName()}
        <TouchableOpacity
          style={[styles.touchableLogin]}
          onPress={() => this.activeDeactiveUser()}>
          <Text style={styles.loginText}>Save</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

export default ActiveDeactiveUser;
