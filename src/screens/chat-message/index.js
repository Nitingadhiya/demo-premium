import React, {Component} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {SpinnerView} from '../../common/components';
import _ from 'lodash';
import moment from 'moment';
import {ApplicationStyles, Matrics, Images, Color} from '../../common/styles';
import {Appbar} from 'react-native-paper';
import styles from './styles';
import {getChatHistoryEndpoint} from '../../config/api-endpoint';
import Events from '../../utils/events';
import APICaller from '../../utils/api-caller';
import AsyncStorage from '@react-native-community/async-storage';
import MessageSectionsView from '../../common/components/message-sections-view';
import MessageTextInputView from '../../common/components/message-sections-view/message-textInputBar';
import {MIcon} from '../../common/assets/vector-icon';
import Helper from '../../utils/helper';

let self;
const size = 10;
class ChatMessage extends Component {
  state = {
    loading: false,
    dataFound: false,
    userId: null,
    fullName: null,
    profile_image_url: null,
    messages: [],
    headerDate: new Date(),
    isRefreshing: false,
    validationMessage: '',
    contactStatusVisible: false,
    phoneNumber: null,
    userInfo: null,
    rUserName: null,
    from: 1,
    displayName: null,
    recieverName: null,
    isRefreshing: false,
  };

  componentDidMount() {
    self = this;
    this.tempArrMessage = [];
    const {recieverName, image, displayName} = this.props.route.params;
    console.log(this.props.route.params, 'receiver');

    this.setState({
      profile_image_url: image,
      recieverName: recieverName,
      displayName: displayName,
    });

    this.getUserInfo();

    global.socket.on('chat', responsedata => {
      console.log(responsedata, 'data');
      const user = {
        id: this.state.rUserName,
        profile_image_url: this.state.profile_image_url,
        full_name: 'Arkesh Korat',
      };
      const data = {
        id: null,
        body: responsedata.message,
        sent_at: moment
          .utc(new Date(), 'YYYY-MM-DD HH:mm:ss')
          .format('YYYY-MM-DD HH:mm:ss'),
        user,
      };
      console.log(data, 'ddd');
      this.tempArrMessage.unshift(data);
      this.groupMessage(this.tempArrMessage);
    });

    // this.pageNo = 1;
    // this.rId = rId;
    // //if (id) this.getMessage(id);
    // global.threadId = id;
    // AsyncStorage.getItem('userInfo').then(res => {
    //   if (!res) return;
    //   const user = JSON.parse(res);
    //   this.setState({
    //     userId: user.id,
    //     fullName: user.full_name,
    //     profile_image_url: user.profile_image_url,
    //   });
    // });
    // Events.on('newMessage', 'messages', data => {
    //   //new message display from notification
    //   if (!data) return;
    //   this.tempArrMessage.unshift(data);
    //   this.groupMessage(this.tempArrMessage);
    // });

    // Events.on('messageRefresh', 'messages', data => {
    //   this.pageNo = 1;
    //   this.getMessage(id);
    // });
    //this.fetchAccountInfo(this.rId);
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    await this.setState({
      userInfo,
    });
    if (userInfo) {
      this.fetchChatHistory();
    }
  }

  fetchChatHistory() {
    const {userInfo, from, recieverName, isRefreshing} = this.state;
    console.log(
      getChatHistoryEndpoint(userInfo.UserName, recieverName, from, size),
    );
    APICaller(
      getChatHistoryEndpoint('admin', recieverName, from, size),
      'GET',
    ).then(json => {
      console.log(json);

      if (json.data.Success === '1') {
        this.setState({
          loading: false,
          // messages: _.concat(
          //   this.state.message,
          //   _.get(json, 'data.Response', []),
          // ),
          from: this.state.from + 10,
          totalCount: _.get(json, 'data.TotalCount', ''),
        });
        if (!isRefreshing) {
          this.tempArrMessage = _.get(json, 'data.Response', []);
          this.groupMessage(this.tempArrMessage);
        } else {
          data.map(res => this.tempArrMessage.push(res));
          this.groupMessage(this.tempArrMessage);
        }
      } else {
        this.setState({
          messages: [],
          errorMessage: json.data.Message,
          loading: false,
          isRefreshing: false,
          loadMore: false,
        });
      }
    });
  }

  componentWillUnmount() {
    const previousMessage = {
      thread_id: global.threadId,
      body: _.get(_.last(_.sortBy(this.tempArrMessage, 'sent_at')), 'body'),
    };
    Events.trigger('refreshConversionList', previousMessage);
    global.threadId = '';
  }

  moreOptionIcon() {
    this.setState({
      contactStatusVisible: true,
    });
  }

  loadingView(isVisible) {
    this.setState({
      loading: isVisible,
    });
  }

  openDialPad() {
    Helper.openEmail('Tel', this.state.phoneNumber);
  }

  // getMessage(id) {
  //   const {isRefreshing} = this.state;
  //   if (!isRefreshing) {
  //     this.loadingView(true);
  //   } else {
  //     this.isRefresh = true;
  //   }
  //   APICaller(
  //     `${Http.getMessageEndpoint(id, this.pageNo)}`,
  //     'GET',
  //     global.apiToken,
  //   ).then(json => {
  //     if (json.status && json.status !== GlobalVar.responseSuccess) {
  //       const errors = json.data.errors;
  //       Events.trigger('toast', errors);
  //       this.loadingView(false);
  //       return;
  //     }
  //     const response = json.data;

