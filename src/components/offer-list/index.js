import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import { Ionicons, MIcon } from '../../common/assets/vector-icon';
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
    fontSize: 12,
    color: Color.black,
    fontWeight: 'bold'
  },
  offerView: {
    flex: 1,
    backgroundColor: '#F1F5D4',
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
    fontSize: 12,
    fontWeight: 'bold'
  },
  offerAvailablePrice: {
    color:Color.primary,
    fontSize: 12,
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
    paddingHorizontal: 5, 
    paddingVertical: 2,
    backgroundColor: '#75C5F1', 
    alignSelf: 'flex-start', 
    marginVertical: 5, 
    borderRadius: 5,
    flexDirection: 'row'
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
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 16, color: Color.primary, fontWeight: 'bold'
  },
  descriptionText: {
    fontSize: 14, color: Color.black70,
  },
  dotted: {
    fontSize: 20
  },
  viewDotted: {
    height:20,
    overflow:'hidden',
    marginBottom: 10
  },
  fontWeight: {
    fontWeight: 'bold'
  },
  offerValidView: {
    width: (Matrics.screenWidth /2 ) -20
  },
  benefitView: {
    width: (Matrics.screenWidth /2) -20
  },
  validityDateView: {
    marginVertical: 5, 
    borderRadius: 5
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

  renderTextColorInactive = (IsActive) => {
    if(!IsActive) {
      return { color: '#888'}
    }
    return null;
  }

  render() {
    const {data} = this.props;
   const {IsActive} = data;
    return (
      <View style={[styles.offerView, this.renderStyle(IsActive)]}>
        <Text style={[styles.titleText, this.renderTextColorInactive(IsActive)]}>
         {data.Title}
        </Text>
        <Text style={[styles.descriptionText,this.renderTextColorInactive(IsActive)]}>
         {data.Description}
        </Text>
        <View style={styles.viewDotted}>
          <Text style={styles.dotted}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
        </View>
        <View>
        <View>
          <View style={styles.flxRow}>
            <View style={styles.offerValidView}>
              <Text style={[styles.offerAvailablePrice,this.renderTextColorInactive(IsActive)]}>Offer Valid on: <Text style={styles.fontWeight}>Gold</Text></Text>
            </View>
            <View style={styles.benefitView}>
            <Text style={[styles.offerAvailablePrice,this.renderTextColorInactive(IsActive)]}>Benefit: <Text style={styles.fontWeight}>{data.BenefitTypeName}</Text></Text>
            </View>
            {/* <Text style={styles.offerAvailablePrice}>Offer Available for upto</Text>
            <Text style={styles.offerPrice}>{data.OfferPrice}</Text> */}
          </View>
          <View>
            <Text style={[styles.offerAvailablePrice,this.renderTextColorInactive(IsActive)]}>Valid on Purchase: <Text style={styles.fontWeight}>{data.OfferPrice}</Text></Text>
          </View>
          
          <View style={styles.flxRow}>
            <View style={styles.validityDateView}>
              <Text style={[styles.offerAvailablePrice,this.renderTextColorInactive(IsActive)]}>Validity: <Text style={styles.fontWeight}>{data.FromDate1} - {data.EndDate1}</Text></Text>
            </View>
            <View style={[styles.promocodeView, this.renderPromoCodeViewStyle(IsActive)]}>
              <Ionicons name="copy" color={Color.black30} size={14} />
              <Text style={styles.promocodeText}> Promo: {data.PromoCode}</Text>
            </View>
          </View>
        </View>
        </View>
      </View>
    );
  }
}