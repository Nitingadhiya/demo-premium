import {Color} from '../../common/styles';

export default (styles = {
  container: {
    flex: 1,
  },
  productListIcon: {
    position: 'absolute',
    zIndex: 1,
    height: 50,
    width: 50,
    borderRadius: 25,
    bottom: 40,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primary,
  },
  floatView: {
    borderWidth: 1,

    // marginRight: -20,
  },
});
