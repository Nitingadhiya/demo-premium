import { Color, Matrics, Fonts } from "../../styles";

export default (Styles = {
  container: {
    //flex: 1,
    marginTop: Matrics.ScaleValue(10),
    borderRadius: 1
  },
  row: {
    alignItems: "center",
    paddingLeft: 0,
    height: Matrics.ScaleValue(45),
    flexDirection: "row",
    backgroundColor: Color.white
  },
  listView: {
    // backgroundColor: Color.white,
  },
  textInputContainer: {
    backgroundColor: "transparent",
    borderColor: Color.paleGrey,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRadius: 5,
    height: Matrics.ScaleValue(50),
    justifyContent: "center"
  },
  textInput: {
    backgroundColor: "transparent",
    height: Matrics.ScaleValue(50),
    borderWidth: 1,
    marginLeft: 0,
    marginTop: 0,
    borderColor: Color.paleGreyTwo,
    paddingHorizontal: 10,
    fontFamily: Fonts.type.Rubik,
    color: Color.black70,
    fontSize: Matrics.ScaleValue(16)
  },
  description: {
    fontFamily: Fonts.type.Rubik,
    color: Color.black70,
    fontSize: Matrics.ScaleValue(16),
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: Color.white
  },
  flatListView: {
    borderWidth: 1,
    borderColor: Color.paleGreyTwo
  },
  selectAddress: {
    justifyContent: "center",
    paddingHorizontal: Matrics.ScaleValue(5),
    paddingVertical: Matrics.ScaleValue(12),
    borderBottomWidth: 1,
    borderColor: Color.paleGreyTwo
  },
  addressText: {
    color: Color.black70,
    fontFamily: Fonts.type.Rubik,
    fontSize: Matrics.ScaleValue(16)
  },
  listTextAddress: {
    fontSize: Matrics.ScaleValue(16),
    color: Color.black70,
    fontFamily: Fonts.type.Rubik
  },
  viewListAddress: {
    borderWidth: 1,
    borderColor: Color.paleGreyTwo,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    height: Matrics.ScaleValue(45),
    paddingLeft: Matrics.ScaleValue(10)
  },
  textView: { flex: 1, flexWrap: "wrap" }
});
module.exports = Styles;
