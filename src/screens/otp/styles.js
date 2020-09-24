import {ApplicationStyles, Color, Matrics} from '../../common/styles';

export default (styles = {
  ...ApplicationStyles,
  container: {
    flex: 1,
  },
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
  bottomText: {color: Color.black, fontSize: 12},
  productListIcon: {
    position: 'absolute',
    zIndex: 1,
    height: 50,
    width: 50,
    borderRadius: 25,
    bottom: 40,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primary,
  },
  resendOTPView: {
    height: Matrics.ScaleValue(40),
    marginBottom: 30,
  },
  smsResendTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Color.paleGreyThree,
    height: Matrics.ScaleValue(40),
    padding: Matrics.ScaleValue(10),
    borderRadius: Matrics.ScaleValue(5),
  },
  resendText: {
    fontSize: Matrics.ScaleValue(14),
    color: Color.black30,
    marginLeft: Matrics.ScaleValue(10),
  },
});
