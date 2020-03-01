import {Color, Matrics, Fonts, ApplicationStyles} from '../../common/styles';

export default styles = {
  container: {
    width: '90%',
    backgroundColor: Color.white,
    paddingTop: 20,
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 10,
    margin: 20,
    top: 0,
  },
  imageStyle: {
    alignSelf: 'center',
  },
  txtfieldStyle: {
    paddingTop: Matrics.ScaleValue(9),
  },
  textBoxView: {flex: 1, justifyContent: 'flex-start', alignItems: 'center'},
  subTextBoxView: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
  },
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  userView: {
    height: Matrics.ScaleValue(120),
    width: Matrics.screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  userImage: {
    height: Matrics.ScaleValue(120),
    width: Matrics.ScaleValue(120),
    borderRadius: Matrics.ScaleValue(120) / 2,
  },
  customStyle: {
    paddingLeft: 0,
    marginLeft: 0,
  },
};
