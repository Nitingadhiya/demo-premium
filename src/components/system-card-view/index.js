import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import {VersionNumber} from '../../package';
import styles from './styles';
import {Images, Color, Matrics} from '../../common/styles';
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import APICaller from '../../utils/api-caller';
import {userDashboardEndPoint} from '../../config/api-endpoint';

let self;
class SystemCardView extends Component {
  state = {
    systemDescription: null,
    refreshing: false,
  };

  componentDidMount() {
    self = this;
    const {userInfo} = this.props;
    this.userDashboard(userInfo.UserName);
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
        const systemDescription = json.data.Response;
        this.setState({
          systemDescription,
        });
      }
    });
  }

  checkSYStag(systemTag) {
    if (systemTag) {
      const sysTg = systemTag.split('-');
      if (sysTg[0] === 'SYS') {
        return 'true';
      }
      return 'false';
    }
    return 'false';
  }

  navigateSignature(systemTag, signature) {
    this.props.navigation.navigate('SignCapture', {systemTag, signature});
  }

  renderItemFlat({item}) {
    return (
      <View style={styles.systemProtectedView}>
        {self.checkSYStag(item.SystemTag) === 'true' ? (
          <TouchableOpacity
            style={styles.signatureVerifyScreen}
            onPress={() =>
              self.navigateSignature(item.SystemTag, item.Signature)
            }>
            <McIcon
              name="file-document"
              size={22}
              color={item.Signature ? Color.green : Color.error}
            />
          </TouchableOpacity>
        ) : null}
        {!item.IsSilver && !item.IsPlatinum && !item.IsGold ? (
          <Text style={styles.protectionText} numberOfLines={2}>
            You Are Under FMC Protection
          </Text>
        ) : (
          <Text style={styles.serviceText} numberOfLines={2}>
            {item.IsSilver && 'Silver '}
            {item.IsPlatinum && 'Platinum '}
            {item.IsGold && 'Gold '}
            Service{' '}
            {item.IsProtected ? 'Protection is Running' : 'Not Protected'}
          </Text>
        )}
        <Text style={styles.protectionConditionText} numberOfLines={2}>
          {item.IsPlatinum &&
            '(1 Year Door-Step Free Service + Offsite LifeTime Free Service)'}
          {item.IsGold &&
            '(1 Year Door-Step Free Service or 1 Year Offsite Free Service)'}
          {item.IsSilver && '(1 Year Offsite Free Service)'}
          {!item.IsSilver &&
            !item.IsGold &&
            !item.IsPlatinum &&
            '(Flexible Maintenance Contract is individual Chargable Service)'}
        </Text>
        <View style={styles.shildIconView}>
          {item.IsGold && (
            <Image
              source={item.IsProtected ? Images.goldOnIcon : Images.goldOffIcon}
              style={styles.shieldHeight}
            />
          )}
          {item.IsSilver && (
            <Image
              source={
                item.IsProtected ? Images.silverOnIcon : Images.silverOffIcon
              }
              style={styles.shieldHeight}
            />
          )}
          {item.IsPlatinum && (
            <Image
              source={
                item.IsProtected
                  ? Images.platinumOnIcon
                  : Images.platinumOffIcon
              }
              style={styles.shieldHeight}
            />
          )}
          {!item.IsPlatinum && !item.IsSilver && !item.IsGold && (
            <Image source={Images.fmcIcon} style={styles.shieldHeight} />
          )}
        </View>
        <TouchableOpacity
          style={styles.editSystemTouch}
          onPress={() => self.modalOpenSystem(item.SystemTag, item.SystemName)}>
          <Text style={styles.systemNameText} numberOfLines={1}>
            This is Your "{item.SystemName ? item.SystemName : '-'}"{' '}
          </Text>
          <MIcon
            name="edit"
            size={Matrics.ScaleValue(15)}
            color={Color.primary}
          />
        </TouchableOpacity>
        <Text style={styles.systemTagText} numberOfLines={2}>
          System Tag : "{item.SystemTag}"
        </Text>
        <View style={styles.animatedCircleView}>
          <TouchableOpacity
            style={styles.protectedDTSubView}
            onPress={() => self.getWarrantyFn(item.SystemTag)}>
            {/* <AnimatedCircularProgress
              size={parseInt(Matrics.screenWidth / 7.5)}
              width={3}
              fill={item.WarrantyPercentage || 0}
              tintColor="red"
              backgroundColor="grey">
              {fill => (
                <View style={styles.points}>
                  <Text style={styles.dayNumber}>{item.WarrantyDays || 0}</Text>
                  <Text style={styles.dayText}>Days</Text>
                </View>
              )}
            </AnimatedCircularProgress> */}
            <View style={styles.textdescView}>
              <Text style={styles.textdesc}>{'Warranty'.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.protectedDTSubView}
            activeOpacity={0.8}
            // disabled={!item.Antivirus}
            onPress={() =>
              self.showAntivirusKey(item.Antivirus, item.AntivirusKey)
            }>
            {/* <AnimatedCircularProgress
              size={parseInt(Matrics.screenWidth / 7.5)}
              width={3}
              fill={item.AntivirusPercentage || 0}
              tintColor="red"
              backgroundColor="grey">
              {fill => (
                <View style={styles.points}>
                  <Text style={styles.dayNumber}>
                    {item.AntivirusDays || 0}
                  </Text>
                  <Text style={styles.dayText}>Days</Text>
                </View>
              )}
            </AnimatedCircularProgress> */}
            <View style={styles.textdescView}>
              <Text style={styles.textdesc}>{'Anti-virus'.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.protectedDTSubView}
            onPress={() => self.getServiceDayFn(item.SystemTag)}>
            {/* <AnimatedCircularProgress
              size={parseInt(Matrics.screenWidth / 7.5)}
              width={3}
              fill={item.ServicePercentage || 0}
              tintColor="red"
              backgroundColor="grey">
              {fill => (
                <View style={styles.points}>
                  <Text style={styles.dayNumber}>{item.ServiceDays || 0}</Text>
                  <Text style={styles.dayText}>Days</Text>
                </View>
              )}
            </AnimatedCircularProgress> */}
            <View style={styles.textdescView}>
              <Text style={styles.textdesc}>{'Services'.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.protectedDTSubView}
            onPress={() => self.getBonusDayFn(item.SystemTag)}>
            {/* <AnimatedCircularProgress
              size={parseInt(Matrics.screenWidth / 7.5)}
              width={3}
              fill={item.BonusPercentage || 0}
              tintColor="red"
              backgroundColor="grey">
              {fill => (
                <View style={styles.points}>
                  <Text style={styles.dayNumber}>{item.BonusDays || 0}</Text>
                  <Text style={styles.dayText}>Days</Text>
                </View>
              )}
            </AnimatedCircularProgress> */}
            <View style={styles.textdescView}>
              <Text style={styles.textdesc}>{'Bonus Day'.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>
        {item.ComplaintID ? (
          <TouchableOpacity
            onPress={() => {
              self.getcomplainList();
            }}
            style={styles.complaintListButton}>
            <Text style={styles.complaintText}>{item.ComplaintID}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  render() {
    const {systemDescription} = this.state;
    return (
      <View style={{flex: 1}}>
        {systemDescription && systemDescription[0].UserName ? (
          <FlatList
            data={systemDescription}
            renderItem={this.renderItemFlat}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <View style={[styles.systemNotProtectedView]}>
            <View style={styles.shildImageView}>
              <Image source={Images.fmcIcon} style={styles.shieldHeight} />
            </View>
            <View style={styles.subView}>
              <Text style={styles.registerText}>
                You are not register any system yet!!
              </Text>
              <Text style={styles.simpleText}>
                Clicks on{' '}
                <Text
                  style={styles.simpleBoldText}
                  onPress={() => this.addSystem()}>
                  Add system
                </Text>{' '}
                and register your first system
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}
export default SystemCardView;
