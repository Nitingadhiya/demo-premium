import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Keyboard,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {TextInputView, SpinnerView} from '../../common/components';
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import {Color, Matrics} from '../../common/styles';
import styles from './styles';
import Helper from '../../utils/helper';
import APICaller from '../../utils/api-caller';
import {
  getCityEndPoint,
  getAreasEndPoint,
  getRoadsEndPoint,
  getLandMarksEndPoint,
} from '../../config/api-endpoint';
import NavigationHelper from '../../utils/navigation-helper';

class PickAddressModal extends Component {
  state = {
    searchTextValue: null,
    filterCityList: null,
  };

  componentDidMount() {
    const {modalType} = this.props;
    if (modalType === 'Area') {
      this.getArea();
    }
    if (modalType === 'Landmark') {
      this.getLandMark();
    }
    if (modalType === 'Road') {
      this.getRoad();
    }
    if (modalType === 'City') {
      this.getCityList();
    }
    if (modalType === 'Business') {
      this.getBusinessList();
    }
    setTimeout(() => {
      if (this.searchTextInput) this.searchTextInput.focus();
    }, 400);
  }

  replaceCustomExpression = title => {
    // console.warn(title.replace(/[^a-zA-Z 0-9 | ]/ig, ""));
    const result = title.replace(/  +/g, ' '); // Replace multiple whitespace to a whitespace
    return result.replace(/[^a-zA-Z 0-9 | ]/gi, '').toLowerCase();
  };

  changeTextForsearch(text) {
    const {modalType} = this.props;
    if (modalType === 'Landmark') {
      const epi = this.state.landmarkList.filter(land =>
        this.replaceCustomExpression(land.Landmark).includes(
          this.replaceCustomExpression(text),
        ),
      );
      this.setState({landmarkSearch: text, filterLandmarkList: epi});
    }
    if (modalType === 'Area') {
      const epi = this.state.areaList.filter(land =>
        this.replaceCustomExpression(land.Area).includes(
          this.replaceCustomExpression(text),
        ),
      );
      this.setState({areaSearch: text, filterAreaList: epi});
    }
    if (modalType === 'Road') {
      const epi = this.state.roadList.filter(land =>
        this.replaceCustomExpression(land.Road).includes(
          this.replaceCustomExpression(text),
        ),
      );
      this.setState({roadSearch: text, filterRoadList: epi});
    }

    if (modalType === 'City') {
      const epi = this.state.cityList.filter(city =>
        this.replaceCustomExpression(city.CityName).includes(
          this.replaceCustomExpression(text),
        ),
      );
      this.setState({citySearch: text, filterCityList: epi});
    }

    if (modalType === 'Business') {
      console.log(this.state.businessList, 'llik');
      const epi = this.state.businessList.filter(business =>
        this.replaceCustomExpression(city.CodeDesc).includes(
          this.replaceCustomExpression(text),
        ),
      );
      this.setState({businessSearch: text, filterBusinessList: epi});
    }
  }

  saveSearchValue() {
    const {modalType} = this.props;
    if (modalType === 'Landmark') {
      this.props.closeModalPress(modalType, this.state.landmarkSearch);
    }
    if (modalType === 'Area') {
      this.props.closeModalPress(modalType, this.state.areaSearch);
    }
    if (modalType === 'Road') {
      this.props.closeModalPress(modalType, this.state.roadSearch);
    }
    if (modalType === 'City') {
      this.props.closeModalPress(modalType, this.state.citySearch);
    }
    if (modalType === 'Business') {
      this.props.closeModalPress(modalType, this.state.businessSearch);
    }
  }

  getLandMark() {
    APICaller(getLandMarksEndPoint, 'GET').then(json => {
      if (json.data.Success === 1 || json.data.Success === '1') {
        let jsonLandmark = json.data.Response;
        let arr = [];
        jsonLandmark.map(res => {
          if (res.Landmark) {
            arr.push(res);
          }
        });
        this.setState({landmarkList: arr, filterLandmarkList: arr});
      }
    });
  }

  getRoad() {
    APICaller(getRoadsEndPoint, 'GET').then(json => {
      if (json.data.Success === 1 || json.data.Success === '1') {
        const jsonRoad = json.data.Response;
        let arr = [];
        jsonRoad.map(res => {
          if (res.Road) {
            arr.push(res);
          }
        });
        this.setState({roadList: arr, filterRoadList: arr});
      }
    });
  }

  getArea() {
    APICaller(getAreasEndPoint, 'GET').then(json => {
      if (json.data.Success === 1 || json.data.Success === '1') {
        const jsonArea = json.data.Response;
        const arr = [];
        jsonArea.map(res => {
          if (res.Area) {
            arr.push(res);
          }
        });
        this.setState({areaList: arr, filterAreaList: arr});
      }
    });
  }

  getCityList = () => {
    APICaller(getCityEndPoint, 'GET').then(json => {
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

  getBusinessList = () => {
    console.log('pickkk');
    const endPoint = 'GetBusinessList';
    APICaller(`${endPoint}`, 'GET').then(json => {
      console.log(json, 'jjj');
      if (json.data.Success === '0' || json.data.Success === 0) {
        Alert.alert('Alert', json.data.Message);
      }
      this.setState({
        loadingData: false,
      });
      if (json.data.Success === '1') {
        console.log(json.data.Response, 'reso');
        //const indexValue = _.get(json, 'data.Response[0].CodeDesc');
        this.setState({
          businessList: json.data.Response,
          filterBusinessList: json.data.Response,
          // selectedBusiness: indexValue,
        });
      }
    });
  };

  loadModalFlatListData() {
    const {modalType} = this.props;
    if (modalType === 'Landmark') {
      return this.state.filterLandmarkList; //this.state.landmarkList;
    }
    if (modalType === 'Area') {
      return this.state.filterAreaList; //this.state.areaList;
    }
    if (modalType === 'Road') {
      return this.state.filterRoadList; //this.state.roadList;
    }
    if (modalType === 'City') {
      return this.state.filterCityList; //this.state.roadList;
    }
    if (modalType === 'Business') {
      console.log(this.state.filterBusinessList, 'BBB');
      return this.state.filterBusinessList; //this.state.roadList;
    }
  }

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

  // saveSearchValue() {
  //   this.setState({cityText: this.state.citySearch});
  //   this.props.closeModalPress(this.state.citySearch);
  // }

  render() {
    const {searchPlaceholderText, closeModalPress, modalType} = this.props;
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
              ref={input => {
                this.searchTextInput = input;
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
            <FlatList
              data={this.loadModalFlatListData()}
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
                    if (modalType === 'City') {
                      this.props.closeModalPress(modalType, item.CityName);
                    }
                    if (modalType === 'Area') {
                      this.props.closeModalPress(modalType, item.Area);
                    }
                    if (modalType === 'Road') {
                      this.props.closeModalPress(modalType, item.Road);
                    }
                    if (modalType === 'Landmark') {
                      this.props.closeModalPress(modalType, item.Landmark);
                    }
                    if (modalType === 'Business') {
                      this.props.closeModalPress(modalType, item.CodeDesc);
                    }
                  }}>
                  <Text style={{color: '#333'}}>
                    {modalType === 'Area' && item.Area}
                    {modalType === 'Landmark' && item.Landmark}
                    {modalType === 'Road' && item.Road}
                    {modalType === 'City' && item.CityName}
                    {modalType === 'Business' && item.CodeDesc}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  }
}
export default PickAddressModal;
