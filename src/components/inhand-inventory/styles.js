import {Color} from '../../common/styles';

export default styles = {
  container: {
    backgroundColor: Color.white,
    flex: 1,
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Color.black,
  },
  descriptionText: {
    fontSize: 14,
    color: Color.black30,
  },
  seprationView: {
    borderBottomWidth: 1,
    borderColor: Color.paleGreyThree,
    padding: 10,
  },
  paddingH: {
    paddingHorizontal: 5,
  },
  flatListCss: {flex: 1, paddingTop: 0},
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
  },
  rightView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: Color.black30,
  },
  noItemText: {color: 'grey', fontSize: 16},
  noItemView: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
