import React from 'react'
import { Animated, Dimensions } from 'react-native'
import { PinchGestureHandler, State } from 'react-native-gesture-handler'

const screen = Dimensions.get('window')
let scale = new Animated.Value(1)
const PinchableBox = ({imageUri}) => {
 
  let _baseScale = new Animated.Value(1);
  let _pinchScale = new Animated.Value(1);
  let _scale = Animated.multiply(_baseScale, _pinchScale);
  let _lastScale = 1;

  const _onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: _pinchScale } }],
    { useNativeDriver: true }
  );

  const _onPinchHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      _lastScale *= event.nativeEvent.scale;
      _baseScale.setValue(_lastScale);
      _pinchScale.setValue(1);
    }
  };


  console.log(imageUri,'scale')
  return (
    <PinchGestureHandler
      onGestureEvent={_onPinchGestureEvent}
      onHandlerStateChange={_onPinchHandlerStateChange}>
      <Animated.Image
        source={{ uri: imageUri}}
        style={{
          width: screen.width,
          height: 300,
           transform: [{ perspective: 200 }, { scale: _scale }],
        }}
        resizeMode='contain'
      />
    </PinchGestureHandler>
  )
}

export default PinchableBox