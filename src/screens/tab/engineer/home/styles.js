import {Color, Matrics} from '../../../../common/styles';

export default styles = {
  safeView: {
    flex: 1,
    backgroundColor: Color.paleGrey,
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
  bodyView: {
    backgroundColor: Color.white,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    marginBottom: 0,
    flex: 1,
  },
  subBodyView: {flex: 1, paddingBottom: 10},
  textDate: {fontSize: 20, textAlign: 'center'},
};
module.exports = styles;
