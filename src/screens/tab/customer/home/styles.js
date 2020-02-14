import {Color} from '../../../../common/styles';

export default styles = {
  mainContainer: {
    flex: 1,
  },
  bottomButton: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionTouch: {
    flex: 1,
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    backgroundColor: Color.primary,
  },
};
module.exports = styles;
