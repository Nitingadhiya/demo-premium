import React, {Component} from 'react';
import {Text, View, FlatList, RefreshControl} from 'react-native';
import _ from 'lodash';
import styles from './styles';
import moment from 'moment';

class InhandInventoryForResponsiblePerson extends Component {
  state = {
    refreshing: false,
  };

  noItemFound = () => {
    return (
      <View style={styles.noItemView}>
        <Text style={styles.noItemText}>No items found</Text>
      </View>
    );
  };
  textBold = text => <Text style={styles.labelText}>{text}</Text>;

  oneLineMethod = (key, value) => (
    <View style={styles.oneLineView}>
      <View style={styles.leftView}>{this.textBold(key)}</View>
      <View style={styles.rightView}>
        <Text style={styles.description}>{value}</Text>
      </View>
    </View>
  );
  renderItem = item => (
    <View style={styles.seprationView}>
      {this.oneLineMethod('Description', item.PartDescription)}
      {this.oneLineMethod('Serial No', item.SerialNo)}
      {this.oneLineMethod('Warranty', item.WarrantyOutwardMonths)}
      {this.oneLineMethod('Part Category', item.PartCategoryName)}
      {this.oneLineMethod('With Responsibility', item.ResponsibleUser)}
      {this.oneLineMethod('Remark', item.HandoverRemark)}
      {this.oneLineMethod(
        'issue Date',
        moment(item.OTPDate).format('YYYY-MM-DD'),
      )}
    </View>
  );
  _onRefresh() {
    this.setState({
      refreshing: true,
    });
    Events.trigger('refresh-inventory-stock');
    setTimeout(() => this.setState({refreshing: false}), 2000);
  }

  render() {
    const {data} = this.props;
    const {refreshing} = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          data={data}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{flexGrow: 1}}
          keyExtractor={item => `${item.ID}_responsible`}
          ListEmptyComponent={() => this.noItemFound()}
          style={styles.flatListCss}
          extraData={this.props}
          renderItem={({item, index}) => this.renderItem(item, index)}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => this._onRefresh()}
            />
          }
        />
      </View>
    );
  }
}
export default InhandInventoryForResponsiblePerson;
