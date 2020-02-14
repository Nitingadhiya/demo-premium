import {Color, Matrics, Fonts, ApplicationStyles} from '../../common/styles';

export default styles = {
  systemTextInput: {
    height: Matrics.ScaleValue(45),
    width: '100%',
    borderWidth: 1,
    borderColor: '#d5d5d5',
    borderRadius: Matrics.ScaleValue(5),
    paddingHorizontal: Matrics.ScaleValue(5),
    marginTop: 10,
  },
  touchSave: {
    height: Matrics.ScaleValue(40),
    width: '90%',
    backgroundColor: Color.primary,
    marginBottom: 10,
    marginTop: 20,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: Matrics.ScaleValue(5),
  },
  touchSaveText: {
    color: 'white',
    fontSize: 14,
  },
};
