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
};
