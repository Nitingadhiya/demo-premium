import React, { Component } from "react";
import { Text, View } from "react-native";
import Icon from "react-native-fontawesome-pro";
import StarRating from "react-native-star-rating";
import { Color, Matrics } from "../../styles";
import Styles from "./styles";
import { Events, Helper } from "../../../util";

class ProgressView extends Component {
  state = {
    modalInfo: true,
    lang: null,
    language: [
      {
        title: Helper.translation("Words.English", "English"),
        value: "en",
        checked: true
      },
      {
        title: Helper.translation("Words.German", "German"),
        value: "de",
        checked: false
      },
      {
        title: Helper.translation("Words.Polish", "Polish"),
        value: "pl",
        checked: false
      }
    ]
  };
  componentDidMount() {
    const { language } = this.state;
    language.map((res, i) => {
      if (res.value === global.currentAppLanguage) {
        language[i].checked = true;
        this.languageSetup = language[i].value;
      } else {
        language[i].checked = false;
      }
    });
    this.setState({
      language
    });
  }

  saveStepProcess = () => {
    Events.trigger("languageSetup", this.languageSetup);
    Events.trigger("refreshSignup", this.languageSetup);
    this.setState({
      modalInfo: false,
      lang: this.languageSetup
    });
  };
  selectOption(items, index) {
    let data = items;
    items.map((res, i) => {
      if (i === index) {
        data[i].checked = true;
        this.languageSetup = data[i].value;
      } else {
        data[i].checked = false;
      }
    });
    this.setState({
      [items]: data
    });
  }

  render() {
    const {
      profileScreen,
      firstName,
      emailAddress,
      phoneNumber,
      Fillprofile,
      contactInfo,
      stepComplete
    } = this.props;
    const stepVerify = [
      {
        key: "firstName",
        label: Helper.translation(
          "Profile.Specify first and last name",
          "Specify first and last name"
        ),
        checked: false
      },
      {
        key: "emailAddress",
        label: Helper.translation(
          "Profile.Verify e-mail address",
          "Verify e-mail address"
        ),
        checked: false
      },
      {
        key: "phoneNumber",
        label: Helper.translation(
          "Profile.Verify mobile number",
          "Verify mobile number"
        ),
        checked: false
      },
      {
        key: "Fillprofile",
        label: Helper.translation(
          "Profile.Fill out the profile",
          "Fill out the profile"
        ),
        checked: false
      },
      {
        key: "contactInfo",
        label: Helper.translation(
          "Profile.Confirm that you are ready to give your contact information to potential companies",
          "Confirm that you are ready to give your contact information to potential companies"
        ),
        checked: false
      }
    ];
    return (
      <View style={Styles.mainFront}>
        <View style={Styles.progressMainView}>
          <View style={Styles.progressView}>
            <View
              style={[
                Styles.progressView,
                Styles.fillProgressView,
                { width: stepComplete }
              ]}
            >
              {profileScreen && (
                <Text style={Styles.stepCompleText}>{stepComplete}</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default ProgressView;
