import {Color, Matrics, Fonts} from '../../styles';
import {Platform} from 'react-native';

export default Styles = {
  dateText: {
    fontSize: Matrics.ScaleValue(10),
  },
  innerMessageBody: {
    padding: Matrics.ScaleValue(5),
    margin: Matrics.ScaleValue(5),
    marginLeft: 0,
    borderRadius: Matrics.ScaleValue(5),
    maxWidth: '80%',
  },
  senderName: {
    fontWeight: 'bold',
    fontSize: Matrics.ScaleValue(12),
    marginRight: Matrics.ScaleValue(30),
    color: Color.messageCode,
  },
  messageText: {
    fontSize: Matrics.ScaleValue(14),
    marginRight: Matrics.ScaleValue(50),
  },
  dateView: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 3,
    right: 5,
  },
  renderHeaderView: {
    padding: Matrics.ScaleValue(5),
    backgroundColor: Color.primary,
    alignSelf: 'center',
    borderRadius: Matrics.ScaleValue(5),
    marginTop: Matrics.ScaleValue(5),
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: Matrics.ScaleValue(12),
    textAlign: 'center',
    color: Color.white,
  },
  messageBody: {
    width: Matrics.screenWidth,
    paddingHorizontal: Matrics.ScaleValue(10),
  },
  headerDate: {
    fontWeight: 'bold',
    fontSize: Matrics.ScaleValue(12),
    textAlign: 'center',
    color: Color.white,
  },
  renderHeaderViewStyles: {
    alignItems: 'center',
    padding: Matrics.ScaleValue(5),
    backgroundColor: Color.primary,
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: Matrics.ScaleValue(5),
    zIndex: 1,
    top: Matrics.ScaleValue(5),
  },
  bottomView: {
    width: Matrics.screenWidth,
    backgroundColor: Color.paleGreyTwo,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Matrics.ScaleValue(5),
  },
  sendButton: {
    marginHorizontal: Matrics.ScaleValue(5),
    marginVertical: Matrics.ScaleValue(5),
    alignItems: 'center',
    justifyContent: 'center',
    width: Matrics.ScaleValue(40),
    height: Matrics.ScaleValue(40),
    backgroundColor: Color.primary,
    borderRadius: Matrics.ScaleValue(20),
  },
  textInput: {
    backgroundColor: Color.white,
    minHeight: Matrics.ScaleValue(40),
    maxHeight: Matrics.ScaleValue(100),
    width: Matrics.screenWidth - Matrics.ScaleValue(55),
    marginLeft: Matrics.ScaleValue(5),
    marginVertical: Matrics.ScaleValue(5),
    padding: 0,
    paddingHorizontal: Matrics.ScaleValue(10),
    paddingTop:
      Platform.OS === 'ios' ? Matrics.ScaleValue(10) : Matrics.ScaleValue(5),
    paddingBottom: Platform.OS === 'ios' ? 0 : Matrics.ScaleValue(5),
    borderRadius: Matrics.ScaleValue(10),
    fontSize: Matrics.ScaleValue(16),
    justifyContent: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
  },
};
module.exports = Styles;
