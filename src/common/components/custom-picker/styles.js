import { Color, Images, Matrics, Fonts, ApplicationStyles } from "../../styles";
export default (Styles = {
  ...ApplicationStyles,
  q2Title: {
    fontSize: Matrics.ScaleValue(18),
    color: Color.black30,
    fontFamily: Fonts.type.Rubik,
    marginBottom: Matrics.ScaleValue(10)
  },
  q2TitleOption: {
    fontSize: Matrics.ScaleValue(16),
    color: Color.black30,
    fontFamily: Fonts.type.Rubik,
    marginLeft: Matrics.ScaleValue(5)
  },
  q2OptionView: {
    flexDirection: "row",
    alignItems: "center"
  },
  mainView: {
    marginTop: Matrics.ScaleValue(10)
  }
});
module.exports = Styles;
