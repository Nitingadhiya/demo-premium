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
    height: 150,
    width: (Matrics.screenWidth / 2)  - 40,
    backgroundColor: Color.paleGrey,
    borderWidth:1,
    borderColor: Color.paleGreyTwo,
    borderRadius: 15,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  iconImage:{ width: '100%', height: '100%',  position: 'absolute', borderRadius: 15},
  containerStyles :{
    justifyContent: 'space-between',
    padding: 20,
  },
  greetingText: {
    fontSize: 20,
    textAlign: 'center',
    color: Color.white,
    zIndex: 2,
  },
  overlayBg: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    left: 0,
    top: 0,
    borderRadius: 15,
  }
};
