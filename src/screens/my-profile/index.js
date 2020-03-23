import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  RefreshControl,
  ScrollView,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  // Image,
} from 'react-native';
import _ from 'lodash';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import {Appbar, Avatar, useTheme, Badge} from 'react-native-paper';
import CodeInput from 'react-native-confirmation-code-input';
import APICaller from '../../utils/api-caller';
import {getUserProfileEndPoint} from '../../config/api-endpoint';
import {MIcon} from '../../common/assets/vector-icon';
import styles from './styles';
import {Matrics, Color} from '../../common/styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';
import {SpinnerView, Header} from '../../common/components';
import POrder from '../../components/order';
import moment from 'moment';

class MyProfile extends Component {
  state = {
    profileInfo: null,
    userInfo: null,
  };

  componentDidMount() {
    this.getUserInfo();
    Events.on('refreshProfile', 'refreshProfile', () => {
      this.getUserInfo();
    });
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });
    this.getUserDetails(userInfo.UserName);
    // Events.on('refreshProfile', 'refreshProfile', () => {
    //   this.getUserDetails();
    // });
  }

  getUserDetails(userName) {
    if (!userName) {
      Alert.alert('Invalid username');
      return;
    }
    this.setState({loadingData: true});
    APICaller(getUserProfileEndPoint(userName), 'GET').then(json => {
      if (json.data.Success === '1') {
        const userInfo = json.data.Response;
        this.setState({
          profileInfo: userInfo,
        });
        Helper.setLocalStorageItem('userInfo', userInfo);
      } else {
        this.setState({
          loginError: json.data.Message,
        });
      }
      this.setState({loadingData: false});
    });
  }

  editPress() {
    NavigationHelper.navigate(this.props.navigation, 'EditProfile');
  }

  listInfo = (name, value) => (
    <View style={styles.displayView}>
      <View style={styles.viewFlex}>
        <Text style={styles.labelTitle}>{name}</Text>
      </View>
      <View style={styles.viewMomentValue}>
        <Text style={styles.valueText}>{value}</Text>
      </View>
    </View>
  );

  render() {
    const {profileInfo} = this.state;
    if (!profileInfo) return <View />;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
        {/* <Header title="My Profile" left="back" /> */}
        <ScrollView style={{flex: 1}}>
          <View style={{position: 'absolute', zIndex: 1, top: 10, left: 5}}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{padding: 10}}>
              <MIcon name="arrow-back" size={24} color={Color.darkPink} />
            </TouchableOpacity>
          </View>

          <View style={{position: 'absolute', zIndex: 1, top: 10, right: 10}}>
            {!this.state.editProfile ? (
              <TouchableOpacity
                onPress={() => this.editPress()}
                style={{padding: 10}}>
                <MIcon name={'edit'} size={20} color={Color.darkPink} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => this.savePress()}
                style={{padding: 10}}>
                <MIcon name={'checkmark'} size={25} color={Color.darkPink} />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              backgroundColor: Color.primary,
              flex: 0.5,
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={styles.imageView}>
              <Image
                source={{
                  uri: `${profileInfo.UserImage}?${Math.random()}`,
                }}
                imageStyle={styles.UserImage}
                indicatorContainerStyle={{
                  marginTop: Matrics.screenWidth / 10,
                }}
              />
            </View>
            <View style={{flex: 1, marginTop: 5}}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {profileInfo.FirstName} {profileInfo.LastName}
              </Text>
              <Text style={{color: '#fff', fontSize: 12, textAlign: 'center'}}>
                {profileInfo.MobileNo}
              </Text>
            </View>
          </View>

          <View style={{flex: 1}}>
            <View style={{flex: 1, padding: 10}}>
              {this.listInfo('First Name', profileInfo.FirstName)}
              {this.listInfo('Last Name', profileInfo.LastName)}
              {this.listInfo('Email', profileInfo.EmailId)}
              {this.listInfo('Mobile No', profileInfo.MobileNo)}
              {this.listInfo(
                'Birthday',
                moment(profileInfo.DateOfBirth).format('YYYY-MM-DD'),
              )}
              {this.listInfo('Gender', profileInfo.Gender)}
              {this.listInfo('Company Name', profileInfo.CompanyName)}
              {this.listInfo('GST No.', profileInfo.GSTNo)}
              {this.listInfo('Address', profileInfo.Home)}
              {this.listInfo('Landmark', profileInfo.Landmark)}
              {this.listInfo('Street / Road', profileInfo.Road)}
              {this.listInfo('Area', profileInfo.Area)}
              {this.listInfo('City', profileInfo.City)}
              {this.listInfo('Pincode', profileInfo.Pincode)}
              {this.listInfo('State', profileInfo.State)}
              {this.listInfo(
                'Business Type',
                profileInfo.BusinessType && profileInfo.BusinessType === 'H'
                  ? 'Home Use'
                  : 'Business Use',
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
export default MyProfile;
