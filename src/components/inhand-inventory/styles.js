import {Color} from '../../common/styles';

export default styles = {
  container: {
    backgroundColor: Color.white,
    flex: 1,
  },

  paddingH: {
    paddingHorizontal: 5,
  },
  flatListCss: {flex: 1, paddingTop: 0},
  fontBold: {
    fontWeight: 'bold',
  },
  leftView: {
    width: 80,
    borderRightWidth: 1,
    borderColor: Color.paleGreyTwo,
    marginRight: 5,
    padding: 5,
    paddingLeft: 0,
  },
  oneLineView: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: Color.paleGreyTwo,
    alignItems: 'center',
  },
  paddingBottom5: {
    paddingBottom: 10,
  },
  rightView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  borderRight: {
    borderRightWidth: 1,
    borderColor: Color.paleGreyThree,
    marginRight: 3,
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: Color.black,
    textAlign: 'right',
  },
  textShow: {
    fontSize: 12,
    color: Color.black,
  },
  descriptionText: {
    fontSize: 12,
    color: Color.black,
  },
  seprationView: {
    borderBottomWidth: 1,
    borderColor: Color.paleGreyThree,
  },
  viewSerialNo: {
    // flex: 1,
  },
  spView: {
    height: 10,
    width: '100%',
    backgroundColor: Color.paleGrey,
    borderBottomWidth: 1,
    borderColor: Color.paleGrey,
  },
  noItemText: {color: 'grey', fontSize: 16},
  noItemView: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightLable: {
    width: 70,
  },
  textRight: {
    textAlign: 'right',
  },
};
