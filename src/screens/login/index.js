import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
  Linking,
  Modal,
  Alert,
  Platform,
  BackHandler,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TextInputView} from '../../common/components';
import {MIcon, McIcon, AIcon} from '../../common/assets/vector-icon';
import {Color} from '../../common/styles';
import CarouselSliderView from '../../common/components/carousel-slider-view';
import LoginComponent from '../../components/login';
import APICaller from '../../utils/api-caller';
import APIEndpoint from '../../config/api-endpoint';
import styles from './styles';
import {Matrics} from '../../common/styles';

class Login extends Component {
  static navigationOptions = () => ({
    header: null,
  });
  state = {
    sliderImage: null,
  };

  render() {
    const {sliderImage} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <CarouselSliderView />
        <LoginComponent navigation={this.props.navigation} />

        <TouchableOpacity
          style={styles.productListIcon}
          onPress={() =>
            this.props.navigation.navigate('ProductList', {login: false})
          }>
          <AIcon name="filetext1" size={20} color="#fff" style={{margin: 5}} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
export default Login;
