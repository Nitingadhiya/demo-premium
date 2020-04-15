import {ifIphoneX} from 'react-native-iphone-x-helper';
import {Color, Matrics, ApplicationStyles} from '../../common/styles';

export default (styles = {
  ...ApplicationStyles,
  viewContainer: {
    flex: 1,
  },
  containerStyles: {
    flexGrow: 1,
  },
  addThreadButtonView: {
    backgroundColor: Color.primary,
    height: Matrics.ScaleValue(50),
    width: Matrics.ScaleValue(50),
    borderRadius: Matrics.ScaleValue(30),
    shadowColor: Color.black,
    shadowOffset: {width: 1, height: 5},
    shadowOpacity: 0.5,
    elevation: 10,
    position: 'absolute',
    right: 10,
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    ...ifIphoneX({
      bottom: 40,
    }),
    // transform: [{ rotate: "-180deg" }]
  },
  animatedView: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 50,
    width: '100%',
    backgroundColor: Color.primary,
    position: 'absolute',
  },
  textInputCss: {
    height: 40,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: Color.white,
    borderColor: Color.black,
    paddingVertical: 0,
    paddingHorizontal: 28,
    fontSize: 16,
    color: Color.primary,
  },
  clearSearchIcon: {
    position: 'absolute',
    zIndex: 1,
    right: 15,
    top: 13,
  },
});
