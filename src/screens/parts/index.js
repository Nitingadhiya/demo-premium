import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Picker,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import CodeInput from 'react-native-confirmation-code-input';
import APICaller from '../../utils/api-caller';
import {
  getPartFromSerialNoEndPoint,
  getPartFromSystemTagNoEndPoint,
} from '../../config/api-endpoint';
import styles from './styles';
import {Matrics, Color} from '../../common/styles';
import Events from '../../utils/events';
import Helper from '../../utils/helper';
import NavigationHelper from '../../utils/navigation-helper';
import {SpinnerView, TextInputView, Header} from '../../common/components';
import SystemPartsWithQRCode from '../../components/system-parts-qr-code';

class Parts extends Component {
  state = {
    loading: false,
    partList: [],
    userInfo: null,
  };

  componentDidMount() {
    Events.on('system-parts-tag-event', 'systemTag', tag => {
      this.checkSystemParts(tag);
    });
    this.getUserInfo();
  }

  async getUserInfo() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    this.setState({
      userInfo,
    });
  }

  checkSystemParts(tag) {
    this.setState({
      loadingData: true,
    });
    const tagSplt = tag.split('-');
    let endPoint;
    if (tagSplt[0] === 'ITM') {
      endPoint = getPartFromSerialNoEndPoint(tag);
    } else {
      endPoint = getPartFromSystemTagNoEndPoint(tag);
    }

    APICaller(`${endPoint}`, 'GET').then(json => {
      if (json.data.Success === '1') {
        const response = json.data.Response;
        this.setState({
          partList: response,
          loadingData: false,
        });
      } else {
        this.setState({
          message: json.data.Message,
          loadingData: false,
        });
      }
    });
  }

  render() {
    const {loadingData, partList, message} = this.state;
    return (
      <SafeAreaView style={styles.flex1}>
        <Header title="System Warranty" left="menu" />
        {loadingData ? (
          <View style={styles.spinnerView}>
            <SpinnerView />
          </View>
        ) : null}
        {message ? (
          <View style={styles.messageView}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}
        <View style={styles.flex1}>
          {partList && partList.length > 0 ? (
            <FlatList
              data={partList}
              renderItem={({item}) => (
                <View style={styles.itemView}>
                  <Text style={styles.ownerName}>{item.OwnerName}</Text>
                  <View style={styles.flex1}>
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
                  <View style={styles.flex1}>
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
          ) : (
            <View />
          )}
        </View>

        <TouchableOpacity
          onPress={() => Events.trigger('qrCode-syste-parts', 'open again')}
          style={{
            paddingHorizontal: 10,
            height: 45,
            backgroundColor: Color.primary,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: '#fff', fontSize: 14}}>Retry, Scan QR-Code</Text>
        </TouchableOpacity>

        <SystemPartsWithQRCode userInfo={userInfo} />
      </SafeAreaView>
    );
  }
}
export default Parts;
