import { Color, Matrics, Fonts } from "../../styles";

export default (Styles = {
  mainFront: {
    backgroundColor: Color.white,
    margin: Matrics.ScaleValue(5),
    padding: Matrics.ScaleValue(5),
    borderWidth: 2,
    borderColor: Color.paleGreyTwo,
    borderRadius: Matrics.ScaleValue(5)
  },
  driverTextView: {
    marginBottom: Matrics.ScaleValue(10)
  },
  mainView: {
    margin: Matrics.ScaleValue(10),
    flex: 1
  },
  mainViewCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  bgMaintain: {
    backgroundColor: Color.white,
    margin: Matrics.ScaleValue(15),
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    elevation: 4,
    borderRadius: Matrics.ScaleValue(5)
  },
  bodyModalContent: {
    padding: Matrics.ScaleValue(10)
  },
  headerView: {
    height: Matrics.ScaleValue(40),
    borderBottomWidth: 1,
    borderBottomColor: Color.paleGreyThree,
    justifyContent: "center",
    alignItems: "center"
  },
  headerText: {
    fontSize: Matrics.ScaleValue(16),
    fontFamily: Fonts.type.Rubik
  },
  starView: {
    flexDirection: "row",
    marginRight: Matrics.ScaleValue(5)
  },
  starIconView: {
    marginBottom: Matrics.ScaleValue(10)
  },
  textdesc: {
    color: Color.textGray,
    fontSize: Matrics.ScaleValue(12),
    marginTop: Matrics.ScaleValue(5)
  },
  starDriver: {
    color: Color.black30,
    fontSize: Matrics.ScaleValue(14),
    fontFamily: Fonts.type.RubikBold
  },
  progressMainView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: Matrics.ScaleValue(10),
    borderBottomWidth: 1,
    borderColor: Color.paleGrey
  },
  // progressView: {
  //   width: "100%",
  //   height: 7,
  //   backgroundColor: Color.paleGreyThree,
  //   borderRadius: 5
  // },
  // fillProgressView: {
  //   backgroundColor: Color.darkRed
  // },
  progressView: {
    width: "100%",
    height: Matrics.ScaleValue(15),
    backgroundColor: Color.paleGreyThree,
    borderRadius: 5
  },
  fillProgressView: {
    backgroundColor: Color.darkRed
  },
  bottomBTN: {
    height: Matrics.ScaleValue(40),
    borderBottomLeftRadius: Matrics.ScaleValue(5),
    borderBottomRightRadius: Matrics.ScaleValue(5)
  },
  stepCompleText: {
    color: Color.white,
    fontSize: Matrics.ScaleValue(10),
    fontFamily: Fonts.type.Rubik,
    textAlign: "center",
    lineHeight: Matrics.ScaleValue(14)
  },
  verifyView: {
    marginTop: Matrics.ScaleValue(10)
  },
  subVerifyView: {
    flexDirection: "row",
    //alignItems: "center",
    marginVertical: Matrics.ScaleValue(5)
  },
  textVerify: {
    fontSize: Matrics.ScaleValue(14),
    color: Color.black70,
    fontFamily: Fonts.type.Rubik,
    marginLeft: Matrics.ScaleValue(5),
    flex: 1
  }
});
module.exports = Styles;
