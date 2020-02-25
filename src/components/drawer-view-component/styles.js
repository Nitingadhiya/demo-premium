import {Color, Matrics, Fonts, ApplicationStyles} from '../../common/styles';

export default styles = {
  container: {
    borderColor: Color.paleGreyTwo,
    padding: 5,
    backgroundColor: Color.white,
    margin: 5,
    borderRadius: 5,
  },
  font16Center: {fontSize: 16, textAlign: 'center'},
  bodyView: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
  },
  square: {
    width: '10%',
    height: 20,
    borderWidth: 2,
    borderColor: Color.primary,
  },
};
