import {Color, Matrics, Fonts, ApplicationStyles} from '../../common/styles';

export default styles = {
  container: {
    backgroundColor: Color.white,
    height: Matrics.screenHeight,
  },
  flexView: {flex: 1},
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
    color: 'black',
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
  viewFlex: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  locationAllow: {
    height: Matrics.ScaleValue(60),
    backgroundColor: Color.primary,
    width: Matrics.screenWidth,
    justifyContent: 'center',
   marginBottom: Matrics.ScaleValue(20),
   alignItems: 'center'
  },
  locationAllowText: {
    fontSize: Matrics.ScaleValue(16),
    color: Color.white,
    fontWeight: 'bold'
  },
  locationFlex:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  locationPermissionText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
    marginBottom: 20
  },
  descriptionText: {
    marginBottom: 40,
    color: Color.black70,
    fontSize: 14
  },
  settingText: {
    color: Color.black,
    fontSize: 16
  }
};
