import {Color, Matrics, Fonts, ApplicationStyles} from '../../common/styles';

export default styles = {
  container: {
    backgroundColor: Color.black,
    height: Matrics.screenHeight,
  },
  centerText: {
    fontSize: 18,
    textAlign: 'center',
    color: Color.white,
  },
  cameraStyles: {
    height: Matrics.screenHeight,
    width: Matrics.screenWidth,
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
};
