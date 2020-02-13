import { Color, Images, Matrics, Fonts, ApplicationStyles } from "../../styles";
export default Styles = {
  bgImage: {
    width: Matrics.screenWidth - Matrics.ScaleValue(20),
    height: Matrics.screenWidth / 2
  },
  itemImage: {
    overflow: "hidden",
    borderTopLeftRadius: Matrics.ScaleValue(5),
    borderTopRightRadius: Matrics.ScaleValue(5)
  },
  listItem: {
    elevation: 20,
    borderWidth: 0,
    margin: Matrics.ScaleValue(10),
    marginHorizontal: Matrics.ScaleValue(20),
    borderRadius: Matrics.ScaleValue(10)
  },
  itemView: {
    borderRadius: Matrics.ScaleValue(5),
    backgroundColor: Color.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 20,
    //marginBottom: Matrics.ScaleValue(20),
    borderWidth: 0,
    borderColor: Color.paleGreyTwo
  },
  bgView: {
    backgroundColor: "rgba(0,0,0,0.3)",
    flex: 1,
    width: Matrics.screenWidth - Matrics.ScaleValue(38),
    padding: Matrics.ScaleValue(5),
    justifyContent: "flex-end",
    flexWrap: "wrap"
  },
  itemTitle: {
    color: Color.white,
    fontSize: Matrics.ScaleValue(20),
    fontFamily: Fonts.type.RubikBold
    // marginRight: Matrics.ScaleValue(20),
    // marginLeft: Matrics.ScaleValue(5),
  },
  itemSubTitle: {
    color: Color.white,
    fontSize: Matrics.ScaleValue(12),
    marginLeft: Matrics.ScaleValue(5),
    marginRight: Matrics.ScaleValue(15)
  },
  descriptionView: {
    padding: Matrics.ScaleValue(10),
    paddingTop: Matrics.ScaleValue(0),
    width: Matrics.screenWidth - Matrics.ScaleValue(50)
  },
  locationText: {
    color: Color.black70,
    fontSize: Matrics.ScaleValue(11.5)
  },
  locationView: {
    flexDirection: "row"
  },
  iconView: {
    width: Matrics.ScaleValue(20),
    alignItems: "center",
    marginTop: Matrics.ScaleValue(2)
  },
  topDistanceView: {
    flexDirection: "row",
    position: "absolute",
    top: 0,
    //justifyContent: "space-between",
    //width: "100%",
    marginTop: Matrics.ScaleValue(5),
    marginHorizontal: Matrics.ScaleValue(5),
    right: Matrics.ScaleValue(0)
  },
  transportTypeView: {
    backgroundColor: Color.darkRed,
    borderRadius: Matrics.ScaleValue(5),
    justifyContent: "center",
    paddingHorizontal: Matrics.ScaleValue(5),
    paddingVertical: Matrics.ScaleValue(2)
  },
  transportText: {
    color: Color.white,
    fontSize: Matrics.ScaleValue(10)
  },
  distanceSubView: {
    backgroundColor: Color.darkRed, //"rgba(0,0,0,0.2)",
    paddingHorizontal: Matrics.ScaleValue(5),
    paddingVertical: Matrics.ScaleValue(2),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Matrics.ScaleValue(5)
  },
  distanceText: {
    color: Color.white,
    fontSize: Matrics.ScaleValue(7)
  },
  mainAdvantageView: {
    marginTop: Matrics.ScaleValue(10)
  },
  advantageView: {
    flexDirection: "row",
    flex: 1,
    paddingVertical: Matrics.ScaleValue(2)
    //borderBottomWidth: 1,
    //borderColor: Color.paleGrey,
    //alignItems: "center"
  },
  textRes: {
    fontSize: Matrics.ScaleValue(12),
    fontFamily: Fonts.type.Rubik,
    flex: 1,
    paddingLeft: Matrics.ScaleValue(5),
    color: Color.black70
  },
  advantageText: {
    fontFamily: Fonts.type.RubikBold,
    fontSize: Matrics.ScaleValue(14),
    color: Color.black30
  },
  companyViewStyles: {
    marginHorizontal: Matrics.ScaleValue(10),
    marginTop: Matrics.ScaleValue(5)
  }
};
module.exports = Styles;
