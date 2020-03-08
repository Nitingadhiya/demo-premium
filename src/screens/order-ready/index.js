// LIBRARIES
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Modal,
  RefreshControl,
} from 'react-native';
import _ from 'lodash';
// ASSETS
import APICaller from '../../utils/api-caller';
import {Images, Color, Matrics} from '../../common/styles';
import POrder from '../../components/pending-order';
import {Header} from '../../common/components';
import {getOrderListEndPoint} from '../../config/api-endpoint';
import Helper from '../../utils/helper';

let self;

class OrderReady extends Component {
  state = {
    orderItem: [],
    orderNotText: '',
    leadInfoModal: false,
    systemConfig: [],
    systemName: '',
    refreshing: false,
    loadingData: false,
  };

  componentDidMount() {
    self = this;
    this.getUserInfo();
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });
    this.getOrderList(userInfo.UserName);
  }

  getOrderList(userName) {
    if (!this.state.refreshing) this.setState({loadingData: true});
    APICaller(getOrderListEndPoint(userName), 'GET').then(json => {
      if (json.data.Success === 1 || json.data.Success === '1') {
        if (result.LoginType === '1') {
          this.setState({
            orderItem: _.filter(json.data.Response, {IsReady: 'True'}),
          });
        } else {
          this.setState({
            orderItem: json.data.Response,
          });
        }
      } else {
        this.setState({
          orderNotText: json.data.Message,
        });
      }
      this.setState({loadingData: false, refreshing: false});
    });
  }

  renderViewComment() {
    this.props.navigation.navigate('HomeScreen', {change: true});
  }

  renderSettings() {
    Alert.alert(
      'Alert',
      '',
      [
        {text: 'Edit', onPress: () => this.renderEdit()},
        {text: 'Delete', onPress: () => console.log('Delete')},
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  }

  renderEdit() {
    return (
      <View>
        <TextInput
          placeholder="Add Comment..."
          placeholderTextColor={Color.black}
          style={{marginLeft: Matrics.ScaleValue(20)}}
        />
        <Image
          source={Images.SendIcon}
          style={{alignSelf: 'center', marginRight: Matrics.ScaleValue(15)}}
        />
        />
      </View>
    );
  }

  renderItem = ({item}) => {
    return (
      <View style={styles.flatView}>
        <View style={{flexDirection: 'row'}}>
          <View>
            <View style={{justifyContent: 'center'}}>
              <Image source={Images.SideMenuIcon} style={styles.UserImage} />
            </View>
          </View>

          <View style={styles.userDetailView}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text style={styles.textStyle}>{item.Name}</Text>
              </View>
              <View>
                <Text style={styles.textStyle2}>{item.Time}</Text>
              </View>
              <View style={{marginTop: Matrics.ScaleValue(-3)}}>
                <TouchableOpacity onPress={this.renderSettings.bind(this)}>
                  <View style={styles.imageViewSetting}>
                    <Image
                      source={Images.SettingsIcon}
                      resizeMode="center"
                      style={{justifyContent: 'flex-end'}}
                    />
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text numberOfLines={1} style={styles.textStyle1}>
                {item.Message}
              </Text>
              <View style={styles.messageView} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  LeadInfo(lead) {
    this.setState({
      leadInfoModal: true,
      systemName: lead.SystemName,
      systemConfig: lead.SystemConfig.split(','),
    });
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getOrderList(this.state.userInfo.UserName);
  };
  // ----------->>>Render Method-------------->>>

  render() {
    const {orderNotText, refreshing} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header title="Order Ready" left="menu" />
        <ScrollView
          style={{padding: 10, backgroundColor: '#eee', flex: 1}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          {this.state.orderNotText ? (
            <View style={styles.noOrderView}>
              <Text style={styles.noOrderText}>{orderNotText}</Text>
            </View>
          ) : null}
          {this.state.orderItem.map((res, index) => {
            return (
              <POrder
                data={res}
                key={`${index.toString()}`}
                onPress={() => this.LeadInfo(res)}
              />
            );
          })}
          <View style={{marginBottom: 10}} />
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.leadInfoModal}
          onRequestClose={() => {
            this.setState({leadInfoModal: false});
          }}>
          <View
            style={{
              height: '100%',
              backgroundColor: 'rgba(0,0,0,00.5)',
              width: Matrics.screenWidth,
              //margin: 20,
              alignSelf: 'center',
              shadowColor: '#000',
              shadowOffset: {width: 5, height: 5},
              elevation: 8,
              alignItems: 'center',
              justifyContent: 'center',
              //marginTop: Matrics.screenHeight / 2 - 75,
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                // height: Matrics.ScaleValue(160),
                width: Matrics.screenWidth - 40,
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 40,
                  width: '100%',
                  borderColor: '#ccc',
                  borderBottomWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: 'black', fontSize: 16}}>Lead Info</Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  padding: 10,
                  width: '100%',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 16,
                    marginTop: 10,
                  }}>
                  <Text style={{fontWeight: 'bold'}}>
                    {this.state.systemName || 'No Lead info Found'}
                  </Text>{' '}
                </Text>

                {this.state.systemConfig.map(res => {
                  return (
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 14,
                        marginTop: 5,
                        textAlign: 'left',
                      }}>
                      {res.replace(/^\s+/g, '')}
                    </Text>
                  );
                })}
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: Color.primary,
                  height: 40,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => this.setState({leadInfoModal: false})}>
                <Text
                  style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

//= =====STYLES DECLARATION======//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  textStyle2: {
    fontSize: Matrics.ScaleValue(14),
    color: Color.lightGray,
    justifyContent: 'flex-end',
  },
  UserImage: {
    height: Matrics.ScaleValue(50),
    width: Matrics.ScaleValue(50),
    borderRadius: Matrics.ScaleValue(50 / 2),
  },
  textStyle: {
    fontSize: Matrics.ScaleValue(16),
    fontWeight: 'bold',
    color: Color.black,
    flex: 1,
  },
  textStyle1: {
    fontSize: Matrics.ScaleValue(13),
    color: Color.lightGray,
  },
  textinputViewStyle: {
    flexDirection: 'row',
    backgroundColor: Color.white,
    borderColor: Color.black,
    height: Matrics.ScaleValue(50),
    justifyContent: 'space-between',
    shadowColor: 'red',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.75,
    shadowRadius: 15,
    elevation: 1,
  },
  userDetailView: {
    justifyContent: 'space-around',
    flex: 3,
    marginLeft: Matrics.ScaleValue(10),
  },
  imageViewSetting: {
    paddingVertical: Matrics.ScaleValue(6),
    paddingHorizontal: Matrics.ScaleValue(12),
  },
  messageView: {
    borderBottomColor: Color.white,
    borderBottomWidth: 1,
    marginTop: Matrics.ScaleValue(5),
  },
  flatView: {
    padding: Matrics.ScaleValue(10),
    paddingRight: Matrics.ScaleValue(0),
  },
  textinputStyle: {
    marginLeft: Matrics.ScaleValue(20),
    fontSize: Matrics.ScaleValue(15),
    flex: 1,
  },
  sendIconStyle: {
    alignSelf: 'center',
    marginRight: Matrics.ScaleValue(15),
  },
  noOrderView: {
    flex: 1,
    justifyContent: 'center',
  },
  noOrderText: {
    fontSize: Matrics.ScaleValue(14),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OrderReady;
