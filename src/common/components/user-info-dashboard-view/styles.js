import {Color, Matrics} from '../../styles';

export default (Styles = {
  container: {
    padding: Matrics.ScaleValue(10),
    backgroundColor: Color.white,
  },
  userView: {
    flexDirection: 'row',
  },
  imageView: {
    justifyContent: 'flex-start',
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
    marginTop: 4
  },
  textStyle: {
    fontSize: Matrics.ScaleValue(14),
    fontWeight: 'bold',
    color: Color.black,
  },
  textStyle1: {
    fontSize: Matrics.ScaleValue(12),
    color: Color.black70,
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
    height: 50,
  },
  coinView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Matrics.ScaleValue(2)
  },
  coinCount: {
    fontSize: 13,
    marginRight: 5,
    fontWeight: 'bold',
  },
  viewFLXD: {
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
  },
});
module.exports = Styles;
