import { color } from 'react-native-reanimated';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {Color, ApplicationStyles, Matrics} from '../../common/styles';

export default styles = {
  ...ApplicationStyles,
  safeView: {
    flex: 1,
  },
  container: {
    backgroundColor: Color.white,
  },
  animatedView: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 50,
    width: '100%',
    backgroundColor: Color.primary,
  },
  textInputCss: {
    height: 40,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: Color.white,
    borderColor: Color.black,
    paddingVertical: 0,
    paddingHorizontal: 28,
    fontSize: 16,
    color: Color.primary,
  },
  clearSearchIcon: {
    position: 'absolute',
    zIndex: 1,
    right: 15,
    top: 13,
  },
  categoryFilterView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  categoryTextStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearCategory: {
    paddingVertical: 3,
  },
  filterTouchableButton: {
    backgroundColor: Color.paleGreyThree,
    height: 40,
    width: Matrics.screenWidth / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterText: {
    color: Color.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10
  },
  filterAndSortView: {
    flexDirection: 'row',
    width: Matrics.screenWidth
  }
};
