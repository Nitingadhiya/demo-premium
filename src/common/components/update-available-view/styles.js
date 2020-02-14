import {Color, Matrics} from '../../styles';

export default Styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Color.primary,
    padding: Matrics.ScaleValue(3),
    paddingHorizontal: Matrics.ScaleValue(8),
  },
  newVersionText: {color: '#fff', fontSize: 14},
  updateButtonText: {color: Color.primary, fontSize: 14},
  updateButton: {
    padding: Matrics.ScaleValue(5),
    paddingHorizontal: Matrics.ScaleValue(10),
    backgroundColor: Color.white,
    borderRadius: Matrics.ScaleValue(5),
  },
};
module.exports = Styles;
