import React, {Component} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  RefreshControl,
  Image
} from 'react-native';
import _ from 'lodash';
import {Color} from '../../common/styles';
import APICaller from '../../utils/api-caller';
import {SpinnerView, TextInputView, EmptyComponent,LoadMoreComponent} from '../../common/components';
import { McIcon } from '../../common/assets/vector-icon';
import { Appbar } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles'
import { getGreetingsFolderEndpoint } from '../../config/api-endpoint';
import NavigationHelper from '../../utils/navigation-helper';

export default class GreetingsFestival extends Component {
  state = {
    loadingData: false,
    item: [],
    isRefreshing: false
  };

  componentDidMount() {
    this.getGreetingsFolder();
  }

  getGreetingsFolder() {
    const {userInfo, isRefreshing, loadMore} = this.state;
    if (!isRefreshing) {
      this.setState({
        loading: true,
      });
    }

    APICaller(
      getGreetingsFolderEndpoint,
      'GET',
    ).then(json => {
      console.log(json, 'json');
      if (json.data.Success === '1') {
        this.setState({
          loading: false,
          item: _.get(json,'data.Response',[]),
          isRefreshing: false,
          loadMore: false,
        });
       
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


  renderItem = ({item}) => {
    if(!item.FestivalName) return null;
    return (
    <TouchableOpacity style={styles.itemView} onPress={()=> this.navigateListOfSpecificImage(item)}>
      <View style={styles.overlayBg} /> 
      <Image source={{uri: item.Icon}} style={styles.iconImage} resizeMode={'cover'} />
      
      <Text style={styles.greetingText}>{item.FestivalName}</Text>
     
    </TouchableOpacity>
  )};

  navigateListOfSpecificImage(item) {
    NavigationHelper.navigate(this.props.navigation,'GreetingsFestival',{imageList:item.ImageList});
  }

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

  render() {
    const {loadingData, item,isRefreshing, loading, loadMore} = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <Appbar.Header style={{backgroundColor: Color.primary}}>
          <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
          <Appbar.Content title={'Greetings'} />
        </Appbar.Header>     
        {loadingData ? (
          <View style={styles.spinnerView}>
            <SpinnerView />
          </View>
        ) : null}
          <FlatList
            data={item}
            extraData={this.state}
            contentContainerStyle={styles.containerStyles}
            renderItem={this.renderItem}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() => this.listEmptyComponent(loading)}
            ListFooterComponent={() => this.listFooterComponent(loadMore)}
            onEndReachedThreshold={0.8}
            onEndReached={this.handleLoadMore.bind(this)}
          />
      </SafeAreaView>
    );
  }
}