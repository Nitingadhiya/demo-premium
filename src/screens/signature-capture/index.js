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
  AsyncStorage,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import SignatureCapture from 'react-native-signature-capture';
import {Images, Color, Matrics} from '../../common/styles';
import APICaller from '../../utils/api-caller';
import Events from '../util/events';

class SignCapture extends Component {
  state = {
    loading: false,
    signature: null,
    UserName: null,
    policyResponse: [],
  };

  componentDidMount() {
    this.getTermsCondition();
    const params = this.props.navigation.state.params;
    if (params) {
      this.setState({
        signature: params.signature,
      });
    }
    AsyncStorage.getItem('userInfo').then(res => {
      const result = JSON.parse(res);
      if (result) {
        const {UserName} = result;
        this.setState({
          UserName,
        });
      }
    });
  }

  // ----------->>>Render Method-------------->>>
  saveSign = _ => {
    this.refs.sign.saveImage();
  };

  resetSign = _ => {
    this.refs.sign.resetImage();
  };

  _onSaveEvent = result => {
    let systemTag = '';
    const params = this.props.navigation.state.params;
    if (params) {
      systemTag = params.systemTag;
    }
    this.setState({
      loadingData: true,
    });
    const {UserName} = this.state;
    if (!UserName) {
      Alert.alert('Invalid username');
      return;
    }
    // result.encoded - for the base64 encoded png
    // result.pathName - for the file path name
    const endPoint = 'UploadSignatureImage';
    const body = {FileContents: result.encoded, FileName: `${systemTag}.jpg`};
    const method = 'POST';
    APICaller(`${endPoint}`, method, JSON.stringify(body)).then(json => {
      this.setState({
        loading: false,
      });
      if (json.data.Success === '1') {
        Events.trigger('refreshDashboard', 'refresh');
        this.props.navigation.navigate('Home');
      } else {
        Alert.alert(json.data.Message);
      }
    });
  };

  _onDragEvent = _ => {
    // This callback will be called when the user enters signature
    console.log('dragged');
  };

  getTermsCondition() {
    const endPoint = 'GetPolicyList';
    const method = 'GET';
    this.setState({
      loading: true,
    });
    APICaller(`${endPoint}`, method).then(json => {
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
    return (
      <SafeAreaView style={{flex: 1}}>
        {this.state.loading ? (
          <View style={styles.spinnerView}>
            <Spinner
              color={Color.primary}
              isVisible
              type="ThreeBounce"
              size={60}
            />
          </View>
        ) : null}
        {this.state.signature ? (
          <ScrollView style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
              }}>
              {this.state.policyResponse &&
                this.state.policyResponse.map((res, index) => (
                  <View>
                    <Text style={{fontSize: 16}}>
                      <Text style={{fontWeight: 'bold', fontSize: 16}}>
                        {index + 1}){' '}
                      </Text>
                      {res.Description}
                    </Text>
                  </View>
                ))}
              <ImageBackground
                source={{uri: this.state.signature}}
                resizeMode={'stretch'}
                style={{height: 120, width: 200}}
              />
            </View>
          </ScrollView>
        ) : (
          <ScrollView style={{flex: 1, padding: 10}}>
            {!this.state.agreeTerms ? (
              <View style={{flex: 1, marginBottom: 20}}>
                {this.state.policyResponse &&
                  this.state.policyResponse.map((res, index) => (
                    <View>
                      <Text style={{fontSize: 16}}>
                        <Text style={{fontWeight: 'bold', fontSize: 16}}>
                          {index + 1}){' '}
                        </Text>
                        {res.Description}
                      </Text>
                    </View>
                  ))}

                <TouchableOpacity
                  onPress={() => this.setState({agreeTerms: true})}
                  style={{
                    width: 100,
                    height: 40,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Color.primary,
                  }}>
                  <Text style={{color: '#fff', fontSize: 14}}>Agree</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{flex: 1, flexDirection: 'column'}}>
                <Text
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    lineHeight: 20,
                  }}>
                  Add your Signature here
                </Text>
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
        {/*         
        <WebView
        source={{uri: 'http://premiumsales.in/Home/CreatePayment?mobilenumber=9727782497&email=arkeshkorat404@gmail.com&amount=10'}}
        style={{flex: 1 }}
      /> */}
      </SafeAreaView>
    );
  }
}
export default SignCapture;
//= =====STYLES DECLARATION======//
const styles = StyleSheet.create({
  signature: {
    flex: 1,
  },
  buttonStyle: {
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#eeeeee',
    marginHorizontal: '2.5%',
    backgroundColor: Color.primary,
  },
  textBtn: {
    color: '#fff',
    fontSize: 14,
  },
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1,
    top: '40%',
  },
});
