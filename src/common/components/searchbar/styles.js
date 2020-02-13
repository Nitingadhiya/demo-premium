import { Color, Images, Matrics, Fonts, ApplicationStyles } from '../../../common/styles';
export default Styles = {
  ...ApplicationStyles,
  mainContainer: {
    flex: 1,
    backgroundColor: Color.paleGrey,
  },
  contentViewStyle: {
    backgroundColor: Color.white,
  },
  textInput: {
    flex: 1,
    height: Matrics.ScaleValue(50),
    fontSize: Matrics.ScaleValue(14),
    padding: 0,
    fontFamily: Fonts.type.Rubik,
    paddingLeft: Matrics.ScaleValue(5),
  },
  placeholderStyle: {
    lineHeight: Matrics.ScaleValue(24),
    fontFamily: Fonts.type.Rubik,
  },
  searchMainView: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingLeft: Matrics.ScaleValue(12),
    borderTopWidth: 1,
    borderTopColor: Color.paleGreyTwo,
  },
  filterStyle: {
    padding: Matrics.ScaleValue(12),
    borderRightWidth: 1,
    borderRightColor: Color.paleGrey
  }
};
module.exports = Styles
