import {Color, Matrics, Fonts, ApplicationStyles} from '../../common/styles';

export default styles = {
  container: {
   // backgroundColor: Color.white,
   // height: Matrics.screenHeight,
    justifyContent: 'center',
    flex: 1
  },
  flexView: {
    //alignSelf: 'center',
    backgroundColor: Color.white,
    margin: 20,
    borderRadius: 10
  },
  viewHeader: {
    height: Matrics.ScaleValue(45),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
  },
  closeIcon: {
    position: 'absolute',
    zIndex: 1,
    paddingHorizontal: 5,
    left: 0,
  },
  titleText: {
    fontSize: Matrics.ScaleValue(18),
    color: Color.black30,
    fontWeight: 'bold',
  },
  bodyView: {
    borderBottomWidth: 1,
    borderColor: Color.paleGreyTwo,
    padding: Matrics.ScaleValue(10),
  },
  textProblem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.black,
  },
  userText: {
    fontSize: 16,
    color: Color.black,
  },
  userViewList:{
    padding: 10,
    justifyContent: 'center',
    borderBottomWidth:1,
    borderBottomColor: '#eee'
  },
  spinnerView: {
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
     zIndex: 10001,
    alignItems: 'center',
     top: '0%',
  },
};
