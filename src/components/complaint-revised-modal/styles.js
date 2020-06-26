import {Color, Matrics, Fonts, ApplicationStyles} from '../../common/styles';

export default styles = {
  imageOutsideTouchButton: {
    height: Matrics.screenHeight,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  modalView: {
    height: 100,
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  scanTouch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderRight: {
    borderRightWidth: 1,
    borderColor: '#d3d3d3',
  },
  imageHeight: {
    width: (Matrics.screenHeight - 10) / 2,
    height: 90,
  },
};
