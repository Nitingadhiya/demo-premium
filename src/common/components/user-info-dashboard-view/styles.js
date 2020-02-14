import {Color, Matrics} from '../../styles';

export default Styles = {
  container: {
    padding: Matrics.ScaleValue(10),
    backgroundColor: Color.white,
  },
  userView: {
    flexDirection: 'row',
  },
  imageView: {
    justifyContent: 'center',
  },
  UserImage: {
    height: Matrics.ScaleValue(40),
    width: Matrics.ScaleValue(40),
    borderRadius: Matrics.ScaleValue(40 / 2),
    backgroundColor: '#d3d3d3',
  },
  viewStyle: {
    height: 40,
    flex: 3,
    justifyContent: 'center',
    paddingLeft: Matrics.ScaleValue(10),
  },
  textStyle: {
    fontSize: Matrics.ScaleValue(14),
    fontWeight: 'bold',
    color: Color.black,
  },
  textStyle1: {
    fontSize: Matrics.ScaleValue(12),
    color: Color.greyishBrown30,
  },
  textStyleLocation: {
    fontSize: Matrics.ScaleValue(11),
    color: Color.GRAY,
  },
  viewStyle1: {
    justifyContent: 'center',
    width: Matrics.ScaleValue(100),
    alignSelf: 'center',
  },
  rightDash: {
    width: 60,
    alignItems: 'flex-end',
  },
  mainRightDash: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: 20,
  },
};
module.exports = Styles;
