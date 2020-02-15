import React, {Component} from 'react';
import {Text, View, Alert} from 'react-native';
import styles from './styles';

const taskOverView = [
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

class TeamTasksOverview extends Component {
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
          {taskOverView &&
            taskOverView.map(res => (
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
export default TeamTasksOverview;
