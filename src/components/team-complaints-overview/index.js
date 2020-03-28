import React, {Component} from 'react';
import {Text, View, Alert} from 'react-native';
import _ from 'lodash';
import {VersionNumber} from '../../package';
import styles from './styles';
import APICaller from '../../utils/api-caller';
import {complaintTaskListEndPoint} from '../../config/api-endpoint';
import Helper from '../../utils/helper';
import {Matrics} from '../../common/styles';

let complaintOverView = [];
class TeamComplaintOverview extends Component {
  state = {
    capacity: null,
    assignWork: null,
  };
  async componentDidMount() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    if (userInfo) this.checkComplaintList(userInfo.UserName);
  }

  checkComplaintList(UserName) {
    complaintOverView = [];
    APICaller(complaintTaskListEndPoint(UserName), 'GET').then(json => {
      if (json.data.Success === '1') {
        const capacity = _.get(json, 'data.Response[0].Capacity', 5);
        const assignWork = _.get(json, 'data.Response[0].AssignedWork', 0);
        for (let i = 0; i < capacity; i++) {
          const width = (Matrics.screenWidth - 60) / capacity;
          const bgcolor = assignWork >= i ? 'red' : 'yellow';
          complaintOverView.push(
            <View
              key={`${i}_index`}
              style={[styles.square, {width: width, backgroundColor: bgcolor}]}
            />,
          );
        }
        this.setState({
          assignWork,
          capacity,
        });
      }
    });
  }

  render() {
    const {text} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.font16Center}>{text}</Text>
        <View style={styles.bodyView}>{complaintOverView}</View>
      </View>
    );
  }
}
export default TeamComplaintOverview;
