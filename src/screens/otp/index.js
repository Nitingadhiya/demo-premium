import React, {Component} from 'react';
import {SafeAreaView, Text} from 'react-native';
import {AIcon} from '../../common/assets/vector-icon';
import CarouselSliderView from '../../common/components/carousel-slider-view';
import LoginComponent from '../../components/login';
import styles from './styles';

class OTPScreen extends Component {
  render() {
    return (
      <SafeAreaView
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View
          style={{
            justifyContent: 'center',
            height: Dimensions.get('window').height,
            alignItems: 'center',
          }}>
          <CodeInput
            ref="codeInputRef2"
            keyboardType="numeric"
            codeLength={6}
            activeColor="rgba(57,49,132, 1)"
            inactiveColor="rgba(57,49,132, 0.5)"
            autoFocus
            ignoreCase
            inputPosition="center"
            size={Codelength}
            onFulfill={isValid => this.onFinishCheckingCode(isValid)}
            containerStyle={{marginTop: -50, alignItems: 'center'}}
            codeInputStyle={{borderWidth: 1.5}}
          />
        </View>
        <View style={styles.lastLineScreen}>
          <Text style={{color: '#000', fontSize: 12}}>SURAT</Text>
          <Text style={{color: '#000', fontSize: 12}}>BARODA</Text>
          <Text style={{color: '#000', fontSize: 12}}>AHMEDABAD</Text>
          <Text style={{color: '#000', fontSize: 12}}>NAVSARI</Text>
        </View>
      </SafeAreaView>
    );
  }
}
export default OTPScreen;
