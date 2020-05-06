import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import Carousel from 'react-native-looped-carousel';
import {VersionNumber} from '../../../../package';

import APICaller from '../../../../utils/api-caller';
import {userDashboardEndPoint} from '../../../../config/api-endpoint';
import Helper from '../../../../utils/helper';
import Events from '../../../../utils/events';
import _ from 'lodash';
import styles from './styles';
import {
  UpdateAvailableView,
  UserInfoDashboardView,
  SpinnerView,
  Header,
} from '../../../../common/components';
import {Matrics, Color} from '../../../../common/styles';
import ImageCarousel from 'react-native-image-page';
import CarouselSliderView from '../../../../common/components/carousel-slider-view';

import CategoryItemList from '../../../../components/category-item-list';
import ComplaintOptionsModal from '../../../../components/complaint-options-modal';
import ComplaintWithQRCode from '../../../../components/complaint-with-qr-code';
import NavigationHelper from '../../../../utils/navigation-helper';

export default class Dashboard extends Component {
  state = {
    loadingData: false,
    updateAvailable: false,
    systemDescription: null,
    refreshing: false,
    userInfo: null,
    categoryData: null,
    sliderImage: null,
  };

  componentDidMount() {
    Helper.userAccessApplication(this.props.navigation);
    this.getUserInfo();
    Events.on('updateAvailable', 'Updates', res => {
      this.setState({
        updateAvailable: res,
      });
    });
    Helper.checkUpdateAvailable();
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });
    this.getCategoryList();
    this.dealerItem(userInfo.UserName);
  }

  getCategoryList() {
    const endPoint = `GetCategoryList`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      this.setState({
        loadingData: false,
      });
      if (json.data.Success === '1') {
        this.setState({categoryData: json.data.Response});
      }
    });
  }

  dealerItem() {
    const endPoint = `GetDealerImages`;
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      this.setState({
        loadingData: false,
      });
      if (json.data.Success === '1') {
        let data = json.data.Response;
        _.map(data, res => {
          res.uri = res.Slide;
          delete res.Slide;
        });
        this.setState({sliderImage: data});
      }
    });
  }

  userDashboard(userName) {
    this.setState({
      loadingData: true,
    });
    if (!userName) {
      Alert.alert('Alert', 'Invalid username');
      return;
    }
    APICaller(
      userDashboardEndPoint(userName, VersionNumber.buildVersion),
      'GET',
    ).then(json => {
      this.setState({
        loadingData: false,
        refreshing: false,
      });
      if (json.data.Success === '1') {
        const systmDescription = json.data.Response;
        this.setState({
          systemDescription: systmDescription,
        });
      }
    });
  }

  registerComplain() {
    Events.trigger('complaintRegisterModal', true);
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.userDashboard(this.state.userInfo.UserName);
  };

  renderItem = () => {
    return (
      <View style={{padding: Matrics.ScaleValue(10), backgroundColor: '#fff'}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{justifyContent: 'center'}}>
            {this.state.UserImage && (
              <Image
                source={{
                  uri: `${this.state.UserImage}?${global.userImageLoad}`,
                }}
                style={styles.UserImage}
                catch={false}
              />
            )}
          </View>
          <View style={styles.viewStyle}>
            <Text style={styles.textStyle} numberOfLines={1}>
              {this.state.FirstName} {this.state.LastName}
            </Text>
            <Text style={styles.textStyle1} numberOfLines={1}>
              {this.state.MobileNo}
            </Text>
            <Text style={styles.textStyleLocation} numberOfLines={1}>
              {this.state.Landmark ? `(${this.state.Landmark})` : null}
            </Text>
          </View>
          <View style={styles.viewStyle1}>
            <View style={styles.mainRightDash}>
              <View style={styles.rightDash}>
                <Text style={{marginLeft: 5}}>Rs. {this.state.Coins || 0}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const {navigation} = this.props;
    const {
      userInfo,
      refreshing,
      loadingData,
      updateAvailable,
      systemDescription,
    } = this.state;
    return (
      <SafeAreaView style={styles.safeView}>
        <Header title="Dashboard" left="menu" />
        {loadingData ? <SpinnerView /> : null}
        {updateAvailable ? <UpdateAvailableView /> : null}
        <ScrollView
          style={{flex: 1}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <UserInfoDashboardView userInfo={userInfo} />
          <CategoryItemList navigation={navigation} />

          {this.state.sliderImage ? (
            <Carousel style={styles.carouselView} pageInfo={false}>
              {this.state.sliderImage.map((data, index) => {
                return (
                  <View style={styles.sliderImageView} key={`${index}_str`}>
                    <Image
                      source={{uri: `${data.uri}?${Math.random()}`}}
                      resizeMode="stretch"
                      style={styles.sliderImage}
                    />
                  </View>
                );
              })}
            </Carousel>
          ) : // <ImageCarousel
          //   width={Matrics.screenWidth - 40}
          //   height={Matrics.screenWidth / 1.1}
          //   animate={false}
          //   delay={2000}
          //   indicatorSize={20}
          //   indicatorOffset={10}
          //   indicatorColor={Color.primary}
          //   images={this.state.sliderImage}
          //   style={{backgroundColor: 'red'}}
          // />
          null}
          {/* </View> */}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
