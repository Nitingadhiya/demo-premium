import {
  Color,
  Images,
  Matrics,
  Fonts,
  ApplicationStyles
} from "../../../common/styles";
export default Styles = {
  ...ApplicationStyles,
  q2Title: {
    fontSize: Matrics.ScaleValue(18),
    color: Color.black30,
    fontFamily: Fonts.type.Rubik,
    marginBottom: Matrics.ScaleValue(5)
  },
  q2subTitle: {
    fontSize: Matrics.ScaleValue(14),
    color: Color.black30,
    marginBottom: Matrics.ScaleValue(5),
    fontFamily: Fonts.type.Rubik
  },
  q2TitleOption: {
    fontSize: Matrics.ScaleValue(16),
    color: Color.black70,
    marginLeft: Matrics.ScaleValue(5),
    fontFamily: Fonts.type.Rubik,
    marginRight: Matrics.ScaleValue(18)
  },
  q2OptionView: {
    flexDirection: "row",
    alignItems: "center"
    //paddingVertical: Matrics.ScaleValue(3)
    //borderWidth: 1
    //paddingLeft: Matrics.ScaleValue(10),
  },
  checkedRoundBRD: {
    borderWidth: 1,
    height: Matrics.ScaleValue(20),
    width: Matrics.ScaleValue(20),
    borderColor: Color.paleGreyTwo,
    borderRadius: Matrics.ScaleValue(10),
    justifyContent: "center",
    alignItems: "center"
    //paddingLeft: Matrics.ScaleValue(10)
  },
  dotStyles: {
    backgroundColor: Color.darkRed,
    height: Matrics.ScaleValue(12),
    width: Matrics.ScaleValue(12),
    borderRadius: Matrics.ScaleValue(6)
  },
  animationCheckboxView: {
    width: Matrics.ScaleValue(50),
    height: Matrics.ScaleValue(50),
    alignItems: "flex-start"
  },
  animationTouchStyles: {
    paddingLeft: Matrics.ScaleValue(10),
    paddingVertical: Matrics.ScaleValue(5)
  }
};
module.exports = Styles;
