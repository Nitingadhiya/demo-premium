import {Color, Matrics} from '../../common/styles';
import {ClipPath} from 'react-native-svg';

export default (styles = {
  container: {
    backgroundColor: Color.white,
    padding: 10,
  },
  textStyle2: {
    fontSize: Matrics.ScaleValue(14),
    color: Color.lightGray,
    justifyContent: 'flex-end',
  },
  UserImage: {
    height: Matrics.ScaleValue(50),
    width: Matrics.ScaleValue(50),
    borderRadius: Matrics.ScaleValue(50 / 2),
  },
  textStyle: {
    fontSize: Matrics.ScaleValue(16),
    fontWeight: 'bold',
    color: Color.black,
    flex: 1,
  },
  textStyle1: {
    fontSize: Matrics.ScaleValue(13),
    color: Color.lightGray,
  },
  textinputViewStyle: {
    backgroundColor: Color.white,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    marginBottom: Matrics.ScaleValue(5),
  },
  searchWithProblem: {
    backgroundColor: Color.white,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    flexDirection: 'row',
    height: Matrics.ScaleValue(45),
    alignItems: 'center',
    borderRadius: Matrics.ScaleValue(5),
    marginTop: Matrics.ScaleValue(10),
  },
  problemText: {
    marginLeft: Matrics.ScaleValue(10),
    fontSize: Matrics.ScaleValue(14),
    color: Color.black,
  },
  textInput: {
    backgroundColor: 'transparent',
    height: Matrics.ScaleValue(40),
    borderWidth: 1,
    marginLeft: 0,
    marginTop: 0,
    borderColor: Color.paleGreyTwo,
    paddingHorizontal: 10,
    color: Color.black30,
    fontSize: Matrics.ScaleValue(16),
  },
  userDetailView: {
    justifyContent: 'space-around',
    flex: 3,
    marginLeft: Matrics.ScaleValue(10),
  },
  imageViewSetting: {
    paddingVertical: Matrics.ScaleValue(6),
    paddingHorizontal: Matrics.ScaleValue(12),
  },
  messageView: {
    borderBottomColor: Color.silver,
    borderBottomWidth: 1,
    marginTop: Matrics.ScaleValue(5),
  },
  flatView: {
    padding: Matrics.ScaleValue(10),
    paddingRight: Matrics.ScaleValue(0),
  },
  textinputStyle: {
    marginLeft: Matrics.ScaleValue(20),
    fontSize: Matrics.ScaleValue(15),
    flex: 1,
  },
  sendIconStyle: {
    alignSelf: 'center',
    marginRight: Matrics.ScaleValue(15),
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
  spinnerViewPOS: {
    position: 'absolute',
    zIndex: 1,
    top: '45%',
    left: '40%',
  },
  badgeCountView: {
    backgroundColor: Color.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    right: 0,
  },
  nextandSubmitClass: {
    height: Matrics.ScaleValue(85),
    alignItems: 'center',
    backgroundColor: '#fefefe',
    borderTopWidth: 2,
    borderColor: '#eee',
  },
  touchNextButton: {
    width: '60%',
    height: 45,
    backgroundColor: Color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  font16White: {
    color: '#fff',
    fontSize: 16,
  },
  borderW1: {
    borderColor: '#d3d3d3',
    borderWidth: 1,
  },
  viewSystemName: {
    height: 40,
    justifyContent: 'center',
  },
  spinnerViewCenter: {
    position: 'absolute',
    zIndex: 1,
    top: '45%',
    alignSelf: 'center',
  },
  ismajorTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingVertical: 5,
  },
  isMajorText: {
    marginLeft: 5,
    fontSize: 16,
    color: Color.black30,
  },
  text16Font: {
    fontSize: 16,
    color: Color.black30,
  },

  radioButtonAntivirus: {
    marginLeft: 10,
  },

  radioTouchSelection: {
    flexDirection: 'row',
    padding: 5,
  },
  mrg5: {marginLeft: 5},

  problemTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: Color.paleGrey,
    alignItems: 'center',
    paddingLeft: Matrics.ScaleValue(5),
  },
  closeButtonProblem: {
    padding: Matrics.ScaleValue(5),
  },
  problemPriceDesc: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  descCode: {
    fontSize: Matrics.ScaleValue(14),
    color: Color.black30,
    flex: 1,
  },
  priceCode: {
    fontSize: Matrics.ScaleValue(14),
    color: Color.black30,
    fontWeight: 'bold',
    flex: 0.2,
  },

  tableBg: {
    backgroundColor: '#fafafa',
    marginTop: Matrics.ScaleValue(5),
    marginBottom: Matrics.ScaleValue(20),
    borderRadius: Matrics.ScaleValue(5),
    elevation: 2,
  },

  /////

  totalPriceView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Matrics.ScaleValue(5),
    width: '100%',
  },
  totalLabel: {
    fontSize: Matrics.ScaleValue(18),
    color: Color.black30,
  },
  priceTotalValue: {
    fontSize: Matrics.ScaleValue(18),
    color: Color.black30,
    fontWeight: 'bold',
  },
  systemQRcode: {
    flexDirection: 'row',
    width: '100%',
  },
  systemQRTextInput: {
    flex: 1,
  },
  iconArrow: {
    alignItems: 'center',
    justifyContent: 'center',
    height: Matrics.ScaleValue(40),
    paddingHorizontal: Matrics.ScaleValue(5),
  },

  foundMessage: {
    fontSize: Matrics.ScaleValue(16),
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sysTag: {
    color: Color.black30,
    fontSize: Matrics.ScaleValue(14),
  },
  viewTxt: {
    height: Matrics.ScaleValue(40),
    justifyContent: 'center',
    paddingLeft: Matrics.ScaleValue(5),
  },
  borderWidth0: {
    borderBottomWidth: 0,
  },
});
