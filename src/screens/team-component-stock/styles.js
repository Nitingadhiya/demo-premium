import {Color, Matrics, ApplicationStyles} from '../../common/styles';

export default styles = {
  ...ApplicationStyles,
  container: {
    backgroundColor: Color.white,
    flex: 1,
  },
  tabView: {
    width: Matrics.screenWidth,
    flexDirection: 'row',
    backgroundColor: Color.primary,
    paddingBottom: 3,
  },
  touchButton: {
    height: 45,
    width: Matrics.screenWidth / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    color: Color.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  inActiveCss: {
    borderBottomWidth: 2,
    borderColor: Color.primary,
  },
  activeTabCss: {
    borderBottomWidth: 2,
    borderColor: Color.white,
  },
};
