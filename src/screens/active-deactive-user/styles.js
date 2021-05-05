import {Color, Matrics, ApplicationStyles} from '../../common/styles';

export default styles = {
  ...ApplicationStyles,
  container: {
    flex: 1,
    backgroundColor: Color.white,
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
  textBoxView: {flex: 1, justifyContent: 'flex-start', alignItems: 'center'},
  subTextBoxView: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
    alignSelf: 'center',
    marginTop: Matrics.ScaleValue(10)
  },
  touchableLogin: {
    backgroundColor: '#393184',
    width: 120,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: Matrics.ScaleValue(30)
  },
  loginText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
};
