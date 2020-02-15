import React, {Component} from 'react';
import {Text, View, Alert} from 'react-native';
import {VersionNumber} from '../../package';
import styles from './styles';
import APICaller from '../../utils/api-caller';
import {userDashboardEndPoint} from '../../config/api-endpoint';

class AdminTabel extends Component {
  render() {
    const {systemDescription} = this.props;
    return (
      <View style={styles.mainViewField}>
        <View style={styles.fieldView}>
          <View style={[styles.mainTextView, styles.extraWidth]}>
            <Text style={styles.textTitleBold} />
          </View>
          <View style={[styles.mainTextView, styles.todayCountWidth]}>
            <Text style={styles.textTitleBold}>Today</Text>
          </View>
          <View style={[styles.mainTextView, styles.totalCountWidth]}>
            <Text style={styles.textTitleBold}>Total</Text>
          </View>
          <View style={styles.mainTextView}>
            <Text style={styles.textTitleBold}>Amount</Text>
          </View>
        </View>
        {systemDescription &&
          systemDescription.map((res, index) => (
            <View style={styles.fieldView} key={index.toString()}>
              <View style={[styles.mainTextView, styles.extraWidth]}>
                <Text style={styles.textTitle}>{res.key}</Text>
              </View>
              <View style={[styles.mainTextView, styles.todayCountWidth]}>
                <Text style={styles.textTitle}>
                  {res.todayCount > 0 && res.todayCount}
                </Text>
              </View>
              <View style={[styles.mainTextView, styles.totalCountWidth]}>
                <Text style={styles.textTitle}>
                  {res.totalCount > 0 && res.totalCount}
                </Text>
              </View>
              <View style={styles.mainTextView}>
                <Text style={styles.textTitle}>
                  {res.amount > 0 && 'Rs'} {res.amount > 0 && res.amount}
                </Text>
              </View>
            </View>
          ))}
      </View>
    );
  }
}
export default AdminTabel;
