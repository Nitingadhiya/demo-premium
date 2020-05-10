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
import _ from 'lodash';
import {VersionNumber, AnimatedCircularProgress} from '../../package';
import styles from './styles';
import {Images, Color, Matrics} from '../../common/styles';
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import APICaller from '../../utils/api-caller';
import {userDashboardEndPoint} from '../../config/api-endpoint';
import Events from '../../utils/events';
import NavigationHelper from '../../utils/navigation-helper';

let self;
class SystemCardView extends Component {
  componentDidMount() {
    self = this;
  }

  navigateSignature(systemTag, signature) {
    const {navigation} = this.props;
    NavigationHelper.navigate(navigation, 'SignatureCapture', {
      systemTag,
      signature,
    });
    // this.props.navigation.navigate('SignCapture', {systemTag, signature});
  }

  EditSystemNameMethod = (systemTag, systemName) => {
    Events.trigger('systemNameUpdateModal', {systemTag, systemName});
  };

  renderItemFlat({item}) {
    checkSYStag = systemTag => {
      if (systemTag) {
        const sysTg = systemTag.split('-');
        if (sysTg[0] === 'SYS') {
          return 'true';
        }
        return 'false';
      }
      return 'false';
    };
    animatedCircle = (percentage, days) => (
      <AnimatedCircularProgress
        size={parseInt(Matrics.screenWidth / 7.5)}
        width={3}
        fill={percentage || 0}
        tintColor="red"
        backgroundColor="grey">
        {fill => (
          <View style={styles.points}>
            <Text style={styles.dayNumber}>{days || 0}</Text>
            <Text style={styles.dayText}>Days</Text>
          </View>
        )}
      </AnimatedCircularProgress>
    );

    return (
      <View style={styles.systemProtectedView}>
        {checkSYStag(item.SystemTag) === 'true' ? (
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
          onPress={() =>
            self.EditSystemNameMethod(item.SystemTag, item.SystemName)
          }>
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
            onPress={() =>
              Events.trigger('systemWarrantyEvent', {systemTag: item.SystemTag})
            }>
            {animatedCircle(item.WarrantyPercentage, item.WarrantyDays)}
            <View style={styles.textdescView}>
              <Text style={styles.textdesc}>{'Warranty'.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.protectedDTSubView}
            activeOpacity={0.8}
            // disabled={!item.Antivirus}
            onPress={() =>
              Events.trigger('antivirusKeyEvent', {
                antivirus: item.Antivirus,
                key: item.AntivirusKey,
              })
            }>
            {animatedCircle(item.AntivirusPercentage, item.AntivirusDays)}
            <View style={styles.textdescView}>
              <Text style={styles.textdesc}>{'Anti-virus'.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.protectedDTSubView}
            onPress={() =>
              Events.trigger('systemServiceEvent', {
                systemTag: item.SystemTag,
              })
            }>
            {animatedCircle(item.ServicePercentage, item.ServiceDays)}
            <View style={styles.textdescView}>
              <Text style={styles.textdesc}>{'Services'.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.protectedDTSubView}
            onPress={() =>
              Events.trigger('bonusDaysEvent', {
                systemTag: item.SystemTag,
              })
            }>
            {animatedCircle(item.BonusPercentage, item.BonusDays)}
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
        <TouchableOpacity
          style={styles.addressShowView}
          onPress={() => self.editAddress(item)}>
          <Text style={styles.addressText}>
            {item.Home ? item.Home + ' ' : 'No Address Found'}
            {item.Landmark && item.Landmark + ' '}
            {item.Area && item.Area + ' '}
            {item.Road && item.Road + ' '}
            {item.City && item.City + ' '}
            {item.State && item.State + ' '}
            {item.Pincode && item.Pincode}
          </Text>
          <MIcon name="edit" size={16} color={Color.primary} />
        </TouchableOpacity>
      </View>
    );
  }

  getcomplainList() {
    NavigationHelper.navigate(this.props.navigation, 'ComplaintList');
  }

  editAddress(item) {
    const {navigation} = this.props;
    NavigationHelper.navigate(navigation, 'UpdateAddress', {
      systemAddress: true,
      item,
    });
  }

  addSystem() {
    Events.trigger('open-add-system');
  }

  render() {
    const {systemDescription} = this.props;
    return (
      <View style={{flex: 1}}>
        {_.size(systemDescription) > 0 && systemDescription[0].UserName ? (
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
