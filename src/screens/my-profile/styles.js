import {Color, Matrics} from '../../common/styles';

export default styles = {
  safeView: {
    flex: 1,
  },
  container: {
    backgroundColor: Color.white,
  },
  displayView: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
  },
  viewFlex: {width: 120},
  labelTitle: {fontSize: 14, color: '#999'},
  viewMomentValue: {
    flex: 1,
  },
  valueText: {
    color: '#000',
  },
  imageView: {
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#eee',
    width: Matrics.screenWidth / 5,
    height: Matrics.screenWidth / 5,
    borderRadius: Matrics.screenWidth / 10,
  },
  UserImage: {
    width: Matrics.screenWidth / 5,
    height: Matrics.screenWidth / 5,
    borderRadius: Matrics.screenWidth / 10,
  },
};
