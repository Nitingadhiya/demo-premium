import { Color, Images, Matrics, Fonts, ApplicationStyles } from "../../styles";
import { ifIphoneX } from "react-native-iphone-x-helper";
export default Styles = {
  ...ApplicationStyles,
  q2Title: {
    fontSize: Matrics.ScaleValue(18),
    color: Color.black30,
    fontFamily: Fonts.type.Rubik,
    marginBottom: Matrics.ScaleValue(10)
  },
  noResultView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: Matrics.screenHeight / 1.25
  },
  textNoResult: {
    fontSize: Matrics.ScaleValue(14),
    color: Color.black30,
    fontFamily: Fonts.type.Rubik
  },
  custom: {
    container: {
      width: "100%",
      marginLeft: 0,
      marginBottom: 0,
      paddingLeft: 0,
      marginTop: 0,
      ...ifIphoneX(
        {
          paddingTop: 35
        },
        {
          paddingTop: 0
        }
      )
    },
    subItem: {
      borderBottomWidth: 1,
      borderColor: Color.paleGreyTwo,
      paddingVertical: Matrics.ScaleValue(15)
    },
    selectToggleIconComponent: {
      borderWidth: 1
    },
    selectToggleText: {
      fontSize: Matrics.ScaleValue(15),
      color: Color.textGray,
      fontFamily: Fonts.type.Rubik
    },
    selectToggle: {
      borderWidth: 1,
      borderColor: Color.paleGreyTwo,
      height: Matrics.ScaleValue(40),
      borderRadius: Matrics.ScaleValue(5),
      paddingHorizontal: Matrics.ScaleValue(5)
    },
    searchTextInput: {
      fontSize: Matrics.ScaleValue(16),
      fontFamily: Fonts.type.Rubik,
      color: Color.black70
    },
    button: {
      backgroundColor: Color.darkRed,
      height: Matrics.ScaleValue(40),
      justifyContent: "center",
      ...ifIphoneX(
        {
          marginBottom: 20
        },
        {
          //paddingBottom: 0
        }
      )
    },
    cancelButton: {
      height: Matrics.ScaleValue(40),
      ...ifIphoneX(
        {
          marginBottom: 20
        },
        {
          paddingBottom: 0
        }
      )
    },
    subItemText: {
      fontWeight: "normal",
      color: Color.black,
      fontSize: Matrics.ScaleValue(16),
      fontFamily: Fonts.type.Rubik
    },
    chipContainer: {
      backgroundColor: "#41b883",
      borderWidth: 0,
      borderRadius: Matrics.ScaleValue(5),
      height: Matrics.ScaleValue(25),
      justifyContent: "center",
      marginTop: Matrics.ScaleValue(5)
    },
    chipText: {
      color: Color.white,
      fontSize: Matrics.ScaleValue(14),
      fontFamily: Fonts.type.RubikBold
    },
    chipIcon: {
      color: Color.black30,
      marginTop: 0,
      marginBottom: 0
    },
    selectToggleText: {
      fontSize: Matrics.ScaleValue(16),
      color: Color.black70,
      fontFamily: Fonts.type.Rubik
    },
    selectToggle: {
      height: Matrics.ScaleValue(50),
      borderWidth: 1,
      borderRadius: Matrics.ScaleValue(5),
      borderColor: Color.paleGreyTwo,
      paddingHorizontal: Matrics.ScaleValue(10)
    }
  }
};
module.exports = Styles;
