import {Color, Matrics} from '../../common/styles';

export default styles = {
  container: {
    flex: 1,
    backgroundColor: Color.white,
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
  spinnerViewPOS: {
    position: 'absolute',
    zIndex: 1,
    top: '45%',
    left: '40%',
  },
  controlBar: {
    top: 58,
    right: 10,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  clusterContainer: {
    width: 30,
    height: 30,
    padding: 6,
    borderWidth: 1,
    borderRadius: 15,
    alignItems: 'center',
    borderColor: '#65bc46',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  clusterText: {
    fontSize: 13,
    color: '#65bc46',
    fontWeight: '500',
    textAlign: 'center',
  },
  refreshText: {
    fontWeight: 'bold',
  },
  personCalloutView: {
    padding: 5, 
    width: 160, 
    borderRadius: 5,
    backgroundColor: Color.white
  },
  pinNameText: {
    fontSize: 13,
    color: Color.black30,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  pinComplaint: {
    fontSize: 13,
    color: Color.black30,
    fontWeight: 'bold'
  },
  complaintSub: {
    fontSize: 13,
    color: Color.black70,
  },
  complaintCalloutView: {
    width: 260, 
    padding: 5, 
    borderRadius: 5,
    backgroundColor: Color.white
  }
};
