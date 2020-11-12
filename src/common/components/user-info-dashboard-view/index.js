import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import NavigationHelper from '../../../utils/navigation-helper';
import {Images} from '../../styles';

export const UserInfoDashboardView = ({userInfo}) => {
  const navigation = useNavigation();
  if (!userInfo) return <View />;

  const renderCoin = () => {
    if (userInfo && userInfo.LoginType == '4') {
      return <Text style={{marginLeft: 5}}>{`₹. ${userInfo.Coins || 0}`}</Text>;
    }
    if (userInfo && (userInfo.LoginType == '2' || userInfo.LoginType == '3')) {
      return renderGoldSilverCoin();
    }
  };

  const renderGoldSilverCoin = () => {
    return (
      <View style={styles.viewFLXD}>
        <View style={styles.coinView}>
          <Text style={styles.coinCount}>{userInfo.Coins || 0}</Text>
          <Image source={Images.coinAmount} style={{width: 12, height: 12}} />
        </View>
        <View style={styles.coinView}>
          <Text style={styles.coinCount}>{userInfo.Gold || 0}</Text>
          <Image source={Images.goldCoin} style={{width: 12, height: 12}} />
        </View>
        <View style={styles.coinView}>
          <Text style={styles.coinCount}>{userInfo.Silver || 0}</Text>
          <Image source={Images.silverCoin} style={{width: 12, height: 12}} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.userView}
        onPress={() => NavigationHelper.navigate(navigation, 'MyProfile')}>
        <View style={styles.imageView}>
          {userInfo.UserImage && (
            <Image
              source={{
                uri: `${userInfo.UserImage}?${Math.random()}`,
              }}
              style={styles.UserImage}
              catch={false}
            />
          )}
        </View>
        <View style={styles.viewStyle}>
          <Text style={styles.textStyle} numberOfLines={1}>
            {userInfo.FirstName} {userInfo.LastName}
          </Text>
          <Text style={styles.textStyle1} numberOfLines={1}>
            {userInfo.MobileNo}
          </Text>
          <Text style={styles.textStyleLocation} numberOfLines={1}>
            {userInfo.Landmark ? `(${userInfo.Landmark})` : null}
          </Text>
        </View>
        <View style={styles.viewStyle1}>
          <View style={styles.mainRightDash}>
            <View style={styles.rightDash}>{renderCoin()}</View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// Customer  => Balnace
// Manager / Engineer => Gold / Silver
