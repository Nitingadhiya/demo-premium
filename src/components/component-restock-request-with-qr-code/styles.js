import {Color, Matrics, Fonts, ApplicationStyles} from '../../common/styles';

export default styles = {
  container: {
    backgroundColor: Color.black,
    height: Matrics.screenHeight,
    width: Matrics.screenWidth,
  },
  cameraStyles: {
    height: Matrics.screenHeight,
    width: Matrics.screenWidth,
  },
  rectangleContainer: {
    height: Matrics.screenHeight,
    width: Matrics.screenWidth,

    // alignItems: 'flex-end',
    // justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  itemScanView: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: Color.white,
    height: 30,
    width: 30,
    borderRadius: 15,
    bottom: 30,
    right: 10,

    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textColorCamera: {
    color: Color.primary,
    fontSize: 14,
  },
  finishTouchButton: {
    height: 45,
    width: '100%',
    backgroundColor: Color.primary,
    position: 'absolute',
    zIndex: 1,
    bottom: 20,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishText: {
    color: Color.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  rectangle: {
    height: Matrics.screenWidth * 0.65,
    width: Matrics.screenWidth * 0.65,
    borderWidth: Matrics.screenWidth * 0.005,
    borderColor: Matrics.screenWidth * 0.005,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'transparent',
  },
};
