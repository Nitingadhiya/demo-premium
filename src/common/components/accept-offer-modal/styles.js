import { Color, Images, Matrics, Fonts, ApplicationStyles } from "../../styles";
export default Styles = {
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
  heading: {
    color: Color.black30,
    fontSize: Matrics.ScaleValue(16),
    fontFamily: Fonts.type.Rubik
  },
  innerView: {
    padding: Matrics.ScaleValue(5)
  },
  spinnerView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  sharebleTouch: { 
    borderRadius: Matrics.ScaleValue(5), 
    flexDirection: 'row', 
    alignItems: 'center', 
    height: 45, 
    width: '80%', 
    backgroundColor: Color.darkRed, 
    justifyContent: 'center' 
  },
  shareJobText:{ 
    marginLeft: Matrics.ScaleValue(10), 
    fontSize: Matrics.ScaleValue(16), 
    fontFamily: Fonts.type.Rubik, 
    color: Color.white 
  }
};