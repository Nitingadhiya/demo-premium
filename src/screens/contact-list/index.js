// LIBRARIES
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
  //Header,
  LoadMoreComponent,
  EmptyComponent,
  SpinnerView,
} from '../../common/components';
import _ from 'lodash';
import ChatListView from '../../components/chat-list-view';
import {contactListEndPoint} from '../../config/api-endpoint';
import Helper from '../../utils/helper';

import APICaller from '../../utils/api-caller';
import styles from './styles';
import {FIcon, McIcon, MIcon} from '../../common/assets/vector-icon';
// ASSETS
const size = 30;
//= ===CLASS DECLARATION====//
class ContactList extends Component {
  state = {
    isRefreshing: false,
    loading: true,
    loadMore: false,
    userInfo: null,
    from: 1,
    threadList: null,
    searchMargin: Matrics.screenWidth,
    searchText: null,
  };
  componentDidMount() {
    (this.totalCount = 0), (this.searchTextInputValue = '');
    this.onChangeTextDelayed = _.debounce(
      text => this.onChangeSearchText(text),
      200,
    );
    this.getUserInfo();
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
    if (!text) {
      this.setState({
        threadList: this.tempSaveList,
        from: this.tempFrom,
      });
      return;
    }
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
    if (!isRefreshing) {
      this.setState({
        loading: true,
      });
    }

    APICaller(
      contactListEndPoint(userInfo.UserName, search, from, size),
      'GET',
    ).then(json => {
      console.log(json, 'json');
      if (json.data.Success === '1') {
        this.setState({
          loading: false,
          threadList: _.concat(
            this.state.threadList,
            _.get(json, 'data.Response', []),
          ),
          from: this.state.from + size,
          isRefreshing: false,
          loadMore: false,
        });
        this.totalCount = _.get(json, 'data.TotalCount', '');
        if (!search) {
          this.tempSaveList = this.state.threadList;
          this.tempFrom = from + size;
        }
      } else {
        // if (from == 1) {
        //   this.setState({
        //     threadList: [],
        //   });
        // }
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
      contactScreen={true}
    />
  );

  async onRefresh() {
    await this.setState({
      isRefreshing: true,
      threadList: [],
    });
    this.clearSearchText(); // method for API call
  }

  listEmptyComponent = loadingData => {
    if (loadingData) {
      return <View />;
    }
    return <EmptyComponent message={'No Contacts found'} />;
  };

  listFooterComponent = loadMore => {
    return <LoadMoreComponent loadMore={loadMore} />;
  };

  handleLoadMore = async () => {
    if (!this.state.loadMore && !this.state.isRefreshing) {
      await this.setState({
        loadMore: true,
      });
      if (this.totalCount > _.size(this.state.threadList)) {
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
      this.contactTextInput.focus();
      this.setState({searchMargin: 0, he: this.state.he + 15});
    } else {
      this.contactTextInput.blur();
      this.setState({
        searchMargin: Matrics.screenWidth,
        he: this.state.he + 15,
      });
    }
  }

  clearSearchText() {
    this.resetSearch();
    this.contactTextInput.clear();
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
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={'Contacts'} />
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
                this.contactTextInput = input;
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
      </View>
    );
  }
}

export default ContactList;
