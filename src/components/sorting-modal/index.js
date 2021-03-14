import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  ScrollView
} from 'react-native';
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import {Color, Matrics} from '../../common/styles';
import styles from './styles';
import APICaller from '../../utils/api-caller';
import {
  getPartWiseFilterEndPoint,
} from '../../config/api-endpoint';
import Events from '../../utils/events';
import _ from 'lodash';
import MultiSlider from '@ptomasroos/react-native-multi-slider';


let selectPartArray = [];
let self;

let listArray = [{key: '3', label: 'Newly Added'}, {key: '1', label: 'Low to High'}, {key: '2', label: 'High to Low'}]

class SortModal extends Component {
  state = {
    complaintRegisterModal: false,
    compImages: null,
    filterKeyValue: null,
    filterType:[],
    selectedFilter: null,
    finalSelectedParts: [],
    selectSorting: null,
    minVal: 0,
    maxVal: 70000,
    fixedMinVal: 0,
    fixedMaxVal: 70000
  };
  componentDidMount() {
    self = this;
    Events.on('sortModal', 'sort toggle', res => {
      this.setState({complaintRegisterModal: true});
    });

    const {fromPrice, toPrice} = this.props;
    if(fromPrice) {
      this.setState({
        minVal: fromPrice,
        maxVal: toPrice || 70000
      })
    }
  //  this.fetchPartFilter();
  }

  fetchPartFilter() {
    APICaller(getPartWiseFilterEndPoint, 'GET').then(json => {
      this.setState({
        loadingData: false,
      });
      if (json.data) {
        const data = json.data;
        const keys = Object.keys(data);
        this.setState({
          filterType: keys,
          filterKeyValue: data,
          selectedFilter: keys[0]
        })
        //this.setState({compImages: json.data.Response});
      }
    });
  }


  checkSelectedCheckbox(key) {
    const { selectSorting } = this.state;
    if(selectSorting == key) {
      return "checkbox-marked"
    }
      return 'checkbox-blank-outline';
  }

  async pressSelectedCheckbox(key) {
    await this.setState({
      selectSorting: key,
      complaintRegisterModal: false,
    });

    let obj = {
      key: key,
      fromPrice: this.state.minVal,
      toPrice: this.state.maxVal 
    }

    Events.trigger('sorting-filter',obj);
  }

  changeSliderValue(val) {
    this.setState({minVal: val[0], maxVal: val[1]});
  }

  sliderOneValuesChangeFinish(val) {
    let obj = {
      key: this.state.selectSorting,
      fromPrice: val[0],
      toPrice: val[1]
    }
    Events.trigger('sorting-filter',obj);
  }

  render() {
    const {filterType, complaintRegisterModal, filterKeyValue, minVal, maxVal,fixedMinVal, fixedMaxVal} = this.state;

    return (
      <View>
        <Modal
          transparent={true}
          visible={complaintRegisterModal}
          onRequestClose={() => {
            this.setState({complaintRegisterModal: false});
          }}>
          <View style={styles.modalView} activeOpacity={1}>
            
            <View style={styles.sortView}>
              <View style={styles.sortHeaderView}>
                <Text style={styles.sortText}>Sort</Text>

                <TouchableOpacity onPress={() => this.setState({complaintRegisterModal: false})}>
                  <MIcon name="close" size={20} color={Color.black} />
                </TouchableOpacity>
              </View>
              <View style={{ marginLeft: 10}}>
              <MultiSlider
                values={[minVal, maxVal]}
                allowOverlap={false}
                snapped
                minMarkerOverlapDistance={20}
                onValuesChange={(val)=> this.changeSliderValue(val)}
                min={fixedMinVal}
                max={fixedMaxVal}
                step={1000} 
                onValuesChangeFinish={(val) => this.sliderOneValuesChangeFinish(val)}
              />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5}}>
        <View>
          <Text style={{ color: Color.black30, fontSize: 14}}>Rs.{minVal}</Text>
        </View>
        <View>
          <Text style={{ color: Color.black30, fontSize: 14}}>Rs.{maxVal}</Text>
        </View>
      </View>
      </View>
              {listArray.map((res, index) =>
              <TouchableOpacity style={styles.listView} key={index} onPress={()=> this.pressSelectedCheckbox(res.key)}>
                <Text style={styles.listViewText}>{res.label}</Text>
                <McIcon name={this.checkSelectedCheckbox(res.key)} size={20} color={Color.charcoalGrey} />
              </TouchableOpacity>
              )}
            </View>
           
          </View>
        </Modal>
      </View>
    );
  }
}
export default SortModal;
