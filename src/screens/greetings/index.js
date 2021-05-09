// LIBRARIES
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  ImageBackground,
  Animated,
  PanResponder,
  Button,
  Image,
  Text
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Share from 'react-native-share';


import _ from 'lodash';
import {Color, Images, Matrics} from '../../common/styles';
import APICaller from '../../utils/api-caller';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import {Header, SpinnerView} from '../../common/components';
import NavigationHelper from '../../utils/navigation-helper';
import ViewShot, { captureScreen, captureRef } from "react-native-view-shot";
import jake from './jake.png';
import RNFetchBlob from 'rn-fetch-blob'
import { MIcon } from '../../common/assets/vector-icon';
import { Appbar } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';



export class Greetings extends Component {
  constructor(props) {
    super(props);

    this._rotationAnimation = new Animated.Value(0);
    this._rotationOffset = 0;

    this._gestureOffset = { x: 0, y: 0 };
    this._gestureValue = new Animated.ValueXY();
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}

        const touches = evt.nativeEvent.touches;

        if (touches.length >= 2) {
          console.log('Touch');
          console.log(evt.nativeEvent);
            // We have a pinch-to-zoom movement
            // Track locationX/locationY to know by how much the user moved their fingers
        } else {
            // We have a regular scroll movement
        }

        this._gestureValue.setValue({
          x: this._gestureOffset.x + gestureState.dx,
          y: this._gestureOffset.y + gestureState.dy
        });
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        this._gestureOffset.x += gestureState.dx;
        this._gestureOffset.y += gestureState.dy;
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
    this.state = {
      loadingData: false,
      media: null,
      greetingImage: null,
      spinning: false,
    };

    
  }

  componentDidMount() {
    this.getUserInfo();
    console.log(this.props,'props');
    const {params} = this.props.route;
    console.log(this.props);
    if(params && params.image) {
      this.setState({
        greetingImage: params.image
      })
    } else {
      this.setState({
        greetingImage: 'https://i.pinimg.com/originals/b4/11/4b/b4114bc3f83f34dc7503348a6f5b2e14.jpg'
      })
    }
  }

  savePhoto() {
    // this.refs.viewShot.capture({format: "jpg",
    // quality: 0.8,
    // result: 'base64'}).then(async (base64Data) => {
    //   console.log("do something with ", base64Data);
    //   //this.dwFile(result);
    //   var base64Data = `data:image/png;base64,` + base64Data;
    //   console.log(base64Data);
    //   // here's base64 encoded image
    //   await Share.open({ url: base64Data });
    // });

    captureRef(this.refs.viewShot,{
      format: "jpg",
      quality: 0.8,
      result: 'base64'
    }).then(
      async(base64Data) => { 
        var base64Data = `data:image/png;base64,` + base64Data;
      console.log(base64Data);  
      await Share.open({ url: base64Data });
    },
      error => console.error("Oops, snapshot failed", error)
    );
    
  }

  startLoopAnimation = () => {
    this._rotationAnimation.setOffset(this._rotationOffset);
    Animated.loop(
      Animated.timing(this._rotationAnimation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
      })
    ).start();
  };

  stopLoopAnimation = () => {
    this._rotationAnimation.stopAnimation(currentValue => {
      this._rotationOffset = currentValue;
    });
  };

  toggleSpinning = () => {
    this.setState({ spinning: !this.state.spinning }, () => {
      this.state.spinning
        ? this.startLoopAnimation()
        : this.stopLoopAnimation();
    });
  };

  getRotationAnimation = () => {
    const rotate = this._rotationAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return { rotate };
  };

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });
  }

  getRotationAnimation = () => {
    const rotate = this._rotationAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return { rotate };
  };

  galleryOpen() {
    ImagePicker.openPicker({
      width: 100,
      height: 100,
      //cropping: true,
      includeBase64: true,
      mediaType: 'photo',
      //cropperCircleOverlay: true,
    }).then(image => {
      console.log(image.path)
      this.setState({media: image.path});
    });
  }




  render() {
    const {loadingData, cameraOpen, validateError} = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <Appbar.Header style={{backgroundColor: Color.primary}}>
          <Appbar.Action icon="keyboard-backspace" onPress={() => navigation.goBack()} />
          <Appbar.Content title={'Greetings'} />
          <Appbar.Action
            icon="image"
            onPress={() => this.galleryOpen()}
          />
        </Appbar.Header>
     
        {loadingData ? (
          <View style={styles.spinnerView}>
            <SpinnerView />
          </View>
        ) : null}

       
         <ViewShot ref="viewShot">
          <ImageBackground source={{uri: this.state.greetingImage}} style={{ height: '100%'}}>
           {this.state.media ?
            <Animated.Image
              source={{uri:this.state.media}}
              resizeMode={'center'}
              aspectRatio={1}
              style={{
              
                maxWidth: Matrics.screenWidth - Matrics.ScaleValue(100),
                maxHeight: Matrics.screenHeight - Matrics.ScaleValue(300),
                transform: [
                  this.getRotationAnimation(),
                  { translateX: this._gestureValue.x },
                  { translateY: this._gestureValue.y },
                  {scale: 1}
                ],
              }}
              {...this._panResponder.panHandlers}
            /> : null}
          </ImageBackground>
        </ViewShot>

        <View style={{ position: 'absolute', zIndex:1, height: 40, bottom: 0, width: '100%'}}>
          <TouchableOpacity
            style={{width: '100%', height: 40, backgroundColor: Color.primary, justifyContent: 'center'}}
            title={
              'Save photo'
            }
            onPress={() => this.savePhoto()}
          ><Text style={{ color: Color.white, fontSize: 18, textAlign: 'center'}}>Save photo</Text></TouchableOpacity>
        </View>
       
      </SafeAreaView>
    );
  }
}

//= =====STYLES DECLARATION======//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    top: '45%',
  },
});

export default Greetings;
