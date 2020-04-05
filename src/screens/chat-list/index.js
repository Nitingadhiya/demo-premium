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
} from 'react-native';
import {Color, Images, Matrics} from '../../common/styles';
import {
  Header,
  LoadMoreComponent,
  EmptyComponent,
} from '../../common/components';
import ChatListView from '../../components/chat-list-view';
import styles from './styles';
import {FIcon, McIcon} from '../../common/assets/vector-icon';
// ASSETS
const conversationState = [
  {
    id: '1',
    recipient: {
      id: '1',
      full_name: 'Arkesh Korat (Web)',
      user_name: 'arkesh',
      updated_at: '2017-12-14T16:34:10',
      Message: 'I Like it',
      unread_messages_count: 1,
      profile_image_url: 'https://img.icons8.com/plasticine/2x/user.png',
    },
    latest_message: {
      body: 'Hi',
    },
  },
  {
    id: '2',
    recipient: {
      id: '2',
      full_name: 'Nitin Gadhiya (Admin)',
      user_name: 'anitin',
      updated_at: '2017-12-24T16:34:10',
      Message: 'I Like it',
      unread_messages_count: 1,
      profile_image_url: 'https://img.icons8.com/plasticine/2x/user.png',
    },
    latest_message: {
      body: 'Hello',
    },
  },
];

//= ===CLASS DECLARATION====//
class ChatList extends Component {
  state = {
    isRefreshing: false,
    loading: false,
    loadMore: false,
  };
  componentDidMount() {}

  messagePressItem = (id, sender_name, image, rId, user_name) => {
    this.props.navigation.navigate('ChatMessage', {
      id,
      sender_name,
      image,
      rId,
      user_name,
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
    this.pageNo = 1;
    await this.setState({
      isRefreshing: true,
    });
    //this.getConversationList(); // method for API call
  }

  listEmptyComponent = loadingData => {
    if (!loadingData) {
      return <View />;
    }
    return <EmptyComponent message={'No Conversations found'} />;
  };

  listFooterComponent = loadMore => {
    return <LoadMoreComponent loadMore={loadMore} />;
  };

  handleLoadMore = async () => {
    if (!this.state.loadMore && !this.state.isRefreshing) {
      await this.setState({
        loadMore: true,
      });
      if (this.lastPage >= this.pageNo) {
        this.getConversationList(); // method for API call
        this.loadingView(false);
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
      onPress={() => navigate('ActiveCampaignList')} // Contact
    >
      <McIcon
        name="account-plus"
        size={Matrics.ScaleValue(25)}
        type={'solid'}
        color={Color.white}
      />
    </TouchableOpacity>
  );

  // ----------->>>Render Method-------------->>>

  render() {
    const {isRefreshing, loading, loadMore} = this.state;
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.viewContainer}>
        <Header title={'Chat'} left="menu" />
        <FlatList
          data={conversationState}
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
          ListEmptyComponent={() => this.listEmptyComponent(dataFound)}
          ListFooterComponent={() => this.listFooterComponent(loadMore)}
          onEndReachedThreshold={0.8}
          onEndReached={this.handleLoadMore.bind(this)}
        />
        {this.newThread(navigate)}
        {loading ? <SpinnerView /> : null}
      </View>
    );
  }
}

export default ChatList;
