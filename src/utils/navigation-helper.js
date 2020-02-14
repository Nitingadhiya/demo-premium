import {CommonActions} from '@react-navigation/native';
const NavigationHelper = {
  navigate(navigation, screen, params) {
    navigation.dispatch(
      CommonActions.navigate({
        name: screen,
        params: params,
      }),
    );
  },

  reset(navigation, screen) {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: screen}],
      }),
    );
  },
};

export default NavigationHelper;
