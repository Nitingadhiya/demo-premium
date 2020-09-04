import {Matrics, Color} from '../../../common/styles';

export default (styles = {
  labelClass: {
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
  },
  width120: {width: 120},
  font16_333: {
    color: '#333',
    fontSize: 16,
  },
  birthdayLabelText: {color: '#333', fontSize: 14, marginLeft: 5},
  flex1: {flex: 1},
  font16_999: {color: '#999', fontSize: 16},
  borderW1: {
    borderColor: '#d3d3d3',
    borderWidth: 1,
    marginVertical: Matrics.ScaleValue(5),
  },
  textFieldTitle: {
    fontSize: 16,
    color: Color.black70,
  },
});

module.exports = styles;
