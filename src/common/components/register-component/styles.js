import { Color, Matrics, Fonts, ApplicationStyles } from "../../styles";

export default (Styles = {
  ...ApplicationStyles,
  mainContainer: {
    flex: 1,
    backgroundColor: Color.black
  },
  mainView: {
    flex: 1
  },

  checkboxTitleStyle: {
    fontWeight: "normal",
    fontSize: Matrics.ScaleValue(13),
    color: Color.black70
  },
  checkboxView: {
    alignItems: "flex-start",
    marginRight: Matrics.ScaleValue(20)
  },
  chooseTypeReg: {
    borderWidth: 1,
    borderColor: Color.paleGreyTwo,
    borderRadius: Matrics.ScaleValue(5),
    flexDirection: "row",
    height: Matrics.ScaleValue(60),
    alignItems: "center",
    paddingHorizontal: Matrics.ScaleValue(20),
    marginTop: Matrics.ScaleValue(5)
  },
  textInput: {
    height: Matrics.ScaleValue(45),
    borderBottomWidth: 1,
    borderColor: Color.paleGreyTwo,
    fontSize: Matrics.ScaleValue(16),
    padding: 0,
    lineHeight: Matrics.ScaleValue(24),
    fontFamily: Fonts.type.Rubik,
    marginBottom: 3,
    paddingRight: Matrics.ScaleValue(45),
    padding: Matrics.ScaleValue(5),
    borderRadius: Matrics.ScaleValue(5)
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
  currentLocationView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: Matrics.ScaleValue(10),
    paddingRight: Matrics.ScaleValue(10),
    alignSelf: "flex-start"
  },
  currentLocationText: {
    color: Color.darkRed90,
    fontSize: Matrics.ScaleValue(13),
    fontFamily: Fonts.type.Rubik
  },
  placeInput: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Matrics.ScaleValue(5)
  },
  gAddressText: {
    color: Color.black70,
    fontSize: Matrics.ScaleValue(14),
    fontFamily: Fonts.type.Rubik,
    flex: 1
  },
  useTouch: {
    justifyContent: "flex-end",
    backgroundColor: Color.darkRed,
    padding: Matrics.ScaleValue(5),
    borderRadius: Matrics.ScaleValue(5)
  },
  useTouchText: {
    color: Color.white,
    fontSize: Matrics.ScaleValue(12),
    fontFamily: Fonts.type.Rubik
  }
});
module.exports = Styles;
