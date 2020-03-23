import {Color, Matrics, ApplicationStyles} from '../../common/styles';

export default styles = {
  ...ApplicationStyles,
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formGroup: {flex: 1, padding: 10},
  labelClass: {
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
  },
  width120: {width: 120},
  font14_999: {
    color: '#333',
    fontSize: 14,
  },
  font16_333: {
    color: '#333',
    fontSize: 16,
  },
  font16_999: {color: '#999', fontSize: 16},
  checkout: {
    height: 45,
    width: Matrics.screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primary,
    flexDirection: 'row',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
  },
  subTextBoxView: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
  },
  plml0: {
    paddingLeft: 0,
    marginLeft: 0,
  },
  errorView: {
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
};
