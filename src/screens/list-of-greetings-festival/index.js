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
import {SpinnerView, TextInputView, EmptyComponent,LoadMoreComponent, Header} from '../../common/components';
import { McIcon } from '../../common/assets/vector-icon';
import { Appbar } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles'
import { getGreetingsFestivalEndpoint, getGreetingsFolderEndpoint } from '../../config/api-endpoint';
import NavigationHelper from '../../utils/navigation-helper';

export default class GreetingsFolder extends Component {
  state = {
    loadingData: false,
    item: [],
    isRefreshing: false,
    imageList: []
  };

  componentDidMount() {
    const {params} = this.props.route;
    if(params) {
      this.setState({
        imageList: params.imageList || []
      })
    }
    console.log(this.props);
   
  }

  renderItem = ({item}) => {
    if(!item.Image) return;
    return (
    <TouchableOpacity style={styles.itemView} onPress={()=> this.navigateListOfSpecificImage(item.Image)}>
      <Image source={{uri: item.Image}} style={{ height: 250, width: '100%'}} resizeMode={'cover'} />
    </TouchableOpacity>
  )};

  navigateListOfSpecificImage(image) {
    NavigationHelper.navigate(this.props.navigation,'Greetings', {image: image});
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
    const {loadingData, isRefreshing, loading, loadMore, imageList} = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header title={'Greetings Festivals'} left="back"  backPress={()=>navigation.goBack()} />
       
        {loadingData ? (
          <View style={styles.spinnerView}>
            <SpinnerView />
          </View>
        ) : null}
          <FlatList
            data={imageList}
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
      </SafeAreaView>
    );
  }
}