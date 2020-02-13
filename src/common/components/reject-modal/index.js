import React, { Component } from "react";
import {
  Modal,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Platform
} from "react-native";
import _ from "lodash";
import Spinner from "react-native-spinkit";
import StarRating from "react-native-star-rating";
import Icon from "react-native-fontawesome-pro";
import { TextInputView, Button } from "../index";
import { Matrics, Images, Color, Fonts } from "../../styles";
import Styles from "./styles";
import ModalHeader from "../modal-header";
import GlobalVar from "../../../global";
import ErrorComponent from "../error-message";
//import Events from "../../../util/events";
import { APICaller, Events, Helper } from "../../../util";
//import APICaller from "../../../util/apiCaller";
import Http from "../../../api/http";
// import Helper from "../../../util/helper";

const textInputRegisterArray = [
  {
    placeholder: "Heading",
    stateName: "title",
    returnKeyType: "done",
    keyboardType: "default",
    nextRef: "rating",
    multiline: false,
    phoneInput: false
  }
];

const textInputRatingArray = [
  {
    placeholder: " ",
    stateName: "review",
    returnKeyType: "done",
    keyboardType: "default",
    nextRef: "rating",
    multiline: true,
    phoneInput: false
  }
];

const catRR = {
  "ratings.kindness": 0,
  "ratings.transparency": 0,
  "ratings.speed": 0,
  "ratings.liability": 0
};

class RejectModal extends Component {
  state = {
    textInputArray: [],
    errorsMsg: null,
    loading: false
  };
  componentDidMount() {
    this.getOfferRejectReason();
  }

  rejectRequestReview(offer_token) {
    const body = {
      reasons: this.state.textInputArray
    };
    this.setState({
      loading: true
    });
    APICaller(
      `${Http.acceptRejectOfferEndPoint}/reject/${offer_token}`,
      "POST",
      global.apiToken,
      body
    ).then(json => {
      if (json) {
        if (json.status && json.status === GlobalVar.responseInvalidCode) {
          this.setState({
            errorsMsg: json.data.errors,
            loading: false
          });
          return;
        }
        if (json.status && json.status === GlobalVar.responseSuccess) {
          const obj = {
            message: json.data.message,
            modal: false
          };
          Events.trigger("rejectModal", obj);
        }
        this.setState({
          loading: false
        });
      }
    });
  }

  getOfferRejectReason() {
    Events.trigger("loading", true);
    APICaller(
      `${Http.offerRejectOptionsEndPoint}`,
      "GET",
      global.apiToken
    ).then(json => {
      console.log(json, "json write review");
      if (json) {
        Events.trigger("loading", false);
        if (json.status && json.status === GlobalVar.responseInvalidCode) {
          const errors = json.data.errors;
          this.setState({
            errorsMsg: errors // set state Error message,
          });
          return;
        }
        if (json.status && json.status === GlobalVar.responseSuccess) {
          console.log(json);
          let data = json.data;
          data.map(res => {
            const texInput = {
              placeholder: " ",
              stateName: res.name,
              returnKeyType: "done",
              keyboardType: "default",
              nextRef: "",
              multiline: true,
              phoneInput: false
            };
            _.merge(res, texInput);
          });
          this.setState({
            textInputArray: data
          });
        }
        Events.trigger("loading", false);
      }
    });
  }

  checkboxCheck(val, index) {
    this.state.textInputArray[index].checked = !val;
    const textInputArr = this.state.textInputArray;
    this.setState({
      textInputArray: textInputArr
    });
  }

  textInput = (
    placeholder,
    stateName,
    returnKeyType,
    keyboardType,
    nextRef,
    value,
    multiline,
    phoneInput,
    checked,
    index,
    name
  ) => {
    return (
      <View
        key={`${nextRef}_Text`}
        style={{
          borderWidth: 1,
          borderColor: Color.paleGreyTwo,
          marginTop: Matrics.ScaleValue(10),
          borderRadius: Matrics.ScaleValue(5),
          padding: Matrics.ScaleValue(5)
        }}
      >
        <TouchableOpacity
          style={Styles.touchBtn}
          onPress={() => this.checkboxCheck(checked, index)}
        >
          <View style={Styles.checkView}>
            {checked ? (
              <Icon
                name={"check"}
                color={Color.darkRed}
                size={Matrics.ScaleValue(16)}
                style={{
                  marginTop:
                    Platform.OS === "ios"
                      ? Matrics.ScaleValue(-4)
                      : Matrics.ScaleValue(0)
                }}
              />
            ) : null}
          </View>
          <Text> {name}</Text>
        </TouchableOpacity>
        <TextInputView
          placeholder={placeholder}
          placeholderTextColor={Color.silver}
          placeholderStyle={Styles.placeholderStyle}
          style={[Styles.textInput, { borderWidth: 1 }]}
          value={value[stateName]}
          returnKeyType={returnKeyType}
          keyboardType={keyboardType}
          maxLength={255}
          multiline={multiline}
          phoneInput={phoneInput}
          onChangeText={text => this.textInputChange(stateName, text, index)}
        />
        {this.state.errorsMsg && (
          <ErrorComponent
            stateName={`reasons.${index}.text`}
            errorsMsg={this.state.errorsMsg}
          />
        )}
      </View>
    );
  };

  /* text input change */
  textInputChange = (stateVal, value, index) => {
    this.setState({ [stateVal]: value });
    this.state.textInputArray[index].text = value;
  };

  onStarRatingPress(rating, stateKey) {
    this.setState({
      [`${stateKey}`]: rating
    });
  }

  render() {
    const { visible, closeModalReq, offer_token } = this.props;
    const { textInputArray } = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={closeModalReq}
      >
        <View style={Styles.mainModalView}>
          <KeyboardAvoidingView
            behavior={GlobalVar.keyboardBehavior()}
            keyboardVerticalOffset={GlobalVar.verticalOffset()}
          >
            <ScrollView
              style={Styles.bodyView}
              keyboardShouldPersistTaps={"handled"}
            >
              <ModalHeader
                title={Helper.translation(
                  "Words.Why does this offer not fit you?",
                  "Why does this offer not fit you?"
                )}
                leftText="close"
                rightText=""
                closeModal={closeModalReq}
                modalCenter
              />
              <View style={Styles.reviewSections}>
                <View style={Styles.innerView}>
                  <View
                    style={{
                      marginTop: Matrics.ScaleValue(5),
                      marginBottom: Matrics.ScaleValue(10)
                    }}
                  >
                    <Text style={Styles.heading}>
                      {Helper.translation(
                        "Words.feedbackImportance",
                        "Your feedback is important to us. We would like to provide you with more suitable offers in the future. We would be glad if you tell us why this offer is not interesting"
                      )}
                    </Text>
                    {textInputArray &&
                      textInputArray.map((res, index) => {
                        return this.textInput(
                          res.placeholder,
                          res.stateName,
                          res.returnKeyType,
                          res.keyboardType,
                          res.nextRef,
                          this.state,
                          res.multiline,
                          res.phoneInput,
                          res.checked,
                          index,
                          res.name
                        );
                      })}
                  </View>
                  {this.state.loading ? (
                    <View style={Styles.spinnerView}>
                      <Spinner
                        style={styles.spinner}
                        isVisible={true}
                        size={Matrics.ScaleValue(50)}
                        type={"ThreeBounce"}
                        color={Color.darkRed}
                      />
                    </View>
                  ) : null}
                  <Button
                    label={Helper.translation("Words.Send", "Send")}
                    onPress={() => this.rejectRequestReview(offer_token)}
                  />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  }
}

export default RejectModal;
