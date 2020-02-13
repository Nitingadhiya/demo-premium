import { Color, Images, Matrics, Fonts, ApplicationStyles } from "../../styles";
export default Styles = {
  ...ApplicationStyles,
  checkboxView: {
    //alignSelf: "flex-start",
    //width: Matrics.screenWidth - Matrics.ScaleValue(40),
  },
  q2Title: {
    fontSize: Matrics.ScaleValue(18),
    color: Color.black30,
    fontFamily: Fonts.type.Rubik,
    marginBottom: Matrics.ScaleValue(5)
  },
  q2subTitle: {
    fontSize: Matrics.ScaleValue(14),
    color: Color.black70,
    marginBottom: Matrics.ScaleValue(5),
    fontFamily: Fonts.type.Rubik
  },
  q2TitleOption: {
    fontSize: Matrics.ScaleValue(16),
    color: Color.black70,
    marginLeft: Matrics.ScaleValue(5),
    flexWrap: "wrap",
    fontFamily: Fonts.type.Rubik,
    marginRight: Matrics.ScaleValue(18),
    textAlignVertical: "center"
  },
  q2OptionView: {
    alignSelf: "flex-start",
    marginVertical: Matrics.ScaleValue(3)
  },
  touchBtn: {
    flexDirection: "row",
    paddingVertical: Matrics.ScaleValue(5),
    alignItems: "center"
    //alignItems: "center"
  },
  checkView: {
    borderWidth: 1,
    borderRadius: Matrics.ScaleValue(4),
    borderColor: Color.paleGreyTwo,
    height: Matrics.ScaleValue(22),
    width: Matrics.ScaleValue(22),
    alignItems: "center",
    justifyContent: "center"
  },
  privacyText: {
    color: Color.darkRed
  },
  animationCheckboxView: {
    width: Matrics.ScaleValue(50),
    height: Matrics.ScaleValue(50),
    alignItems: "flex-start"
  }
};
module.exports = Styles;
