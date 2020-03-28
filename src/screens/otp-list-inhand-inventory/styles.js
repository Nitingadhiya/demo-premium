import {Color, Matrics, ApplicationStyles} from '../../common/styles';

export default styles = {
  ...ApplicationStyles,
  container: {
    backgroundColor: Color.white,
    flex: 1,
  },
  flatListCss: {flex: 1, paddingTop: 0},
  noItemText: {color: 'grey', fontSize: 16},
  noItemView: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontBold: {
    fontWeight: 'bold',
  },
  leftView: {
    width: 140,
    borderRightWidth: 1,
    borderColor: Color.paleGreyTwo,
    marginRight: 5,
    padding: 5,
  },
  oneLineView: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  rightView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Color.black,
  },
  descriptionText: {
    fontSize: 14,
    color: Color.black,
  },
  seprationView: {
    borderBottomWidth: 1,
    borderColor: Color.paleGreyThree,
  },
  viewSerialNo: {
    width: Matrics.screenWidth - 150,
  },
  spView: {
    height: 30,
    width: '100%',
    backgroundColor: Color.paleGrey,
    borderBottomWidth: 1,
    borderColor: Color.paleGrey,
    marginBottom: 5,
  },
};
