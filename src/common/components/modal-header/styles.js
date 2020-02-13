import { Platform } from "react-native";
import { Color, Matrics, Fonts } from "../../styles";
import { ifIphoneX } from "react-native-iphone-x-helper";
export default (Styles = {
  modalHeader: {
    height: Matrics.ScaleValue(50),
    borderBottomWidth: 1,
    borderBottomColor: Color.paleGreyTwo,
    width: "100%",
    ...ifIphoneX(
      {
        marginTop: 35
      },
      {
        marginTop: Platform.OS === "android" ? 0 : 20
      }
    ),
    alignItems: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.white
  },
  resetBtn: {
    padding: Matrics.ScaleValue(10)
  },
  modalTitle: {
    flex: 1
  },
  titleText: {
    fontSize: Matrics.ScaleValue(20),
    fontFamily: Fonts.type.RubikMedium,
    color: Color.darkThree,
    textAlign: "center"
  },
  resetText: {
    fontSize: Matrics.ScaleValue(13),
    fontFamily: Fonts.type.RubikRegular,
    color: Color.lightishRed,
    textAlign: "right"
  },
  spaceCover: {
    width: Matrics.ScaleValue(50)
  },
  removeHeaderSpace: {
    marginTop: 0
  }
});
