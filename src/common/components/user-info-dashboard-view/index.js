import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import styles from './styles';

export const UserInfoDashboardView = ({userInfo}) => {
  if (!userInfo) return <View />;
  return (
    <View style={styles.container}>
      <View style={styles.userView}>
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
      </View>
    </View>
  );
};
