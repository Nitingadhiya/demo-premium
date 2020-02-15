import {Color, Matrics, Fonts, ApplicationStyles} from '../../common/styles';

export default styles = {
  container: {
    backgroundColor: '#fff',
    height: Matrics.screenHeight,
  },
  viewFlex: {flex: 1},
  modalTitleView: {
    height: Matrics.ScaleValue(45),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Color.paleGreyTwo,
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
    color: Color.black,
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
  textComplaintBy: {fontSize: 14, color: Color.black30},
  bold: {fontWeight: 'bold'},
};
