import {Color, Matrics} from '../../../../common/styles';

export default styles = {
  safeView: {
    flex: 1,
    backgroundColor: Color.paleGrey,
  },
  TouchBTN: {
    backgroundColor: Color.white,
    height: 50,
    width: Matrics.screenWidth - 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 10,
  },
  bodyView: {
    backgroundColor: Color.white,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    marginBottom: 0,
    flex: 1,
  },
  subBodyView: {flex: 1, paddingBottom: 10},
  textDate: {fontSize: 20, textAlign: 'center'},
  carouselView: {
    margin: 10,
    borderWidth: 0,
    padding: 10,
    height: Matrics.screenWidth / 1.1 + 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sliderImageView: {
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    // width: Matrics.screenWidth - 20,
  },
  sliderImage: {
    height: '100%',
    width: Matrics.screenWidth - 20,
  },
};
module.exports = styles;
