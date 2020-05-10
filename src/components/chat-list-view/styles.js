import {Color, Matrics, Fonts} from '../../common/styles';

export default (styles = {
  rowView: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Color.paleGreyThree,
    padding: Matrics.ScaleValue(10),
    paddingVertical: Matrics.ScaleValue(10),
  },
  onlineView: {
    height: Matrics.ScaleValue(10),
    width: Matrics.ScaleValue(10),
    backgroundColor: 'transparent',
    alignSelf: 'center',
    borderRadius: Matrics.ScaleValue(5),
    position: 'absolute',
    bottom: Matrics.ScaleValue(0),
    right: Matrics.ScaleValue(-2),
    zIndex: 1,
  },
  imageViewChr: {
    //marginRight: Matrics.ScaleValue(10),
    width: Matrics.ScaleValue(40),
    height: Matrics.ScaleValue(40),
    borderRadius: Matrics.ScaleValue(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {paddingRight: Matrics.ScaleValue(10), zIndex: 1},
  userImage: {
    width: Matrics.ScaleValue(40),
    height: Matrics.ScaleValue(40),
    borderRadius: Matrics.ScaleValue(25),
    borderWidth: 2,
    borderColor: Color.paleGrey,
  },
  listMessageView: {justifyContent: 'center', flex: 1},
  userNameText: {
    fontFamily: Fonts.type.RubikMedium,
    fontSize: 14,
    color: Color.charcoalGrey,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyText: {
    fontFamily: Fonts.type.RubikMedium,
    fontSize: 12,
    color: Color.charcoalGrey,
  },
  messageText: {
    fontFamily: Fonts.type.Rubik,
    fontSize: 12,
    color: Color.slateGrey,
  },
  dateText: {
    fontFamily: Fonts.type.Rubik,
    fontSize: 10,
    color: Color.slateGrey,
  },
  dateView: {
    marginTop: 12,
  },
  imageText: {
    fontFamily: Fonts.type.RubikMedium,
    fontSize: 30,
    color: Color.white,
  },
  unreadCountView: {
    backgroundColor: Color.primary,
    height: 20,
    width: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 5,
  },
  unreadCountText: {
    fontFamily: Fonts.type.Rubik,
    fontSize: 8,
    color: Color.white,
  },
});
module.exports = styles;
