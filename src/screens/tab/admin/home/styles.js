import {Color, Matrics} from '../../../../common/styles';

export default styles = {
  safeView: {
    flex: 1,
    backgroundColor: Color.paleGrey,
  },
  bodyView: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  TouchBTN: {
    backgroundColor: Color.white,
    height: 50,
    width: Matrics.screenWidth - 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 10,
  },
};
module.exports = styles;
