import {Color, Matrics} from '../../common/styles';

export default (styles = {
  container: {
    backgroundColor: Color.white,
    padding: 10,
  },
  textStyle2: {
    fontSize: Matrics.ScaleValue(14),
    color: Color.lightGray,
    justifyContent: 'flex-end',
  },
  UserImage: {
    height: Matrics.ScaleValue(50),
    width: Matrics.ScaleValue(50),
    borderRadius: Matrics.ScaleValue(50 / 2),
  },
  textStyle: {
    fontSize: Matrics.ScaleValue(16),
    fontWeight: 'bold',
    color: Color.black,
    flex: 1,
  },
  textStyle1: {
    fontSize: Matrics.ScaleValue(13),
    color: Color.lightGray,
  },
  textinputViewStyle: {
    backgroundColor: Color.white,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    marginBottom: Matrics.ScaleValue(5),
  },
  textInput: {
    backgroundColor: 'transparent',
    height: Matrics.ScaleValue(50),
    borderWidth: 1,
    marginLeft: 0,
    marginTop: 0,
    borderColor: Color.paleGreyTwo,
    paddingHorizontal: 10,
    color: Color.black70,
    fontSize: Matrics.ScaleValue(16),
  },
  userDetailView: {
    justifyContent: 'space-around',
    flex: 3,
    marginLeft: Matrics.ScaleValue(10),
  },
  imageViewSetting: {
    paddingVertical: Matrics.ScaleValue(6),
    paddingHorizontal: Matrics.ScaleValue(12),
  },
  messageView: {
    borderBottomColor: Color.silver,
    borderBottomWidth: 1,
    marginTop: Matrics.ScaleValue(5),
  },
  flatView: {
    padding: Matrics.ScaleValue(10),
    paddingRight: Matrics.ScaleValue(0),
  },
  textinputStyle: {
    marginLeft: Matrics.ScaleValue(20),
    fontSize: Matrics.ScaleValue(15),
    flex: 1,
  },
  sendIconStyle: {
    alignSelf: 'center',
    marginRight: Matrics.ScaleValue(15),
  },
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    top: '45%',
  },
  spinnerViewPOS: {
    position: 'absolute',
    zIndex: 1,
    top: '45%',
    left: '40%',
  },
  badgeCountView: {
    backgroundColor: Color.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    right: 0,
  },
  nextandSubmitClass: {
    height: 45,
    alignItems: 'center',
    marginTop: 10,
  },
  touchNextButton: {
    width: '60%',
    height: 45,
    backgroundColor: Color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  font16White: {
    color: '#fff',
    fontSize: 16,
  },
  borderW1: {
    borderColor: '#d3d3d3',
    borderWidth: 1,
  },
  viewSystemName: {
    height: 40,
    justifyContent: 'center',
  },
  spinnerViewCenter: {
    position: 'absolute',
    zIndex: 1,
    top: '45%',
    alignSelf: 'center',
  },
});
