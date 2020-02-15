import {Color, Matrics, Fonts, ApplicationStyles} from '../../common/styles';

export default styles = {
  container: {
    backgroundColor: '#fff',
    height: Matrics.screenHeight,
  },
  viewFlex: {flex: 1},
  modalTitleView: {
    height: Matrics.ScaleValue(45),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Color.paleGreyTwo,
    flexDirection: 'row',
  },
  closeIcon: {
    position: 'absolute',
    zIndex: 1,
    paddingHorizontal: 5,
    left: 0,
  },
  titleText: {
    fontSize: Matrics.ScaleValue(18),
    color: Color.black,
    fontWeight: 'bold',
  },
  bodyView: {
    borderWidth: 1,
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  textProblem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.black,
  },
  textComplaintBy: {fontSize: 14, color: Color.black30},
  bold: {fontWeight: 'bold'},
  flexDirection: {flexDirection: 'row'},
  bold14: {fontWeight: 'bold', fontSize: 14},
  font14: {fontSize: 14},
  normal14: {fontSize: 14, fontWeight: 'normal'},
  mrgView: {flex: 1, marginBottom: 60},
  bgDetailsView: {backgroundColor: Color.lightGray},
  detailTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
    marginVertical: 10,
    marginLeft: 10,
  },
  detailsContainer: {
    borderBottomWidth: 1,
    borderColor: Color.paleGreyTwo,
    flex: 1,
    padding: 10,
  },
  wrap: {flex: 1, flexWrap: 'wrap'},
  viewSubDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewSub1Details: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  newTitleView: {
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
};
