import {Color, Matrics, Fonts, ApplicationStyles} from '../../common/styles';

export default styles = {
  container: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,00.5)',
    width: Matrics.screenWidth,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 5, height: 5},
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subContainer: {
    backgroundColor: '#fff',
    width: Matrics.screenWidth - 40,
    alignItems: 'center',
  },
  headerView: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconButton: {
    position: 'absolute',
    zIndex: 1,
    right: 10,
  },
  leadText: {color: 'black', fontSize: 16},
  displayItemView: {
    justifyContent: 'center',
    padding: 10,
    width: '100%',
  },
  textNoDisplay: {
    color: 'black',
    fontSize: 16,
    marginTop: 10,
  },
  fontWeightBold: {fontWeight: 'bold'},
  infoText: {
    color: 'black',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'left',
  },
  closeButton: {
    backgroundColor: Color.primary,
    height: 40,
    width: '33.3%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: Color.white,
  },
  buttonText: {color: 'white', fontSize: 14, fontWeight: 'bold'},
  buttonView: {
    flexDirection: 'row',
  },
  brdRight0: {
    borderRightWidth: 0,
  },
  pickerView: {
    borderWidth: 1,
    borderColor: Color.paleGreyThree,
    borderRadius: 5,
    width: Matrics.screenWidth - 80,
    marginVertical: 10,
  },
  picker: {
    height: 45,
    zIndex: 1,
    width: Matrics.screenWidth - 80,
  },
};
