import {Color, ApplicationStyles} from '../../common/styles';

export default styles = {
  ...ApplicationStyles,
  signature: {
    flex: 1,
  },
  buttonStyle: {
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#eeeeee',
    marginHorizontal: '2.5%',
    backgroundColor: Color.primary,
  },
  textBtn: {
    color: '#fff',
    fontSize: 14,
  },
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1,
    top: '40%',
  },
  policyView: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  signatureImage: {height: 120, width: 200},
  scrollView: {flex: 1, padding: 10},
  agreeTermsView: {flex: 1, marginBottom: 20},
  agreeBtn: {
    width: 100,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primary,
  },
  agreeText: {color: '#fff', fontSize: 14},
  addSignView: {flex: 1, flexDirection: 'column'},
  addSignText: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    lineHeight: 20,
  },
};