  //     if (response.data.length === 0) {
  //       this.setState({
  //         dataFound: true,
  //         messages: [],
  //         isRefreshing: false,
  //       });
  //     }
  //     const data = response.data;
  //     if (!isRefreshing) {
  //       this.tempArrMessage = response.data;
  //       this.groupMessage(this.tempArrMessage);
  //     } else {
  //       data.map(res => this.tempArrMessage.push(res));
  //       this.groupMessage(this.tempArrMessage);
  //     }

  //     this.pageNo = response.meta.current_page + 1;
  //     this.lastPage = response.meta.last_page;
  //     this.loadingView(false);
  //     if (!this.isRefresh) {
  //       // this.scrollToBottom();
  //       this.isRefresh = false;
  //     }
  //   });
  // }

  groupMessage(data) {
    console.log(data, 'DDD');
    let arr = [];
    console.log(data);
    const groupMessage = _.groupBy(data, message =>
      moment(message.sent_at).format('YYYY-MM-DD'),
    );
    console.log(groupMessage);

    _.map(groupMessage, (msg, date) =>
      arr.push({
        title: moment(date).format('YYYY-MM-DD'),
        data: msg,
      }),
    );
    console.log(data, 'dta');
    this.setState({
      messages: arr,
      dataFound: true,
      isRefreshing: false,
    });
  }

  textInputChange = value => {
    this.setState({
      validationMessage: _.trim(value),
      messageText: value,
    });
  };

  onSendMessage(messageText, validationMessage) {
    if (messageText === this.textMessage) return;
    // if (!global.threadId) return;
    if (!messageText) return;
    this.textMessage = messageText;
    //this.loadingView(true);

    const msg = {
      ID: null,
      ChatMessage: messageText,
      EntryDate: moment
        .utc(new Date(), 'YYYY-MM-DD HH:mm:ss')
        .format('YYYY-MM-DD HH:mm:ss'),
      Document: '',
      Sender: userInfo.UserName,
      Receiver: this.state.recieverName,
    };
    this.tempArrMessage.unshift(msg);
    console.log(this.tempArrMessage, 'tempArrMessage');
    this.groupMessage(this.tempArrMessage);
    // this.scrollToBottom();

    // const body = {
    //   body: validationMessage,
    // };
    var data = {
      fromUser: userInfo.UserName,
      toUser: this.state.recieverName,
      message: messageText,
    };
    // console.log(data, 'data');
    global.socket.emit('chat', data);

    // APICaller(
    //   `${Http.messageEndpoint(global.threadId)}`,
    //   'POST',
    //   global.apiToken,
    //   body,
    // ).then(json => {
    //   this.textMessage = '';
    //   if (
    //     (json.status && json.status === GlobalVar.responseInternalServerCode) ||
    //     json.status === GlobalVar.responseInvalidCode
    //   ) {
    //     const errors = json.data.errors;
    //     Events.trigger('toast', errors);
    //     this.loadingView(false);
    //     return;
    //   }
    // });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.scrollView) {
        this.scrollView.scrollToLocation({
          animated: true,
          sectionIndex: 0,
          itemIndex: 0,
          //viewOffset: 28 // height of section header
        });
      }
    }, 500);
  }

  async onRefresh() {
    if (!this.state.isRefreshing) {
      await this.setState({
        isRefreshing: true,
        isLoadingEarlier: true,
      });
      if (this.lastPage >= this.pageNo) {
        //this.getMessage(global.threadId); // method for API call
        this.loadingView(false);
      } else {
        this.setState({
          isRefreshing: false,
        });
      }
    }
  }
  // onSwipeRight = navigation => {
  //   navigation.goBack();
  // };

  render() {
    const {navigation} = this.props;
    const {
      loading,
      messages,
      userId,
      contactStatusVisible,
      profile_image_url,
    } = this.state;
    console.log(messages);
    return (
      <View style={styles.textViewStyle}>
        <Appbar.Header style={styles.headerBg}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={'Chat Message'} />
          {profile_image_url ? (
            <Image
              source={{uri: profile_image_url}}
              style={styles.profilePhoto}
            />
          ) : (
            <View />
          )}
        </Appbar.Header>
        <View style={styles.modalViewContainer}>
          <KeyboardAvoidingView
            behavior={Helper.keyboardBehavior()}
            keyboardVerticalOffset={Helper.verticalOffset()}
            style={styles.keyboardScroll}>
            <MessageSectionsView
              data={messages}
              onRefresh={() => this.onRefresh()}
              userId={userInfo.UserName}
              Ref={r => {
                this.scrollView = r;
              }}
            />
            <MessageTextInputView
              onSendMessage={(messageText, validationMessage) =>
                this.onSendMessage(messageText, validationMessage)
              }
            />
            {/* {contactStatusVisible ? (
              <ContactStatus
                visible={true}
                rId={this.rId}
                onBackRequest={() =>
                  this.setState({ contactStatusVisible: false })
                }
              />
            ) : null} */}
          </KeyboardAvoidingView>
        </View>
        {loading ? <SpinnerView /> : null}
      </View>
    );
  }
}
export default ChatMessage;
