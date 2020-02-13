import { Color, Matrics, Fonts } from "../../styles";

export default (Styles = {
  mainFront: {
    backgroundColor: Color.white,
    marginHorizontal: Matrics.ScaleValue(5),
    padding: Matrics.ScaleValue(5),
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: Color.paleGreyTwo,
    borderRadius: Matrics.ScaleValue(5),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingTop: Matrics.ScaleValue(10)
  },
  progressMainView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: Matrics.ScaleValue(10)
  },
  progressView: {
    width: "100%",
    height: Matrics.ScaleValue(15),
    backgroundColor: Color.paleGreyThree,
    borderRadius: 5
  },
  fillProgressView: {
    backgroundColor: Color.darkRed
  },
  stepCompleText: {
    color: Color.white,
    fontSize: Matrics.ScaleValue(10),
    fontFamily: Fonts.type.Rubik,
    textAlign: "center",
    lineHeight: Matrics.ScaleValue(14)
  }
});
module.exports = Styles;
