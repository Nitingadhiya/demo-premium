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
import {CommonActions} from '@react-navigation/native';
import {TextInputView, SpinnerView} from '../../common/components';
import {MIcon, Ionicons, McIcon} from '../../common/assets/vector-icon';
import {Color, Matrics} from '../../common/styles';
import styles from './styles';
import Helper from '../../utils/helper';
import APICaller from '../../utils/api-caller';
import {
  getPartWiseFilterEndPoint,
  getComplaintChargeEndPoint,
} from '../../config/api-endpoint';
import NavigationHelper from '../../utils/navigation-helper';
import Events from '../../utils/events';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash'

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
    selectSorting: null
  };
  componentDidMount() {
    self = this;
    Events.on('sortModal', 'sort toggle', res => {
      this.setState({complaintRegisterModal: true});
    });
  //  this.fetchPartFilter();
  }

  fetchPartFilter() {
    APICaller(getPartWiseFilterEndPoint, 'GET').then(json => {
      console.log(json,'json')
      this.setState({
        loadingData: false,
      });
      if (json.data) {
        const data = json.data;
        console.log(data,'data')
        const keys = Object.keys(data);
        console.log(keys);
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
    console.log(key,'key')
    await this.setState({
      selectSorting: key,
      complaintRegisterModal: false
    });
    Events.trigger('sorting-filter',key);
  }

  render() {
    const {filterType, complaintRegisterModal, filterKeyValue} = this.state;

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
