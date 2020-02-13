import React, {Component} from 'react';
import {SafeAreaView, TouchableOpacity} from 'react-native';
import {AIcon} from '../../common/assets/vector-icon';
import CarouselSliderView from '../../common/components/carousel-slider-view';
import LoginComponent from '../../components/login';
import styles from './styles';

class Login extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
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
