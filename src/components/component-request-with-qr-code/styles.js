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
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: Matrics.screenWidth * 0.65,
    width: Matrics.screenWidth * 0.65,
    borderWidth: Matrics.screenWidth * 0.005,
    borderColor: Matrics.screenWidth * 0.005,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  topOverlay: {
    flex: 1,
    height: Matrics.screenWidth,
    width: Matrics.screenWidth,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomOverlay: {
    flex: 1,
    height: Matrics.screenWidth,
    width: Matrics.screenWidth,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingBottom: Matrics.screenWidth * 0.25,
  },

  leftAndRightOverlay: {
    height: Matrics.screenWidth * 0.65,
    width: Matrics.screenWidth,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  customView: {
    width: Matrics.screenWidth,
    height: Matrics.screenHeight,
  },
  errorView: {
    position: 'absolute',
    zIndex: 1,
    top: 10,
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
};
