import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import NavigationHelper from '../../../utils/navigation-helper';

export const UserInfoDashboardView = ({userInfo}) => {
  const navigation = useNavigation();
  if (!userInfo) return <View />;
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
            <View style={styles.rightDash}>
              <Text style={{marginLeft: 5}}>Rs. {userInfo.Coins || 0}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
