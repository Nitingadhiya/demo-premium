import {Color, Matrics} from '../../common/styles';

export default styles = {
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
    flexDirection: 'row',
    backgroundColor: Color.white,
    borderColor: Color.BLACK,
    height: Matrics.ScaleValue(50),
    justifyContent: 'space-between',
    shadowColor: 'red',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.75,
    shadowRadius: 15,
    elevation: 1,
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
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Matrics.ScaleValue(45),
    borderWidth: 1,
    borderColor: '#ccc',
  },
  paymentMethodHeader: {
    height: Matrics.ScaleValue(50),
    borderTopWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentView: {
    flex: 1,
    alignItems: 'center',
  },
  SelectPaymentText: {
    color: Color.black,
    fontSize: Matrics.ScaleValue(18),
    fontWeight: 'bold',
  },
  PaymentMText: {
    fontSize: Matrics.ScaleValue(16),
    color: Color.black,
    fontWeight: 'bold',
  },
  servicetView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgAppview: {
    backgroundColor: Color.primary,
  },
  selectedView: {
    padding: Matrics.ScaleValue(10),
  },
  selectedText: {
    color: 'black',
    fontSize: Matrics.ScaleValue(18),
    textAlign: 'center',
  },
  selectedTextService: {
    fontWeight: 'bold',
  },
  touchRadioButton: {
    flexDirection: 'row',
    paddingHorizontal: Matrics.ScaleValue(5),
    paddingVertical: Matrics.ScaleValue(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtpayment: {
    color: 'white',
    fontSize: Matrics.ScaleValue(14),
    fontWeight: 'bold',
  },
  btnSave: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: Matrics.ScaleValue(80),
    backgroundColor: Color.primary,
    alignItems: 'center',
    height: Matrics.ScaleValue(40),
  },
  btnText: {
    color: 'white',
    fontSize: Matrics.ScaleValue(16),
    fontWeight: 'bold',
  },
};
