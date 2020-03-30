import React, {Component} from 'react';
import {Text, View, FlatList, RefreshControl} from 'react-native';
import _ from 'lodash';
import styles from './styles';
import moment from 'moment';
import Events from '../../utils/events';

class InhandInventory extends Component {
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
  textNormal = text => (
    <Text style={styles.textShow} numberOfLines={1}>
      {text}
    </Text>
  );

  oneLineMethod = (key, value, value1) => (
    <View style={styles.oneLineView}>
      <View style={styles.leftView}>{this.textNormal(key)}</View>
      <View style={[styles.rightView, styles.borderRight]}>
        <Text style={styles.descriptionText}>{value}</Text>
      </View>
      <Text style={styles.descriptionText}>{value1}</Text>
    </View>
  );

  arrayLineMethod = (key, value) => (
    <View style={[styles.oneLineView, styles.paddingBottom5]}>
      {/* <View style={styles.leftView}>{this.textBold(key)}</View> */}
      <View style={styles.rightView}>
        {value &&
          value.split(',').map((res, index) => (
            <View style={styles.viewSerialNo} key={`${index}_string`}>
              <Text style={styles.descriptionText}>{res}</Text>
            </View>
          ))}
      </View>
    </View>
  );

  checkLoggedIn = item =>
    item.ResponsibleUser.toLowerCase() ===
    this.props.userInfo.UserName.toLowerCase();

  renderItem = item => (
    <View style={styles.seprationView}>
      <View style={styles.spView} />
      <View
        style={{
          paddingTop: 5,
          backgroundColor: this.checkLoggedIn(item)
            ? 'transparent'
            : 'rgba(255, 255, 0,0.3)',
        }}>
        {this.arrayLineMethod('Serial No', item.PartDescription)}
        {this.oneLineMethod(
          this.checkLoggedIn(item) ? 'Inhand Inventory' : 'Responsible',
          item.ResponsibleUser,
          item.SerialNo,
        )}
        {this.oneLineMethod(
          'Remark',
          item.HandoverRemark,
          moment(item.OTPDate).format('YYYY-MM-DD'),
        )}
      </View>
      {/* {this.oneLineMethod('Description', item.PartDescription)}
      {this.oneLineMethod('Serial No', item.SerialNo)}
      {this.oneLineMethod('Warranty', item.WarrantyOutwardMonths)}
      {this.oneLineMethod('Part Category', item.PartCategoryName)}
      {this.oneLineMethod('With Responsibility', item.ResponsibleUser)}
      {this.oneLineMethod('Remark', item.HandoverRemark)}
      {this.oneLineMethod(
        'issue Date',
        moment(item.OTPDate).format('YYYY-MM-DD'),
      )} */}
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
          keyExtractor={item => `${item.ID}_inventory`}
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
export default InhandInventory;
