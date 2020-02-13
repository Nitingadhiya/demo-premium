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
    color: Color.black70,
    marginLeft: Matrics.ScaleValue(5),
    fontFamily: Fonts.type.Rubik
  },
  q2TitleValue: {
    color: Color.black70,
    fontSize: Matrics.ScaleValue(16),
    fontFamily: Fonts.type.Rubik
  },
  q2OptionView: {
    flexDirection: "row",
    alignItems: "center"
  }
});
module.exports = Styles;
