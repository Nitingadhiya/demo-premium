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
import {MIcon, McIcon} from '../../common/assets/vector-icon';
import {Color, Matrics} from '../../common/styles';
import styles from './styles';
import Helper from '../../utils/helper';
import APICaller from '../../utils/api-caller';
import {
  getPartWiseFilterEndPoint,
} from '../../config/api-endpoint';
import NavigationHelper from '../../utils/navigation-helper';
import Events from '../../utils/events';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash'

let selectPartArray = [];
let selectCategoryArray = '';
let self;
class FilterModal extends Component {
  state = {
    filterProductModal: false,
    compImages: null,
    filterKeyValue: null,
    filterType:[],
    selectedFilter: null,
    finalSelectedParts: [],
    finalSelectedCategories: [],
    loadingData: true
  };
  componentDidMount() {
    self = this;
    Events.on('filterModal', 'filter toggle', res => {
      this.setState({filterProductModal: true});
    });

    Events.on('categorySelected', 'category selected', res => {
      console.log(res,'tess')
      selectCategoryArray = '';
      this.selectParts(res,'Categories');      
    });
    this.fetchPartFilter([]);
  }

  fetchPartFilter(partArray) {
    APICaller(getPartWiseFilterEndPoint(partArray, selectCategoryArray), 'GET').then(json => {
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
       
        if(this.filterKey) {
          this.checkFilterType(this.filterKey);
        }
        this.checkWait = false;
        //this.setState({compImages: json.data.Response});
      }
    });
  }


  listOfBrandValue = () => {
    const {filterKeyValue, filterType, selectedFilter} = this.state;
    let keyVar = _.size(filterType) > 0 ? selectedFilter || filterType[0] : null;
    return keyVar && filterKeyValue[keyVar].map((res, inx) =>{
      const textVar = keyVar == 'Categories' ? res.CodeDesc : res.PartName;
      const fnVar = keyVar == 'Categories' ? res.CodeId : res.PartNo;
      return(
       <TouchableOpacity style={styles.rightTouchButton} key={`${inx}`} onPress={()=> {
         if(keyVar == 'Categories') {
           this.categoryName = textVar;
         }
         this.selectParts(fnVar,keyVar)}}>
          <Text style={styles.leftBrandText}>{textVar} {'    '}
            <McIcon name={this.checkSelectedCheckbox(fnVar, keyVar)} size={14} color={Color.charcoalGrey} />
          </Text>
        </TouchableOpacity>
     )}
   );
  }

  checkSelectedCheckbox = (partNo,keyVar) => {
    const {finalSelectedParts,finalSelectedCategories} = this.state;
    if(keyVar == 'Categories') {
      if(finalSelectedCategories.includes(partNo)) {
        return "checkbox-marked";
      }
    }else if(finalSelectedParts.includes(partNo)) {
      return "checkbox-marked";
    }
    return 'checkbox-blank-outline';
  }

  selectParts = async (partNo, keyVar) => {
    if(this.checkWait){
      return;
    }
    this.checkWait = true;
    await this.setState({
      loadingData: true
    })

    if(keyVar == 'Categories') {
      console.log(selectCategoryArray,'sss')
      // if(selectCategoryArray.includes(partNo)) {
      //   const index = _.indexOf(selectCategoryArray,partNo);
      //   if(index > -1) 
      //   selectCategoryArray.splice(index,1);
      // } else {
      //   selectCategoryArray.push(partNo);
      // }
      if(selectCategoryArray == partNo) {
        selectCategoryArray = '';
      } else {
        selectCategoryArray = partNo;
      }
      
    } else {
   
      if(selectPartArray.includes(partNo)) {
        const index = _.indexOf(selectPartArray,partNo);
        if(index > -1) 
        selectPartArray.splice(index,1);
      } else {
        selectPartArray.push(partNo);
      }
    }
    await this.setState({
      finalSelectedParts: selectPartArray,
      finalSelectedCategories: selectCategoryArray
    })
    this.fetchPartFilter(selectPartArray);
  }
  
  async checkFilterType(key) {
   await this.setState({
      selectedFilter: key
    });
  }

  renderClassName(key) {
    const {selectedFilter} = this.state;
    if(key == selectedFilter) {
      return { backgroundColor: Color.white}
    } else {
      return { backgroundColor: Color.paleGreyTwo}
    }
  }

   applyFilter (){
    this.props.closeModal();
    let obj = {
      selectPartArray,
      selectCategoryArray,
      categoryName: this.categoryName
    }
    Events.trigger('filter-parts', obj);

  }

  resetFilter() {
    this.fetchPartFilter([]);
    this.props.resetFilter();
    selectPartArray = [];
    selectCategoryArray = '';
    this.setState({
      finalSelectedParts:[],
      finalSelectedCategories: []
    });
    
  }

  render() {
    const {filterType, filterProductModal, filterKeyValue,loadingData} = this.state;
    const {visible, closeModal, resetFilter} = this.props;
    return (
      <View>
        <Modal
          transparent={false}
          visible={visible}
          onRequestClose={closeModal}>
          <View style={styles.modalView}>
          {this.state.loadingData ? (
            <View style={styles.spinnerView}>
              <SpinnerView />
            </View>
          ) : null}
            <View style={styles.headerView}>
              <View style={styles.viewFirst}>
                <TouchableOpacity style={styles.backHeaderTouch} onPress={() => {
                  selectCategoryArray= '';
                  this.props.closeModal()}}>
                  <MIcon name="arrow-back" color={Color.white} size={24} />
                </TouchableOpacity>
                <Text style={styles.filterText}>Filter</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: 100}}>
                <TouchableOpacity style={[styles.backHeaderTouch]} onPress={()=> this.resetFilter()}>
                <MIcon name="close" size={25} color={Color.white} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.backHeaderTouch]} onPress={()=> this.applyFilter()}>
                  <MIcon name="check" size={25} color={Color.white} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.filterView}>
              <View style={styles.leftFirstView}>
                <ScrollView>
                  {filterType && filterType.map((key, index) => 
                  <TouchableOpacity style={[styles.leftTouchButton, this.renderClassName(key)]} key={`${index}`} onPress={()=> {
                    this.checkFilterType(key);
                    this.filterKey = key;
                    }}>
                    <Text style={styles.leftBrandText}>{key}</Text>
                  </TouchableOpacity>
                  )}
                </ScrollView>
              </View>
              <View style={styles.rightSideView}>
              <ScrollView>
                {this.listOfBrandValue()}
                
              </ScrollView>
              </View>
             
             
            </View>
            {/* <View style={styles.applyButton}>
              <TouchableOpacity activeOpacity={0.9} onPress={()=> closeModal()} style={{width: Matrics.screenWidth, flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red'}}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </Modal>
      </View>
    );
  }
}
export default FilterModal;
