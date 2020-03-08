import {Color, Matrics, ApplicationStyles} from '../../common/styles';

export default styles = {
  ...ApplicationStyles,
  container: {
    backgroundColor: Color.white,
    padding: 10,
  },
  viewItemTypeText: {
    height: 40,
    justifyContent: 'center',
  },
  viewPicker: {
    borderColor: '#d3d3d3',
    borderWidth: 1,
  },
  saveButtonview: {
    height: 45,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButton: {
    width: '60%',
    height: 45,
    backgroundColor: Color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  saveButtonText: {
    color: Color.white,
    fontSize: 16,
  },
  systemNameTextInput: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    marginLeft: -2,
    paddingLeft: 10,
  },
};
