import {Color, Matrics, ApplicationStyles} from '../../common/styles';

export default styles = {
  ...ApplicationStyles,
  messageView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  itemView: {
    flex: 1,
    borderWidth: 1,
    padding: 5,
    margin: 5,
  },
  ownerName: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  flex1: {
    flex: 1,
  },
  twodivide: {
    flexDirection: 'row',
    flex: 1,
    //flexWrap: 'wrap',
    height: 50,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    padding: 5,
  },
  partsTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
    marginVertical: 10,
  },
  textName: {flex: 1, fontWeight: 'bold'},
  subTextName: {
    fontWeight: 'normal',
  },
};
