import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import _ from 'lodash';
import {Matrics, Color, Fonts, ApplicationStyles} from '../../styles';
import {TextInputView} from '../../components';
import Http from '../../../api/http';
import GlobalVar from '../../../global';
import HeroesVar from '../../../../config/heroes-config';
import TypeData from '../../../api/type-data';
import Styles from './styles';
import {Events, Helper, APICaller} from '../../../util';
import {ErrorObj} from '../../../api';
import RegisterObj from '../../../api/register-data';
import ErrorComponent from '../../../common/components/error-message';

class GooglePlaceInput extends Component {
  state = {
    renderComponent: false,
    address: RegisterObj.address,
  };

  componentDidMount() {
    //this.locationRef.setAddressText(googleaddress);
    this.setState({
      renderComponent: true,
    });
    this.searchingDelayed = _.debounce(text => {
      this.textInputChange(text);
    }, 300);
    const {googleaddress} = this.props;
    Events.on('useAddress', 'Login', address => {
      this.setState({
        address,
      });
      ErrorObj.address = null;
    });
  }

  changeText(val) {
    if (!val) {
      this.setState({
        address: null,
      });
      this.scrollPosition = false;
    }
    this.setState({
      address: val,
    });
    ErrorObj.address = null;
    ErrorObj.country = null;
    this.searchingDelayed(val);
  }

  textInputChange(val) {
    if (!val) {
      RegisterObj.address = val;
      RegisterObj.country = '';
      return;
    }
    fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?&input=${encodeURIComponent(
        val,
      )}&key=${
        GlobalVar.apiKey
      }&components=country:us|country:de|country:pl|country:in&language=${
        HeroesVar.language
      }`,
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status != 'OK') {
          this.setState({
            descriptionArr: [],
          });
          return null;
        }
        if (val.length > 0 && !this.scrollPosition) {
          Events.trigger('scrollPosition');
          this.scrollPosition = true;
        }
        this.setState({
          descriptionArr: responseJson.predictions,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  fetchAddress(val) {
    if (!val) return;
    this.setState({
      address: val,
      descriptionArr: [],
    });
    const body = {address: val};
    Events.trigger('loading', true);
    APICaller(`${Http.geoLocationEndpoint}`, 'POST', '', body).then(json => {
      Events.trigger('loading', false);
      if (
        json &&
        json.status &&
        json.status === GlobalVar.responseInvalidCode
      ) {
        Events.trigger(
          'toast',
          Helper.translation(
            `Words.${GlobalVar.requestFailedMsg}`,
            GlobalVar.requestFailedMsg,
          ),
        );
        return;
      } else if (
        json &&
        json.status &&
        json.status === GlobalVar.responseSuccess
      ) {
        const data = json.data.data;
        Helper.removeExtraData();
        HeroesVar.country = data.country;
        Helper.addContactType();
        RegisterObj.address = data.full_address;
        RegisterObj.country = data.country;
        this.setState({
          address: data.full_address,
        });
      }
    });
  }

  onFocus() {
    setTimeout(() => {
      Events.trigger('scrollPosition');
    }, 500);
  }

  render() {
    const {address, descriptionArr} = this.state;
    return (
      <View>
        <TextInputView
          placeholder={Helper.translation(`Words.Address`, 'Your Address')}
          placeholderTextColor={Color.silver}
          placeholderStyle={Styles.placeholderStyle}
          style={Styles.textInput}
          value={address}
          returnKeyType={'done'}
          keyboardType={'default'}
          maxLength={255}
          onChangeText={val => this.changeText(val)}
          langType={'Words'}
          onFocus={() => this.onFocus()}
        />
        <ErrorComponent stateName={'address'} />
        <ErrorComponent stateName={'country'} />
        {descriptionArr && descriptionArr.length > 0 && (
          <View style={Styles.flatListView}>
            {descriptionArr.map(item => (
              <TouchableOpacity
                onPress={() => this.fetchAddress(item.description)}
                style={Styles.selectAddress}
                key={`${item.description}`}>
                <Text style={Styles.addressText}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {/* <GooglePlacesAutocomplete
          ref={instance => {
            this.locationRef = instance;
          }}
          placeholder={Helper.translation(`Words.Address`, "Your Address")}
          minLength={1}
          autoFocus={false}
          returnKeyType={"default"}
          keyboardShouldPersistTaps={"always"}
          renderDescription={row => row.description}
          onPress={(data, details = null) => {
            global.selectedCountry = details.terms.pop().value;
          }}
          placeholderTextColor={Color.Black_Color}
          getDefaultValue={() => ""}
          query={{
            key: GlobalVar.apiKey,
            language: "en",
            types: "geocode",
            components: "country:US|country:DE" //|country:in
          }}
          styles={{
            container: Styles.container,
            row: Styles.row,
            listView: Styles.listView,
            textInputContainer: Styles.textInputContainer,
            textInput: Styles.textInput,
            description: Styles.description,
            predefinedPlacesDescription: {
              color: "white"
            }
          }}
          GooglePlacesDetailsQuery={{
            // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
            fields: "formatted_address"
          }}
          currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
          nearbyPlacesAPI="GooglePlacesSearch" //GooglePlacesSearch
          debounce={200}
          filterReverseGeocodingByTypes={[
            "locality",
            "administrative_area_level_3"
          ]}
          enablePoweredByContainer={false}
        /> */}
      </View>
    );
  }
}

export default GooglePlaceInput;
