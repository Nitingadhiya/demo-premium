import { Color, Matrics, Fonts } from "../../styles";
export default (Styles = {
  innerViewCard: {
    flexDirection: "row",
    zIndex: 1
  },
  logisticTitle: {
    fontSize: Matrics.ScaleValue(12),
    fontFamily: Fonts.type.RubikBold,
    color: Color.black30
  },
  companyStarView: {
    //flexDirection: "row",
    marginRight: Matrics.ScaleValue(2),
    alignItems: "flex-start",
    marginTop: Matrics.ScaleValue(2)
  },
  companySmallStarView: {
    marginTop: Matrics.ScaleValue(1)
  },
  compReviewText: {
    fontSize: Matrics.ScaleValue(8),
    color: Color.lightGray,
    fontFamily: Fonts.type.Rubik
  },
  hrTag: {
    borderWidth: 0.5,
    borderColor: Color.paleGreyTwo,
    marginVertical: Matrics.ScaleValue(10)
  },
  viewResp: {
    width: (Matrics.screenWidth - Matrics.ScaleValue(50)) / 3,
    alignItems: "center"
  },
  companyBadgeText: {
    color: Color.darkGray,
    fontFamily: Fonts.type.Rubik,
    fontSize: Matrics.ScaleValue(11)
  },
  drawLine: {
    borderWidth: 1.5,
    width: Matrics.ScaleValue(18),
    alignSelf: "center",
    marginTop: Matrics.ScaleValue(5),
    marginBottom: Matrics.ScaleValue(10)
  },
  countTextStyles: {
    color: Color.black,
    fontFamily: Fonts.type.RubikBold,
    fontSize: Matrics.ScaleValue(12),
    marginBottom: Matrics.ScaleValue(10)
  },
  companyLogoView: {
    alignItems: "flex-end",
    right: 0
  },
  companyLogoImage: {
    width: Matrics.ScaleValue(80),
    height: Matrics.ScaleValue(40)
  },
  divisonView: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap"
  },
  companyRatingView: {
    flexDirection: "row",
    marginTop: Matrics.ScaleValue(2)
  }
});
module.exports = Styles;
