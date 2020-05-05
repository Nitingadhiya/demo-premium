import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  RefreshControl,
  Animated,
  TextInput,
  LayoutAnimation,
} from 'react-native';
import {Color, Images, Matrics} from '../../common/styles';
import {Appbar} from 'react-native-paper';
import {
  LoadMoreComponent,
  EmptyComponent,
  SpinnerView,
} from '../../common/components';
import _ from 'lodash';
import ChatListView from '../../components/chat-list-view';
import {chatListEndPoint} from '../../config/api-endpoint';
import Helper from '../../utils/helper';
import Events from '../../utils/events';

import APICaller from '../../utils/api-caller';
import styles from './styles';
import {McIcon, MIcon} from '../../common/assets/vector-icon';

const size = 30;

class ChatList extends Component {
  state = {
    isRefreshing: false,
    loading: true,
    loadMore: false,
    userInfo: null,
    from: 1,
    threadList: null,
    searchMargin: Matrics.screenWidth,
    searchText: null,
    totalCount: 0,
  };

  componentDidMount() {
    this.searchTextInputValue = '';
    this.onChangeTextDelayed = _.debounce(
      text => this.onChangeSearchText(text),
      300,
    );
    this.getUserInfo();

    Events.on('refresh-chat-list', 'refresh', () => {
      this.refreshingEventsMethod();
    });

    /* */
    global.socket.on('chat_list_refresh', data => {
      this.refreshingEventsMethod();
    });
  }

  refreshingEventsMethod() {
    this.state.isRefreshing = true;
    this.fetchChatThread('', 1, size);
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    await this.setState({userInfo: userInfo});
    if (userInfo) {
      const {from} = this.state;
      this.fetchChatThread('', from, size);
    }
  }

  onChangeSearchText(text) {
    this.searchTextInputValue = text;
    this.resetSearch();
    this.fetchChatThread(text, 1, size);
  }

  resetSearch() {
    this.setState({
      threadList: [],
      from: 1,
    });
  }

  fetchChatThread(search, from, size) {
    const {userInfo, isRefreshing, loadMore} = this.state;
    if (!isRefreshing && !loadMore) {
      this.setState({
        loading: true,
      });
    }
    APICaller(
      chatListEndPoint(userInfo.UserName, search, from, size),
      'GET',
    ).then(json => {
      //console.log(json, 'json');
      if (json.data.Success === '1') {
        if (isRefreshing) {
          this.updateData(json, false);
          // return;
        } else {
          this.updateData(json, true);
        }
      } else {
        this.setState({
          threadList: [],
          errorMessage: json.data.Message,
          loading: false,
          isRefreshing: false,
          loadMore: false,
        });
      }
    });
  }

  updateData(json, bool) {
    if (bool) {
      this.setState({
        threadList: _.concat(
          this.state.threadList,
          _.get(json, 'data.Response', []),
        ),
        from: this.state.from + size,
      });
    } else {
      this.setState({
        threadList: _.get(json, 'data.Response', []),
        from: 1,
      });
    }
    this.setState({
      loading: false,
      isRefreshing: false,
      loadMore: false,
      totalCount: _.get(json, 'data.TotalCount', ''),
    });
  }

  messagePressItem = (displayName, image, recieverName) => {
    this.props.navigation.navigate('ChatMessage', {
      displayName,
      image,
      recieverName,
    });
  };

  renderItem = ({item}) => (
    <ChatListView
      data={item}
      onPressItem={this.messagePressItem}
      navigation={this.props.navigation}
    />
  );

  async onRefresh() {
    await this.setState({
      isRefreshing: true,
      //threadList: [],
    });
    this.secondTextInput.clear();
    this.fetchChatThread(this.searchTextInputValue, 1, size);
  }

  listEmptyComponent = loadingData => {
    if (loadingData) {
      return <View />;
    }
    return <EmptyComponent message={'No Chat Message Found'} />;
  };

  listFooterComponent = loadMore => {
    return <LoadMoreComponent loadMore={loadMore} />;
  };

  handleLoadMore = async () => {
    if (!this.state.loadMore && !this.state.isRefreshing) {
      await this.setState({
        loadMore: true,
      });
      if (this.state.totalCount > _.size(this.state.threadList)) {
        this.fetchChatThread(this.searchTextInputValue, this.state.from, size); // method for API call
      } else {
        this.setState({
          loadMore: false,
        });
      }
    }
  };

  newThread = navigate => (
    <TouchableOpacity
      style={styles.addThreadButtonView}
      onPress={() => navigate('ContactList')} // Contact
    >
      <McIcon
        name="account-plus"
        size={Matrics.ScaleValue(25)}
        type={'solid'}
        color={Color.white}
      />
    </TouchableOpacity>
  );

  searchBarOpen() {
    LayoutAnimation.spring();
    if (this.state.searchMargin > 0) {
      this.secondTextInput.focus();
      this.setState({searchMargin: 0, he: this.state.he + 15});
    } else {
      this.secondTextInput.blur();
      this.setState({
        searchMargin: Matrics.screenWidth,
        he: this.state.he + 15,
      });
    }
  }

  clearSearchText() {
    this.resetSearch();
    this.secondTextInput.clear();
    this.fetchChatThread('', 1, size);
  }

  render() {
    const {
      isRefreshing,
      loading,
      loadMore,
      threadList,
      searchText,
    } = this.state;
    const {navigation} = this.props;
    return (
      <View style={styles.viewContainer}>
        <Appbar.Header style={styles.headerBg}>
          <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
          <Appbar.Content title={'Chat'} />
          <Appbar.Action icon="magnify" onPress={() => this.searchBarOpen()} />
          <Animated.View
            style={[
              styles.animatedView,
              {marginLeft: this.state.searchMargin},
            ]}>
            <TouchableOpacity
              onPress={() => this.searchBarOpen()}
              style={{position: 'absolute', zIndex: 1, left: 15, top: 13}}>
              <MIcon
                name="keyboard-arrow-left"
                size={25}
                color={Color.primary}
              />
            </TouchableOpacity>

            <TextInput
              style={styles.textInputCss}
              placeholder="Search..."
              placeholderTextColor="grey"
              allowFontScaling={false}
              ref={input => {
                this.secondTextInput = input;
              }}
              value={searchText}
              onChangeText={this.onChangeTextDelayed}
            />
            <TouchableOpacity
              onPress={() => this.clearSearchText()}
              style={styles.clearSearchIcon}>
              <MIcon name="close" size={22} color={Color.primary} />
            </TouchableOpacity>
          </Animated.View>
        </Appbar.Header>
        <View style={{flex: 1}}>
          {loading ? (
            <View style={styles.spinnerView}>
              <SpinnerView />
            </View>
          ) : null}
          <FlatList
            data={threadList}
            extraData={this.state}
            contentContainerStyle={styles.containerStyles}
            renderItem={this.renderItem}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() => this.listEmptyComponent(loading)}
            ListFooterComponent={() => this.listFooterComponent(loadMore)}
            onEndReachedThreshold={0.8}
            onEndReached={this.handleLoadMore.bind(this)}
          />
        </View>
        {this.newThread(navigation.navigate)}
      </View>
    );
  }
}

export default ChatList;
