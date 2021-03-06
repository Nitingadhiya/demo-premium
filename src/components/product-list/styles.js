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
  newProductTagView: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: 'green',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  newProductText: {
    color: '#fff',
    fontSize: 14,
  },
};
