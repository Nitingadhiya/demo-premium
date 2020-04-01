import {Color, Matrics, ApplicationStyles} from '../../common/styles';

export default styles = {
  ...ApplicationStyles,
  container: {
    backgroundColor: Color.white,
    flex: 1,
  },
  subTextBoxView: {
    width: Matrics.screenWidth - 90,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: Color.white,
  },
  searchPartsView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.paleGrey,
    height: 60,
  },
  customStyle: {
    height: 40,
  },
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    top: '45%',
  },
  errorView: {
    marginVertical: 5,
    alignItems: 'center',
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Color.black,
  },
  descriptionText: {
    fontSize: 14,
    color: Color.black30,
  },
  seprationView: {
    borderBottomWidth: 1,
    borderColor: Color.paleGrey,
    padding: 10,
    paddingHorizontal: 5,
  },
  paddingH: {
    paddingHorizontal: 5,
  },
  flatListCss: {flex: 1, padding: 10, paddingTop: 0},
  multilineStyle: {
    height: 70,
  },
  spaceMange: {marginTop: 10},
  pickerView: {
    borderWidth: 1,
    borderColor: Color.paleGreyThree,
    borderRadius: 5,
    width: Matrics.screenWidth - 20,
    marginVertical: 10,
    marginLeft: 10,
  },
  picker: {
    height: 45,
    zIndex: 1,
    width: Matrics.screenWidth - 20,
  },
  saveButtonCss: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primary,
  },
  saveButtonText: {
    color: Color.white,
    fontSize: 16,
  },
  extraTextBoxView: {
    width: Matrics.screenWidth - 20,
  },
  closeIcon: {
    position: 'absolute',
    zIndex: 1,
    bottom: 5,
    right: 10,
  },
  noItemText: {color: 'grey', fontSize: 16},
  noItemView: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
