import { color } from 'react-native-reanimated';
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
  modalView: {
    flex: 1
  },
  headerView: {
    height: 50,
    width: Matrics.screenWidth,
    flexDirection: 'row',
    backgroundColor: Color.primary,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  backHeaderTouch: {
    width: 40,
    justifyContent: 'center',
    height: 40,
    alignItems: 'center'
  },
  filterText: {
    textAlign: 'center',
    fontSize: 18,
    color: Color.white,
  },
  opacityHide: {
    opacity: 0
  },
  filterView: {
    flex: 12,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  clearAllText: {
    fontSize: 14,
    color: Color.white,
  },
  clearAllButtton: {
    width: 100
  },
  viewFirst: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  leftBrandText: {
    fontSize: 11,
    color: Color.black30,
  },
  leftTouchButton: {
    height: 40,
    width: Matrics.screenWidth / 3,
    backgroundColor: Color.paleGreyTwo,
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderBottomWidth: 0.2,
    borderColor: Color.greyishBrown30
  },
  rightTouchButton: {
    paddingHorizontal: 5,
    borderBottomWidth: 0.2,
    borderColor: Color.greyishBrown30 ,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingRight: 30,
    flex: 1
  },
  rightSideView: {
    borderLeftWidth: 1,
    width: Matrics.screenWidth/ 1.4
  },  
  leftFirstView: {
    width: Matrics.screenWidth/ 3.3
  },
  applyButton:{
    width: Matrics.screenWidth,
    height: 40,
    flex: 1,
    backgroundColor: Color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10006,
   
  },
  applyText: {
    color: Color.white,
    fontSize: 14
  },
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 10002,
    alignItems: 'center',
    top: '45%',
  },
};
