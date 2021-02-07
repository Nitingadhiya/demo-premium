import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ScrollView, Image} from 'react-native';
import styles from './styles';
import APICaller from '../../utils/api-caller';
import {getCategoryListEndPoint} from '../../config/api-endpoint';
import NavigationHelper from '../../utils/navigation-helper';
import Events from '../../utils/events';

class CategoryItemList extends Component {
  state = {
    categoryData: null,
  };

  componentDidMount() {
    this.getCategoryList();
  }

  getCategoryList() {
    APICaller(getCategoryListEndPoint, 'GET').then(json => {
      this.setState({
        loadingData: false,
      });
      if (json.data.Success === '1') {
        this.setState({categoryData: json.data.Response});
      }
    });
  }

  renderCategoryItem = categoryData => {
    return categoryData.map((res, index) => (
      <TouchableOpacity
        onPress={() => {
          //global.categoryFilter = res.CodeDesc;
          NavigationHelper.navigate(this.props.navigation, 'ProductList', {
            category: res.CodeDesc,
            codeId: res.CodeId
          });
          //Events.trigger('refreshProductList');
        }}
        style={styles.buttonCategory}
        key={`${index.toString()}`}>
        <Image
          source={{uri: res.Image}}
          style={styles.imageCategory}
          resizeMode="stretch"
        />
      </TouchableOpacity>
    ));
  };

  render() {
    const {categoryData} = this.state;
    return (
      <View style={styles.categoryView}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categoryData && this.renderCategoryItem(categoryData)}
        </ScrollView>
      </View>
    );
  }
}
export default CategoryItemList;
