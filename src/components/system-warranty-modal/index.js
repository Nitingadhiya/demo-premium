import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {TextInputView, SpinnerView} from '../../common/components';
import {MIcon} from '../../common/assets/vector-icon';
import styles from './styles';
import Helper from '../../utils/helper';
import APICaller from '../../utils/api-caller';
import {getSystemWarrantyEndPoint} from '../../config/api-endpoint';
import NavigationHelper from '../../utils/navigation-helper';
import Events from '../../utils/events';
import {useNavigation} from '@react-navigation/native';

class SystemWarrantyModal extends Component {
  state = {
    warrantyModal: false,
    warrantyList: null,
  };
  componentDidMount() {
    Events.on('systemWarrantyEvent', 'warranty', res => {
      this.setState({
        warrantyModal: true,
      });
      this.getWarrantyMethod(res.systemTag);
    });
  }

  getWarrantyMethod(tag) {
    APICaller(getSystemWarrantyEndPoint(tag), 'GET').then(json => {
      if (json.data.Success === '1') {
        this.setState({
          warrantyList: json.data.Response,
        });
      } else {
        Alert.alert('Alert', json.data.Message || 'No Warranty Found.');
      }
    });
  }

  modalShowHide(bool) {
    this.setState({warrantyModal: bool});
  }

  render() {
    const {warrantyModal, warrantyList} = this.state;
    if (!warrantyList) return <View />;
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={warrantyModal}
          onRequestClose={() => this.modalShowHide(false)}>
          <View style={styles.container}>
            <View style={styles.viewFlex}>
              <View style={styles.modalTitleView}>
                <TouchableOpacity
                  onPress={() => this.modalShowHide(false)}
                  style={styles.closeIcon}>
                  <Icon name="keyboard-arrow-left" size={40} />
                </TouchableOpacity>
                <Text style={styles.titleText}>Warranty</Text>
              </View>
              <ScrollView
                style={styles.viewFlex}
                contentContainerStyle={{flexGrow: 1}}>
                {warrantyList && warrantyList ? (
                  <View style={styles.viewFlex}>
                    <View style={styles.viewFlex}>
                      <View style={styles.flexDirection}>
                        <View style={styles.bodyView}>
                          <Text style={styles.textProblem}>System Model: </Text>
                          <Text style={styles.textComplaintBy}>
                            {_.get(
                              this.state.warrantyList,
                              'Header[0].SystemModel',
                              '',
                            )}
                          </Text>
                        </View>
                        <View style={styles.bodyView}>
                          <Text>Price: </Text>
                          <Text>
                            {_.get(
                              this.state.warrantyList,
                              'Header[0].Price',
                              '',
                            )}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.flexDirection}>
                        <View style={styles.bodyView}>
                          <Text style={styles.bold14}>SystemTag: </Text>
                          <Text style={styles.font14}>
                            {_.get(
                              this.state.warrantyList,
                              'Header[0].SystemTag',
                              '',
                            )}
                          </Text>
                        </View>
                        <View style={styles.bodyView}>
                          <Text>Date: </Text>
                          <Text>
                            {_.get(
                              this.state.warrantyList,
                              'Header[0].InvoiceDate',
                              '',
                            )}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <View style={styles.bodyView}>
                          <Text style={styles.bold14}>
                            Description:{' '}
                            <Text style={styles.normal14}>
                              {_.get(
                                this.state.warrantyList,
                                'Header[0].Description',
                                '',
                              )}
                            </Text>
                          </Text>
                        </View>
                      </View>
                      <View style={styles.mrgView}>
                        <View style={styles.bgDetailsView}>
                          <Text style={styles.detailTitle}>
                            Details:{' '}
                            {_.get(
                              this.state.warrantyList,
                              'Header[0].Status',
                              '',
                            )}
                          </Text>
                        </View>
                        {warrantyList &&
                          warrantyList.Details &&
                          warrantyList.Details.map(res => (
                            <View style={styles.detailsContainer}>
                              <View style={styles.wrap}>
                                <Text style={styles.bold14}>
                                  {res.PartName}( {res.SerialNo})
                                </Text>
                              </View>

                              <View style={styles.viewSubDetails}>
                                <View style={viewSub1Details}>
                                  <Text style={styles.bold14}>Warranty : </Text>
                                  <Icon
                                    name={res.Warranty ? 'check' : 'close'}
                                    size={16}
                                    color="black"
                                  />
                                </View>
                                <View style={styles.newTitleView}>
                                  <Text style={styles.bold14}>New :</Text>
                                  <Icon
                                    name={res.New ? 'check' : 'close'}
                                    size={16}
                                    color="black"
                                  />
                                </View>
                              </View>
                            </View>
                          ))}
                      </View>
                    </View>
                  </View>
                ) : null}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default SystemWarrantyModal;
