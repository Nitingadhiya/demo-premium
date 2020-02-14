import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {TextInputView, SpinnerView} from '../../common/components';
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import {Color, Matrics} from '../../common/styles';
import styles from './styles';
import Helper from '../../utils/helper';
import APICaller from '../../utils/api-caller';
import {getCityEndPoint} from '../../config/api-endpoint';
import NavigationHelper from '../../utils/navigation-helper';

class CityListModal extends Component {
  state = {
    searchTextValue: null,
    filterCityList: null,
  };

  componentDidMount() {
    this.getCityList();
  }

  replaceCustomExpression = title => {
    // console.warn(title.replace(/[^a-zA-Z 0-9 | ]/ig, ""));
    const result = title.replace(/  +/g, ' '); // Replace multiple whitespace to a whitespace
    return result.replace(/[^a-zA-Z 0-9 | ]/gi, '').toLowerCase();
  };

  changeTextForsearch(text) {
    const epi = this.state.cityList.filter(city =>
      this.replaceCustomExpression(city.CityName).includes(
        this.replaceCustomExpression(text),
      ),
    );
    this.setState({citySearch: text, filterCityList: epi});
  }

  getCityList = () => {
    console.log('Lppk');
    APICaller(getCityEndPoint, 'GET').then(json => {
      console.log(json, 'json');
      if (json.data.Success === '0' || json.data.Success === 0) {
        Alert.alert('Alert', json.data.Message);
      }
      this.setState({
        loadingData: false,
      });
      if (json.data.Success === '1') {
        this.setState({
          cityList: json.data.Response,
          filterCityList: json.data.Response,
        });
      }
    });
  };

  noItemFound = () => {
    return (
      <View
        style={{
          flex: 1,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: 'grey', fontSize: 16}}>No items found</Text>
      </View>
    );
  };

  saveSearchValue() {
    this.setState({cityText: this.state.citySearch});
    this.props.closeModalPress(this.state.citySearch);
  }

  render() {
    const {searchPlaceholderText, closeModalPress} = this.props;
    const {searchTextValue, filterCityList, citySearch} = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={true}
        onRequestClose={closeModalPress}>
        <View style={{marginTop: 5, flex: 1}}>
          <View style={{flexDirection: 'row', padding: 5}}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 60,
                flexDirection: 'row',
              }}
              onPress={closeModalPress}>
              <MIcon name="arrow-back" size={20} color={Color.black} />
              <Text style={{color: '#000', fontWeight: 'bold'}}>Back</Text>
            </TouchableOpacity>
            <TextInput
              placeholder={searchPlaceholderText}
              value={searchTextValue}
              onChangeText={text => this.changeTextForsearch(text)}
              style={{
                height: 40,
                width: Matrics.screenWidth - 120,
                borderWidth: 1,
                padding: 0,
                paddingLeft: 10,
                borderColor: '#d3d3d3',
              }}
            />
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 50,
              }}
              onPress={() => this.saveSearchValue()}>
              <Text style={{color: '#000', fontWeight: 'bold'}}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            {filterCityList && filterCityList.length ? (
              <FlatList
                data={filterCityList}
                keyboardShouldPersistTaps={'handled'}
                contentContainerStyle={{flexGrow: 1}}
                ListEmptyComponent={() => this.noItemFound()}
                style={{flex: 1}}
                extraData={this.state}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={{
                      height: 40,
                      flex: 1,
                      borderTopWidth: 1,
                      justifyContent: 'center',
                      padding: 5,
                      borderColor: '#d3d3d3',
                    }}
                    onPress={() => {
                      this.props.closeModalPress(item.CityName);
                      // if (this.state.modalType === 'City') {
                      //   this.selectedModal('City', item.CityName);
                      // }
                    }}>
                    <Text style={{color: '#333'}}>{item.CityName}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : null}
          </View>
        </View>
      </Modal>
    );
  }
}
export default CityListModal;
