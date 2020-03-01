import {Color, Matrics, Fonts, ApplicationStyles} from '../../common/styles';

export default styles = {
  container: {
    marginVertical: 3,
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: Matrics.screenWidth,
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
  },
  friendImg: {
    height: Matrics.screenHeight * 0.12,
    width: Matrics.screenHeight * 0.12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  orderStaus: {
    backgroundColor: '#000',
    borderRadius: 5,
    width: 10,
    height: 10,
  },
  orderStausBRD: {
    borderWidth: 2,
    flex: 1,
    height: 2,
  },
};
