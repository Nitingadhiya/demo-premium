import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import {MIcon} from '../../common/assets/vector-icon';
import styles from './styles';
import APICaller from '../../utils/api-caller';
import {getBonusEndPoint} from '../../config/api-endpoint';
import Events from '../../utils/events';

class BonusDaysModal extends Component {
  state = {
    bonusModal: false,
    bonusList: null,
  };
  componentDidMount() {
    Events.on('bonusDaysEvent', 'bonus', res => {
      this.setState({
        bonusModal: true,
      });
      this.fetchBonusDay(res.systemTag);
    });
  }

  fetchBonusDay(tag) {
    APICaller(getBonusEndPoint(tag), 'GET').then(json => {
      if (json.data.Success === '1') {
        this.setState({
          bonusList: json.data.Response,
          bonusModal: true,
        });
      } else {
        Alert.alert('Alert', json.data.Message || 'No Bonus Found.');
      }
    });
  }

  modalShowHide(bool) {
    this.setState({bonusModal: bool});
  }

  render() {
    const {bonusModal, bonusList} = this.state;
    if (!bonusList) return <View />;
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={bonusModal}
          onRequestClose={() => this.modalShowHide(false)}>
          <View style={styles.container}>
            <View style={styles.flexView}>
              <View style={styles.viewHeader}>
                <TouchableOpacity
                  onPress={() => this.modalShowHide(false)}
                  style={styles.closeIcon}>
                  <MIcon name="keyboard-arrow-left" size={40} />
                </TouchableOpacity>
                <Text style={styles.titleText}>Bonus Days</Text>
              </View>
              <ScrollView style={styles.flexView}>
                {bonusList &&
                  bonusList.map(res => (
                    <View style={styles.bodyView}>
                      <Text style={styles.textProblem}>
                        <Text>
                          {res.CompanyName}({res.SystemTag})
                        </Text>
                      </Text>
                      <Text style={styles.textComplaintBy}>
                        <Text style={styles.bold}>ByUser : </Text> {res.ByUser}
                      </Text>

                      <Text style={styles.textComplaintBy}>
                        <Text style={styles.bold}>BonusDays : </Text>{' '}
                        {res.BonusBy}
                      </Text>

                      <Text style={styles.textComplaintBy}>
                        <Text style={styles.bold}>BonusBy : </Text>
                        {res.BonusBy}
                      </Text>

                      <Text style={styles.textComplaintBy}>
                        <Text style={styles.bold}>GivenDate : </Text>{' '}
                        {moment(res.GivenDate).format('DD-MM-YYYY')}
                      </Text>
                    </View>
                  ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default BonusDaysModal;
