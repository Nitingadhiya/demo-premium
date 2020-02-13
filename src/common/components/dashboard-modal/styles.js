import { Color, Images, Matrics, Fonts, ApplicationStyles } from "../../styles";
export default (Styles = {
  ...ApplicationStyles,
  mainModalView: {
    flex: 1,
    backgroundColor: Color.white
  },
  bodyView: {
    backgroundColor: "#fff",
    margin: Matrics.ScaleValue(15),
    borderRadius: Matrics.ScaleValue(5),
    padding: Matrics.ScaleValue(5)
  },
  subView: {},
  listView: {
    flexDirection: "row",
    paddingBottom: Matrics.ScaleValue(5),
    marginVertical: Matrics.ScaleValue(5),
    borderBottomWidth: 1,
    borderBottomColor: Color.paleGrey
  },
  checkboxView: {
    borderWidth: 1,
    borderRadius: Matrics.ScaleValue(9),
    height: Matrics.ScaleValue(18),
    width: Matrics.ScaleValue(18),
    marginRight: Matrics.ScaleValue(3),
    marginTop: Matrics.ScaleValue(2)
  },
  checkboxFillView: {
    marginRight: Matrics.ScaleValue(3),
    marginTop: Matrics.ScaleValue(2)
  },
  textAgree: {
    fontSize: Matrics.ScaleValue(14),
    fontFamily: Fonts.type.RubikBold,
    color: Color.black70,
    lineHeight: Matrics.ScaleValue(20)
  },
  descText: {
    fontSize: Matrics.ScaleValue(12),
    fontFamily: Fonts.type.Rubik,
    color: Color.black70,
    marginRight: Matrics.ScaleValue(10),
    lineHeight: Matrics.ScaleValue(16)
  },
  buttonStyles: {
    padding: Matrics.ScaleValue(4)
  },
  viewButton: {
    alignItems: "flex-start",
    height: Matrics.ScaleValue(30)
  },
  disabledText: {
    color: Color.green
  },
  opacityView: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1
  },
  customTextStyle: {
    fontSize: Matrics.ScaleValue(10)
  },
  actionName: {
    color: Color.black30,
    fontSize: Matrics.ScaleValue(16),
    fontFamily: Fonts.type.RubikBold
  },
  actionDescription: {
    color: Color.black30,
    fontSize: Matrics.ScaleValue(14),
    fontFamily: Fonts.type.Rubik,
    marginBottom: Matrics.ScaleValue(10)
  },
  actTextList: { flexWrap: "wrap" },
  textNotFound: {
    color: Color.darkRed,
    fontSize: Matrics.ScaleValue(16),
    fontFamily: Fonts.type.Rubik,
    textAlign: "center"
  }
});
