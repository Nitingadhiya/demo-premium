import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Picker,
  TouchableOpacity,
  Alert,
} from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import CodeInput from 'react-native-confirmation-code-input';
import APICaller from '../../utils/api-caller';
import {
  getItemTypeListEndPoint,
  getSystemTypeListEndPoint,
  addSystemEndPoint,
} from '../../config/api-endpoint';
import styles from './styles';
import {Matrics} from '../../common/styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';
import {SpinnerView, TextInputView} from '../../common/components';

class Parts extends Component {
  state = {
    loading: false,
    partList: [],
  };

  async componentDidMount() {
    const {route} = this.props;
    const userInfo = await Helper.getLocalStorageItem('userInfo');

    if (route.params.systemTag) {
      this.checkSystemParts(route.params.systemTag);
    }
    this.setState({userName: userInfo.UserName});
  }

  checkSystemParts(tag) {
    this.setState({
      loadingData: true,
    });
    const tagSplt = tag.split('-');
    let endPoint;
    if (tagSplt[0] === 'ITM') {
      endPoint = `/GetPartFromSerialNo?SerialNo=${tag}`;
    } else {
      endPoint = `GetPartFromSystemTag?SystemTag=${tag}`;
    }
    const method = 'GET';
    APICaller(`${endPoint}`, method).then(json => {
      this.setState({
        loadingData: false,
      });
      if (json.data.Success === '1') {
        const response = json.data.Response;
        this.setState({
          partList: response,
        });
      }
    });
  }

  render() {
    const {loadingData, partList} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header title="Offer" left="back" />
        {loadingData ? <SpinnerView /> : null}
        <View style={{flex: 1}}>
          {partList.length > 0 && (
            <FlatList
              data={partList}
              renderItem={({item}) => (
                <View style={{flex: 1, borderWidth: 1, padding: 5, margin: 5}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 16,
                      textAlign: 'center',
                    }}>
                    {item.OwnerName}
                  </Text>
                  <View style={{flex: 1}}>
                    <Text style={styles.partsTitle}>
                      Part's information{' '}
                      {item.OrderType && `(${item.OrderType})`}
                    </Text>
                    <View style={styles.twodivide}>
                      <Text style={styles.textName}>
                        Warranty:{' '}
                        <Text style={styles.subTextName}>
                          {item.IsInwarranty ? 'Yes' : 'No'}
                        </Text>
                      </Text>
                      <Text style={styles.textName}>
                        Service:{' '}
                        <Text style={styles.subTextName}>
                          {item.IsInService ? 'Yes' : 'No'}
                        </Text>
                      </Text>
                    </View>
                    <View style={styles.twodivide}>
                      <Text style={styles.textName}>
                        Bill Date:{' '}
                        <Text style={styles.subTextName}>{item.OrderDate}</Text>
                      </Text>
                      <Text style={styles.textName}>
                        Expiry Date:{' '}
                        <Text style={styles.subTextName}>
                          {item.ExpiryDate}
                        </Text>
                      </Text>
                    </View>
                    <View style={styles.twodivide}>
                      <Text style={styles.textName}>
                        Invoice No:{' '}
                        <Text style={styles.subTextName}>{item.InvoiceNo}</Text>
                      </Text>
                      <Text style={styles.textName}>
                        Order No:{' '}
                        <Text style={styles.subTextName}>{item.OrderNo}</Text>
                      </Text>
                    </View>
                    <View style={styles.twodivide}>
                      <Text style={styles.textName}>
                        Company:{' '}
                        <Text style={styles.subTextName}>{item.company}</Text>
                      </Text>
                      <Text style={styles.textName}>
                        SerialNo:{' '}
                        <Text style={styles.subTextName}>{item.SerialNo}</Text>
                      </Text>
                    </View>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.partsTitle}>Inside Information</Text>
                    <View style={styles.twodivide}>
                      <Text style={styles.textName}>
                        Purchased From:{' '}
                        <Text style={styles.subTextName}>
                          {item.SupplierCode}
                        </Text>
                      </Text>
                      <Text style={styles.textName}>
                        Purchased Date:{' '}
                        <Text style={styles.subTextName}>
                          {item.PurchasedDate}
                        </Text>
                      </Text>
                    </View>
                    <View style={styles.twodivide}>
                      <Text style={styles.textName}>
                        Warranty In:{' '}
                        <Text style={styles.subTextName}>
                          {item.WarrantyInwardMonths} - Months
                        </Text>
                      </Text>
                      <Text style={styles.textName}>
                        Warranty Out:{' '}
                        <Text style={styles.subTextName}>
                          {item.WarrantyOutwardMonths} - Months
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}
export default Parts;
