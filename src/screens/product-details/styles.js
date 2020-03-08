import {Color, Matrics, ApplicationStyles} from '../../common/styles';

export default styles = {
  ...ApplicationStyles,
  safeView: {
    flex: 1,
    backgroundColor: Color.white,
  },
  productTitle: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  titleClass: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  carouselView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    backgroundColor: '#f5f5f5',
  },
  priceView: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    borderTopWidth: 1,
  },
  priceSubView: {
    borderRightWidth: 1,
    borderColor: '#e5e5e5',
    width: '32.5%',
  },
  centerText: {textAlign: 'center'},
  priceValue: {
    textAlign: 'center',
    fontSize: 16,
  },
  comingsoonView: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  dealerPriceView: {
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
    width: '100%',
    paddingVertical: 5,
  },
  addToCartButton: {
    height: 40,
    backgroundColor: Color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  mainTechnicalView: {borderTopWidth: 1, borderColor: '#ddd'},
  technicalView: {marginBottom: 5, paddingHorizontal: 10},
  container: {
    backgroundColor: Color.white,
  },
  animatedView: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 50,
    width: '100%',
    backgroundColor: Color.primary,
  },
  textInputCss: {
    height: 40,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: Color.white,
    borderColor: Color.black,
    paddingVertical: 0,
    paddingHorizontal: 28,
    fontSize: 16,
    color: Color.primary,
  },
  clearSearchIcon: {
    position: 'absolute',
    zIndex: 1,
    right: 15,
    top: 13,
  },
  carouselView: {
    width: Matrics.screenWidth,
    height: Matrics.screenWidth / 1.7,
  },
  sliderImageView: {
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  sliderImage: {
    height: '100%',
    width: Matrics.screenWidth,
  },
};
