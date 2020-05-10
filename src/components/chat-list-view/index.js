import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ImageBackground,
} from 'react-native';
import _ from 'lodash';
import {Images, Color, Matrics} from '../../common/styles';
import Moment from 'react-moment';
import styles from './styles';
import Helper from '../../utils/helper';

const calendarStrings = {
  lastDay: 'L',
  sameDay: 'LT',
  nextDay: 'L',
  lastWeek: 'L',
  nextWeek: 'L',
  sameElse: 'L',
};

userStatus = recipient => {
  if (recipient && recipient.status === 'away') {
    return 'yellow';
  } else if (recipient && recipient.status === 'online') {
    return Color.green;
  } else if (recipient && recipient.status === 'offline') {
    return 'grey';
  }
};

displayName = data =>
  _.get(data, 'Name', '')
    ? _.get(data, 'Name', '')
    : _.get(data, 'CompanyName', '');

TagLine = data => _.get(data, 'TagLine', '');

export default class ChatListView extends React.PureComponent {
  listDisplay = (data, onPressItem, navigation, colorCode, contactScreen) => (
    <TouchableOpacity
      style={styles.rowView}
      activeOpacity={1}
      onPress={() =>
        onPressItem(
          displayName(data),
          _.get(data, 'UserImage', ''),
          _.get(data, 'UserName', ''),
        )
      }>
      <TouchableOpacity
        style={[styles.imageView]}
        onPress={() => {
          //navigation.navigate('ContactProfileInfo', {id: data.UserName});
        }}>
        {!_.get(data, 'UserImage', '') ? (
          <View style={[styles.imageViewChr, {backgroundColor: Color.primary}]}>
            <Text style={styles.imageText}>{displayName(data).charAt(0)}</Text>
          </View>
        ) : (
          <ImageBackground
            source={Images.profilePhoto}
            style={styles.userImage}
            resizeMode="center">
            <Image
              source={{uri: _.get(data, 'UserImage', '')}}
              style={styles.userImage}
            />
            <View
              style={[styles.onlineView, {backgroundColor: userStatus(data)}]}
            />
          </ImageBackground>
        )}
      </TouchableOpacity>
      <View style={styles.listMessageView}>
        <Text style={[styles.userNameText, styles.nameText]} numberOfLines={1}>
          {displayName(data)}
        </Text>
        {contactScreen ? (
          <Text style={styles.userNameText} numberOfLines={1}>
            {TagLine(data)}
          </Text>
        ) : (
          <Text style={styles.messageText} numberOfLines={1}>
            {_.get(data, 'LastMessage', '')}
          </Text>
        )}
      </View>
      {!contactScreen ? (
        <View style={styles.dateView}>
          {data ? (
            <Moment
              calendar={calendarStrings}
              element={Text}
              style={styles.dateText}>
              {data.LastMessageDate}
            </Moment>
          ) : null}
          {data.UnreadCount ? (
            <View style={styles.unreadCountView}>
              <Text style={styles.unreadCountText}>
                {_.get(data, 'UnreadCount', '')}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </TouchableOpacity>
  );

  render() {
    const colorCode = Helper.getRandomColor();
    const {data, onPressItem, navigation, contactScreen} = this.props;
    if (!data) return <View />;
    return this.listDisplay(
      data,
      onPressItem,
      navigation,
      colorCode,
      contactScreen,
    );
  }
}
