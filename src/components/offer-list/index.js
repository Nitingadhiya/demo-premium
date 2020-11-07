import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import {Matrics, Color} from '../../common/styles';

const styles = StyleSheet.create({
  container: {
    marginVertical: 3,
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: Matrics.screenWidth,
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 5,
    backgroundColor: Color.white,
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
  },
  friendImg: {
    height: Matrics.screenHeight * 0.12,
    width: Matrics.screenHeight * 0.12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderStaus: {
    backgroundColor: Color.black,
    borderRadius: 5,
    width: 10,
    height: 10,
  },
  orderStausBRD: {
    borderWidth: 2,
    flex: 1,
    height: 1,
  }, 
  promocodeText:{
    fontSize: 14,
    color: Color.white
  },
  offerView: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    shadowOffset: {width: 2, height: 0},
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    borderRadius: 10,
    elevation: 5,
  },
  fromEndDate: {
    //flexDirection: 'row',
    //justifyContent: 'space-between'
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginBottom: 5,
    padding: 5,
    backgroundColor: Color.primary,
    borderRadius: 5,
  },
  dateText: {
    color: Color.white,
    fontSize: 14,
    fontWeight: 'bold'
  },
  offerAvailablePrice: {
    color:Color.black70,
    fontSize: 14,
  },
  overlayView: {
    position: 'absolute',
    zIndex:1,
    height: '100%',
    width: '100%',
    top:0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  promocodeView: {
    padding: 5, 
    backgroundColor: Color.primary, 
    alignSelf: 'flex-start', 
    marginVertical: 5, 
    borderRadius: 5
  },
  offerPrice: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Color.black30
  },
  expDateText:{
    fontSize:14,
    color: '#eee'
  },
  flxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }

});

export default class OfferList extends React.PureComponent {

  renderStyle = (IsActive) => {
    if(!IsActive) {
      return { backgroundColor: '#ccc'}
    }
    return null;
  }

  renderPromoCodeViewStyle = (IsActive) => {
    if(!IsActive) {
      return { backgroundColor: '#999'}
    }
    return null;
  }

  render() {
    const {data} = this.props;
    const {IsActive} = data;
    console.log(data,'data')
    return (
      <View style={[styles.offerView, this.renderStyle(IsActive)]}>
        <Text style={{fontSize: 16, color: Color.black30, fontWeight: 'bold'}}>
         {data.Title}
        </Text>
        <View style={styles.flxRow}>
        <View>
          <View>
            <Text style={styles.offerAvailablePrice}>Offer Available for upto</Text>
            <Text style={styles.offerPrice}>{data.OfferPrice}</Text>
          </View>
        
          <View style={[styles.promocodeView, this.renderPromoCodeViewStyle(IsActive)]}>
            <Text style={styles.promocodeText}>Promocode: {data.PromoCode}</Text>
          </View>
        </View>
        <View style={styles.fromEndDate}>
          {/* <Text style={styles.dateText}>{data.FromDate1}</Text> */}
          <Text style={styles.expDateText}>Expiration Date</Text>
          <Text style={styles.dateText}>{data.EndDate1}</Text>
        </View>
        </View>
      </View>
    );
  }
}