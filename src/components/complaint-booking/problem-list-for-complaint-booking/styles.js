import {Color, Matrics, Fonts, ApplicationStyles} from '../../../common/styles';
import {MAP_TYPES} from 'react-native-maps';

export default (styles = {
  container: {
    // flex: 1,
    width: '90%',
    backgroundColor: Color.white,
    paddingTop: 20,
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 10,
    margin: 20,
    top: 0,
  },
  txtStyle2: {
    color: Color.VERY_DARK_GRAY,
    textAlign: 'center',
    fontSize: Matrics.ScaleValue(17),
  },
  txtStyle3: {
    color: Color.VERY_DARK_GRAY,
    fontSize: Matrics.ScaleValue(14),
    alignSelf: 'center',
    marginLeft: Matrics.ScaleValue(5),
  },
  txtStyle4: {
    color: Color.VERY_DARK_GRAY,
    fontSize: Matrics.ScaleValue(14),
    alignSelf: 'center',
  },
  txtStyle5: {
    fontSize: Matrics.ScaleValue(15),
    color: Color.VERY_DARK_GRAY,
  },
  txtStyle6: {
    fontSize: Matrics.ScaleValue(15),
    color: Color.VIVID_ORANGE,
  },
  checkboxStyle: {
    color: Color.WHITE,
    backgroundColor: Color.VERY_DARK_GRAY,
    borderColor: Color.VERY_DARK_GRAY,
    borderRadius: Matrics.ScaleValue(2),
  },
  imageStyle: {
    alignSelf: 'center',
  },
  txtfieldStyle: {
    paddingTop: Matrics.ScaleValue(9),
  },
  backgroundImageStyle: {
    width: '100%',
    height: Matrics.ScaleValue(55),
    justifyContent: 'center',
  },
  remberpwdView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loginText: {
    color: Color.WHITE,
    fontSize: Matrics.ScaleValue(18),
    fontWeight: 'bold',
  },
  fbLoginText: {
    color: Color.DARK_MODERATE_BLUE,
    fontSize: Matrics.ScaleValue(18),
    fontWeight: 'bold',
  },
  signupLinkText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Matrics.ScaleValue(14),
  },
  textBoxView: {flex: 1, justifyContent: 'flex-start', alignItems: 'center'},
  subTextBoxView: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
  },
  floatingView: {
    margin: 10,
    backgroundColor: Color.primary,
    borderRadius: 25,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotRememberView: {
    flexDirection: 'row',
    height: 20,
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 5,
  },
  rememberView: {
    flexDirection: 'row',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginView: {
    height: 40,
    width: '60%',
    marginVertical: 10,
    alignItems: 'center',
  },
  touchableLogin: {
    backgroundColor: '#393184',
    width: 120,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  dontAccountView: {flex: 1, flexDirection: 'row', marginTop: 5},
  touchDontAccount: {
    justifyContent: 'center',
    flexDirection: 'row',
    height: 40,
  },
  dontAccText: {color: '#000', fontSize: 14},
  createAccText: {color: '#393184', fontSize: 14},
  lastLineScreen: {
    height: 30,
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e5e5e5',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  errorView: {
    //height: 15,
    justifyContent: 'center',
    width: '80%',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
  },
  loginErrorView: {
    marginTop: 3,
  },
  passwordVisible: {
    marginRight: 5,
    position: 'absolute',
    right: 0,
    marginTop: 15,
  },
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  centerText: {fontSize: 18, textAlign: 'center', color: '#fff'},
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  productListIcon: {
    position: 'absolute',
    zIndex: 1,
    height: 50,
    width: 50,
    backgroundColor: Color.primary,
    borderRadius: 25,
    bottom: 40,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listView: {
    flex: 1,
    borderTopWidth: 1,
    justifyContent: 'space-between',
    padding: Matrics.ScaleValue(10),
    borderColor: '#d3d3d3',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: Matrics.ScaleValue(40),
  },
  listViewText: {
    color: '#333',
    fontSize: Matrics.ScaleValue(12),
    marginRight: Matrics.ScaleValue(50),
    flex: 0.9,
  },
  iconView: {
    flex: 0.1,
  },

  //////

  backIconTouch: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    flexDirection: 'row',
  },
  backText: {color: '#000', fontWeight: 'bold', fontSize: 14},
  textBoxField: {
    height: 40,
    width: Matrics.screenWidth - 120,
    borderWidth: 1,
    padding: 0,
    paddingLeft: 10,
    borderColor: '#d3d3d3',
  },
  doneButtonTouch: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  doneText: {color: '#000', fontWeight: 'bold', fontSize: 14},
});
