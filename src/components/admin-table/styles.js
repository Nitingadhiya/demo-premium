import {Color, Matrics, Fonts, ApplicationStyles} from '../../common/styles';

export default styles = {
  fieldView: {
    flexDirection: 'row',
    borderWidth: 0.2,
    borderColor: '#d3d3d3',
  },
  mainViewField: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  mainTextView: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    flex: 0.5,
    alignItems: 'flex-end',
    borderWidth: 0.2,
    borderColor: '#d3d3d3',
    flexWrap: 'wrap',
  },
  extraWidth: {
    flex: 1,
  },
  todayCountWidth: {
    flex: 0.3,
  },
  totalCountWidth: {
    flex: 0.4,
  },
  textTitleBold: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
};
