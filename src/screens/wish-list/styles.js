import {Color} from '../../common/styles';

export default styles = {
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
  refreshText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.primary,
  },
  refreshView: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
};
