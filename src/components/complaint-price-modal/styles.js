import {Color, Matrics, Fonts, ApplicationStyles} from '../../common/styles';

export default styles = {
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
