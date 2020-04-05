import {Color, Matrics, Fonts, ApplicationStyles} from '../../common/styles';
import {Platform} from 'react-native';

export default styles = {
  ...ApplicationStyles,
  modalViewContainer: {
    flex: 1,
  },
  textViewStyle: {
    flex: 1,
    backgroundColor: Color.paleGreyTwo,
  },
  keyboardScroll: {
    flex: 1,
  },
};
