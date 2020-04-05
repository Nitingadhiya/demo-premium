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

export default class ChatListView extends React.PureComponent {
  listDisplay = (data, onPressItem, navigation) => (
    <TouchableOpacity
      style={styles.rowView}
      activeOpacity={1}
      onPress={() =>
        onPressItem(
          data.id,
          data.recipient ? data.recipient.full_name : '',
          data.recipient ? data.recipient.profile_image_url : '',
          data.recipient ? data.recipient.id : '',
          data.recipient.user_name ? data.recipient.user_name : '',
        )
      }>
      {/* <View style={[styles.imageView, { backgroundColor: colorCode }]}>
        <Text style={styles.imageText}>{data.sender_name.charAt(0)}</Text>
      </View> */}
      <TouchableOpacity
        style={[styles.imageView]}
        onPress={() => {
          navigation.navigate('ContactProfileInfo', {id: data.recipient.id});
        }}>
        <ImageBackground
          source={Images.profilePhoto}
          style={styles.userImage}
          resizeMode="center">
          <Image
            source={{uri: _.get(data, 'recipient.profile_image_url')}}
            style={styles.userImage}
          />
          <View
            style={[
              styles.onlineView,
              {backgroundColor: userStatus(data.recipient)},
            ]}
          />
        </ImageBackground>
      </TouchableOpacity>
      <View style={styles.listMessageView}>
        {data.recipient.full_name ? (
          <Text style={styles.userNameText} numberOfLines={1}>
            {_.get(data, 'recipient.full_name', 'recipient.anonymized_name')}
          </Text>
        ) : null}

        <Text style={styles.messageText} numberOfLines={1}>
          {_.get(data, 'latest_message.body', '')}
        </Text>
      </View>
      <View style={styles.dateView}>
        {data ? (
          <Moment
            calendar={calendarStrings}
            element={Text}
            style={styles.dateText}>
            {data.updated_at}
          </Moment>
        ) : null}
        {data.unread_messages_count ? (
          <View style={styles.unreadCountView}>
            <Text style={styles.unreadCountText}>
              {_.get(data, 'unread_messages_count', '')}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  render() {
    //const colorCode = Helper.getRandomColor();
    const {data, onPressItem, navigation} = this.props;
    console.log(data, 'data');
    return this.listDisplay(data, onPressItem, navigation);
  }
}
