import {Color, Matrics, Fonts, ApplicationStyles} from '../../common/styles';

export default styles = {
  container: {
    height: Matrics.ScaleValue(160),
    width: Matrics.screenWidth - 40,
    alignSelf: 'center',
    borderWidth: 1,
    shadowColor: Color.black,
    shadowOffset: {width: 5, height: 5},
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Matrics.screenHeight / 2 - 75,
  },
  subModalView: {
    backgroundColor: Color.white,
    height: Matrics.ScaleValue(160),
    width: Matrics.screenWidth - 40,
    alignItems: 'center',
  },
  modalTitleView: {
    height: 40,
    width: '100%',
    borderColor: Color.lightGray,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: Color.black,
    fontSize: 16,
  },
  viewBody: {
    height: 75,
    justifyContent: 'center',
    padding: 10,
  },
  textName: {
    color: Color.black,
    fontSize: 16,
  },
  bold: {fontWeight: 'bold'},
  closeButton: {
    backgroundColor: Color.primary,
    height: 40,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
