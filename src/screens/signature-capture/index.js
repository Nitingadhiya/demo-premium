// LIBRARIES
import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import styles from './styles';
import SignatureCapture from 'react-native-signature-capture';
import {
  getPolicyEndPoint,
  uploadSignatureEndPoint,
} from '../../config/api-endpoint';
import {Header, SpinnerView} from '../../common/components';
import {Images, Color, Matrics} from '../../common/styles';
import APICaller from '../../utils/api-caller';
import Events from '../../utils/events';
import NavigationHelper from '../../utils/navigation-helper';
import Helper from '../../utils/helper';

class SignCapture extends Component {
  state = {
    loading: false,
    signature: null,
    userInfo: null,
    policyResponse: [],
    agreeTerms: false,
  };

  componentDidMount() {
    this.getTermsCondition();
    this.getUserInfo();
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    const {route} = this.props;
    if (route.params) {
      this.setState({
        signature: route.params.signature,
        systemTag: route.params.systemTag,
        userInfo,
      });
    }
  }

  saveSign = _ => {
    this.refs.sign.saveImage();
  };

  resetSign = _ => {
    this.refs.sign.resetImage();
  };

  _onSaveEvent = result => {
    this.setState({
      loadingData: true,
    });
    const {userInfo} = this.state;
    if (!userInfo) {
      Alert.alert('Invalid username');
      return;
    }

    const endPoint = 'UploadSignatureImage';
    const body = {
      FileContents: result.encoded,
      FileName: `${this.state.systemTag}.jpg`,
    };

    APICaller(uploadSignatureEndPoint, 'POST', JSON.stringify(body)).then(
      json => {
        this.setState({
          loading: false,
        });
        if (json.data.Success === '1') {
          Events.trigger('refreshDashboard', 'refresh');
          NavigationHelper.navigate(this.props.navigation, 'Dashboard');
        } else {
          Alert.alert(json.data.Message);
        }
      },
    );
  };

  _onDragEvent = _ => {
    // This callback will be called when the user enters signature
    //console.log('dragged');
  };

  getTermsCondition() {
    this.setState({
      loading: true,
    });
    APICaller(getPolicyEndPoint, 'GET').then(json => {
      this.setState({
        loading: false,
      });
      if (json.data.Success === '1') {
        this.setState({
          policyResponse: json.data.Response,
        });
      } else {
        Alert.alert(json.data.Message);
      }
    });
  }

  render() {
    const {signature, loading, policyResponse, agreeTerms} = this.state;
    return (
      <SafeAreaView style={styles.signature}>
        <Header title="Signature Capture" left="back" />
        {loading ? (
          <View style={styles.spinnerView}>
            <SpinnerView />
          </View>
        ) : null}
        {signature ? (
          <ScrollView style={styles.signature}>
            <View style={styles.policyView}>
              {policyResponse &&
                policyResponse.map((res, index) => (
                  <View>
                    <Text style={styles.font16}>
                      <Text style={styles.fontBold16}>{index + 1}) </Text>
                      {res.Description}
                    </Text>
                  </View>
                ))}
              <ImageBackground
                source={{uri: signature}}
                resizeMode={'stretch'}
                style={styles.signatureImage}
              />
            </View>
          </ScrollView>
        ) : (
          <ScrollView style={styles.scrollView}>
            {!agreeTerms ? (
              <View style={styles.agreeTermsView}>
                {this.state.policyResponse &&
                  this.state.policyResponse.map((res, index) => (
                    <View>
                      <Text style={styles.font16}>
                        <Text style={styles.fontBold16}>{index + 1}) </Text>
                        {res.Description}
                      </Text>
                    </View>
                  ))}

                <TouchableOpacity
                  onPress={() => this.setState({agreeTerms: true})}
                  style={styles.agreeBtn}>
                  <Text style={styles.agreeText}>Agree</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.addSignView}>
                <Text style={styles.addSignText}>Add your Signature here</Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#d3d3d3',
                    height: Matrics.screenHeight - 250,
                  }}>
                  <SignatureCapture
                    style={styles.signature}
                    ref="sign"
                    onSaveEvent={this._onSaveEvent}
                    onDragEvent={this._onDragEvent}
                    saveImageFileInExtStorage={false}
                    showNativeButtons={false}
                    showTitleLabel={false}
                    viewMode="portrait"
                  />
                </View>
                <View style={{borderWidth: 1, borderColor: '#d3d3d3'}} />
                <View
                  style={{
                    flexDirection: 'row',
                    height: 80,
                    alignItems: 'flex-end',
                  }}>
                  <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={this.saveSign}>
                    <Text style={styles.textBtn}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={this.resetSign}>
                    <Text style={styles.textBtn}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}
export default SignCapture;
