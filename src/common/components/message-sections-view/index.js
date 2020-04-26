import React from 'react';
import {View, Text, SectionList} from 'react-native';
import _ from 'lodash';
import Moment from 'react-moment';
import Styles from './styles';
import Helper from '../../../utils/helper';
import {Color, Matrics} from '../../styles';

const timeCalendarStrings = {
  lastDay: 'LT',
  sameDay: 'LT',
  nextDay: 'LT',
  lastWeek: 'LT',
  nextWeek: 'LT',
  sameElse: 'LT',
};

userStatus = recipient => {
  if (recipient && recipient.status === 'away') {
    return Color.orangish;
  } else if (recipient && recipient.status === 'online') {
    return Color.green;
  } else if (recipient && recipient.status === 'offline') {
    return Color.darkGray;
  }
};

export default class MessageSectionsView extends React.PureComponent {
  state = {
    headerDate: '',
  };
  setcolor(senderId, userId, bg) {
    const id = senderId !== userId ? true : false;
    if (bg === 'background')
      return {backgroundColor: id ? Color.white : '#efffff'};
    if (bg === 'time')
      return {color: id ? Color.greyishBrown30 : Color.greyishBrown30};
    return {color: id ? Color.black30 : Color.black30};
  }

  _onViewableItemsChanged = (
    info = {
      viewableItems: {
        key,
        isViewable,
        item: {columns},
        index,
        section,
      },
      changed: {
        key,
        isViewable,
        item: {columns},
        index,
        section,
      },
    },
  ) => {
    const getDate = _.get(
      _.last(info.viewableItems, `[${info.viewableItems.length}]section.title`),
      'section.title',
      '',
    );

    if (this.state.headerDate !== getDate) {
      this.setState({
        headerDate: getDate,
      });
    }
    // you will see here the current visible items from top to bottom...
    //Reactotron.log(info.viewableItems);
  };

  listDisplay = (
    messages,
    onRefresh,
    userId,
    Ref,
    calendarStrings,
    displayName,
  ) => (
    <SectionList
      ref={Ref}
      onViewableItemsChanged={this._onViewableItemsChanged}
      renderItem={({item, index, section}) => (
        <View key={`${index.toString()}`} style={Styles.messageBody}>
          <View
            style={[
              {
                alignSelf:
                  _.toLower(item.Sender) !== _.toLower(userId)
                    ? 'flex-start'
                    : 'flex-end',
                flexDirection: 'row',
              },
            ]}>
            <View
              style={[
                Styles.innerMessageBody,
                this.setcolor(item.Sender, userId, 'background'),
              ]}>
              {item.Sender !== userId ? (
                <Text style={Styles.senderName}>{displayName}</Text>
              ) : null}
              <Text
                style={[
                  Styles.messageText,
                  this.setcolor(item.Sender, userId),
                ]}>
                {item.ChatMessage}
              </Text>
              <View style={Styles.dateView}>
                <Moment
                  calendar={timeCalendarStrings}
                  element={Text}
                  style={[
                    Styles.dateText,
                    this.setcolor(item.Sender, userId, 'time'),
                  ]}>
                  {item.EntryDate}
                </Moment>
              </View>
            </View>
          </View>
        </View>
      )}
      renderSectionFooter={({section: {title}}) => (
        <View style={Styles.renderHeaderView}>
          <Moment
            calendar={calendarStrings}
            element={Text}
            style={[Styles.textTitle]}>
            {title}
          </Moment>
        </View>
      )}
      inverted={true}
      // invertStickyHeaders={true}
      // stickySectionHeadersEnabled={true}
      sections={messages}
      keyExtractor={(item, index) => item + index}
      automaticallyAdjustContentInsets={true}
      scrollEventThrottle={100}
      onEndReachedThreshold={0.8}
      onEndReached={onRefresh}
      bounces={false}
    />
  );

  render() {
    const {data, onRefresh, userId, Ref, displayName} = this.props;
    const {headerDate} = this.state;
    const calendarStrings = {
      lastDay: '[Yesterday at] LT',
      sameDay: '[Today at] LT',
      nextDay: 'DD MMM YYYY',
      lastWeek: 'DD MMM YYYY',
      nextWeek: 'DD MMM YYYY',
      sameElse: 'DD MMM YYYY',
    };
    return (
      <View style={{flex: 1}}>
        {headerDate ? (
          <View style={Styles.renderHeaderViewStyles}>
            <Moment
              calendar={calendarStrings}
              element={Text}
              style={[Styles.headerDate]}>
              {headerDate}
            </Moment>
          </View>
        ) : null}
        {userId
          ? this.listDisplay(
              data,
              onRefresh,
              userId,
              Ref,
              calendarStrings,
              displayName,
            )
          : null}
      </View>
    );
  }
}
