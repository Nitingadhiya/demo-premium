import { Color, Matrics, Fonts, ApplicationStyles } from "../../styles";

export default (Styles = {
  ...ApplicationStyles,
  signInView: {
    paddingHorizontal: Matrics.ScaleValue(15),
    backgroundColor: Color.paleGrey,
    height: Matrics.ScaleValue(95)
  },
  signInTextView: {
    height: Matrics.ScaleValue(50),
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  signInText: {
    fontFamily: Fonts.type.Rubik,
    fontSize: Matrics.ScaleValue(32),
    color: Color.darkThree
  },
  headerView: {
    flexDirection: "row",
    height: Matrics.ScaleValue(44),
    alignItems: "center",
    justifyContent: "space-between"
  },
  stepText: {
    color: Color.darkRed,
    fontSize: Matrics.ScaleValue(12),
    fontFamily: Fonts.type.Rubik,
    lineHeight: Matrics.ScaleValue(24)
  },
  skipText: {
    fontSize: Matrics.ScaleValue(13),
    color: Color.lightishRed,
    textAlign: "right"
  }
});
