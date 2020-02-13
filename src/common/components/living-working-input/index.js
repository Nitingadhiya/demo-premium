import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import _ from "lodash";
import { Matrics, Color, Fonts } from "../../styles";
import { TextInputView } from "..";
import FIcon from "react-native-vector-icons/FontAwesome";
import GlobalVar from "../../../global";
import HeroesVar from "../../../../config/heroes-config";
import Styles from "./styles";
import Http from "../../../api/http";
import { Events, Helper, APICaller } from "../../../util";
import Icon from "react-native-fontawesome-pro";
import RegisterObj from "../../../api/register-data";
import ErrorComponent from "../../../common/components/error-message";
import styles from "../empty-component/styles";

class LivineWorkingInput extends Component {
  state = {
    renderComponent: false,
    address: null,
    livineWorkingText: RegisterObj.locations_wanted,
    descriptionArr: null
  };

  componentDidMount() {
    this.setState({
      renderComponent: true
    });
    this.searchingDelayed = _.debounce(text => {
      this.textInputChange(text);
    }, 300);
  }

  changeText(val) {
    if (!val) {
      this.scrollPosition = false;
      this.setState({
        address: null
      });
    }
    this.setState({
      address: val
    });
    this.address_empty = false;
    this.searchingDelayed(val);
  }

  textInputChange(val) {
    if (!val) {
      return;
    }
    fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?&input=${encodeURIComponent(
        val
      )}&key=${
        GlobalVar.apiKey
      }&components=country:us|country:de|country:pl&language=${
        HeroesVar.language
      }`
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status != "OK") {
          return null;
        }
        if (val.length > 0 && !this.scrollPosition) {
          Events.trigger("scrollPosition");
          this.scrollPosition = true;
        }
        this.setState({
          descriptionArr: responseJson.predictions
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
      descriptionArr: []
    });
    const body = { address: val };
    Events.trigger("loading", true);
    APICaller(`${Http.geoLocationEndpoint}`, "POST", "", body).then(
      async json => {
        Events.trigger("loading", false);
        if (
          json &&
          json.status &&
          json.status === GlobalVar.responseInvalidCode
        ) {
          Events.trigger(
            "toast",
            Helper.translation(
              `Words.${GlobalVar.requestFailedMsg}`,
              GlobalVar.requestFailedMsg
            )
          );
          return;
        } else if (
          json &&
          json.status &&
          json.status === GlobalVar.responseSuccess
        ) {
          const data = json.data.data;
          RegisterObj.locations_wanted = [
            ...this.state.livineWorkingText,
            data.full_address
          ];
          await this.setState({
            livineWorkingText: [
              ...this.state.livineWorkingText,
              data.full_address
            ],
            descriptionArr: [],
            address: null
          });
        }
      }
    );

    // if (!val) return;
    // this.setState({
    //   address: val,
    //   descriptionArr: []
    // });
    // fetch(
    //   `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    //     val
    //   )}&key=${GlobalVar.apiKey}&components=country:us|country:de|country:pl`
    // )
    //   .then(response => response.json())
    //   .then(async responseJson => {
    //     if (responseJson.status != "OK") {
    //       Events.trigger("toast", responseJson.status);
    //       return null;
    //     }
    //     RegisterObj.locations_wanted = [...this.state.livineWorkingText, val];
    //     await this.setState({
    //       livineWorkingText: [...this.state.livineWorkingText, val],
    //       descriptionArr: [],
    //       address: null
    //     });
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
  }

  onFocus() {
    setTimeout(() => {
      Events.trigger("scrollPosition");
    }, 500);
  }

  deleteAddress(val) {
    const { livineWorkingText } = this.state;
    this.setState({
      livineWorkingText: _.remove(livineWorkingText, res => res === val)
    });
    RegisterObj.locations_wanted = livineWorkingText;
  }

  render() {
    this.state.livineWorkingText = RegisterObj.locations_wanted; //Display selected value
    const { livineWorkingText, descriptionArr } = this.state;
    return (
      <View>
        <TextInputView
          placeholder={Helper.translation(`Words.Address`, "Your Address")}
          placeholderTextColor={Color.silver}
          placeholderStyle={Styles.placeholderStyle}
          style={Styles.textInput}
          value={this.state.address}
          returnKeyType={"done"}
          keyboardType={"default"}
          maxLength={255}
          onChangeText={val => this.changeText(val)}
          langType={"Words"}
          onFocus={() => this.onFocus()}
        />
        {descriptionArr && descriptionArr.length > 0 && (
          <View style={Styles.flatListView}>
            {descriptionArr.map(item => (
              <TouchableOpacity
                onPress={() => this.fetchAddress(item.description)}
                style={Styles.selectAddress}
                key={`${item.description}`}
              >
                <Text style={Styles.addressText}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ marginTop: Matrics.ScaleValue(10) }}>
          {livineWorkingText &&
            livineWorkingText.map((res, index) => (
              <View style={Styles.viewListAddress} key={`${res}_${index}`}>
                <View style={Styles.textView}>
                  <Text style={Styles.listTextAddress} numberOfLines={2}>
                    {res}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.deleteAddress(res)}
                  style={{
                    padding: Matrics.ScaleValue(10)
                  }}
                >
                  <Icon
                    name={Helper.splitIconName("fa-trash")}
                    size={Matrics.ScaleValue(18)}
                    color={Color.darkRed}
                    type="solid"
                  />
                </TouchableOpacity>
              </View>
            ))}
        </View>
        <ErrorComponent stateName={"locations_wanted"} />
      </View>
    );
  }
}

export default LivineWorkingInput;
