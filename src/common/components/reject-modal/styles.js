import { Color, Images, Matrics, Fonts, ApplicationStyles } from "../../styles";
export default (Styles = {
  ...ApplicationStyles,
  mainModalView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center"
  },
  bodyView: {
    backgroundColor: "#fff",
    marginHorizontal: Matrics.ScaleValue(15),
    marginVertical: Matrics.ScaleValue(10),
    borderRadius: Matrics.ScaleValue(5),
    padding: Matrics.ScaleValue(5),
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.245
  },
  reviewSections: {
    backgroundColor: Color.white,
    marginBottom: Matrics.ScaleValue(5),
    padding: Matrics.ScaleValue(5)
  },
  writeReviewLink: {
    fontSize: Matrics.ScaleValue(10),
    marginTop: Matrics.ScaleValue(10),
    color: Color.darkRed,
    fontFamily: Fonts.type.Rubik,
    textDecorationLine: "underline"
  },
  reviewPersonName: {
    fontFamily: Fonts.type.RubikBold
  },
  heading: {
    color: Color.black30,
    fontSize: Matrics.ScaleValue(16),
    fontFamily: Fonts.type.Rubik
  },
  reviewRatingView: {
    flex: 1
  },
  ratingStarView: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center"
  },
  reviewCategotyTiteText: {
    color: Color.black30,
    fontSize: Matrics.ScaleValue(16),
    marginRight: Matrics.ScaleValue(12),
    width: "40%",
    fontFamily: Fonts.type.Rubik
  },
  reviewCategoryView: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Matrics.ScaleValue(5)
  },
  categoryMainView: {
    marginBottom: Matrics.ScaleValue(10)
  },
  starView: {
    marginHorizontal: Matrics.ScaleValue(2)
  },
  innerView: {
    padding: Matrics.ScaleValue(5)
  },
  touchBtn: {
    flexDirection: "row"
  },
  checkView: {
    borderWidth: 1,
    borderRadius: Matrics.ScaleValue(4),
    borderColor: Color.paleGreyTwo,
    height: Matrics.ScaleValue(22),
    width: Matrics.ScaleValue(22),
    alignItems: "center",
    justifyContent: "center"
  },
  spinnerView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
});
