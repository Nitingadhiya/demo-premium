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
  itemView: {
    height: 100,
    width: '100%',
    backgroundColor: Color.paleGrey,
    borderWidth:1,
    borderColor: Color.paleGreyTwo,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2
  },
  containerStyles :{
    padding: 20
  },
  greetingText: {
    fontSize: 20
  }
};
