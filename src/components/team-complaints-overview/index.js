import React, {Component} from 'react';
import {Text, View, Alert} from 'react-native';
import {VersionNumber} from '../../package';
import styles from './styles';
import APICaller from '../../utils/api-caller';
import {userDashboardEndPoint} from '../../config/api-endpoint';

const complaintOverView = [
  {work: true},
  {work: true},
  {work: true},
  {work: true},
  {work: true},
  {work: false},
  {work: false},
  {work: false},
  {work: false},
  {work: false},
];

class TeamComplaintOverview extends Component {
  state = {
    systemDescription: null,
  };
  componentDidMount() {}

  render() {
    const {text} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.font16Center}>{text}</Text>
        <View style={styles.bodyView}>
          {complaintOverView &&
            complaintOverView.map(res => (
              <View
                style={[
                  styles.square,
                  {
                    backgroundColor: res.work ? 'red' : 'yellow',
                  },
                ]}
              />
            ))}
        </View>
      </View>
    );
  }
}
export default TeamComplaintOverview;
