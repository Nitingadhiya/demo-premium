import React, { Component } from "react";
import {
  Modal,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import StarRating from "react-native-star-rating";
import { TextInputView, Button } from "../index";
import { Matrics, Images, Color, Fonts } from "../../styles";
import Styles from "./styles";
import ModalHeader from "../modal-header";
import GlobalVar from "../../../global";
import ErrorComponent from "../../../common/components/error-message";
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

class ReviewModal extends Component {
  state = {
    title: "",
    review: "",
    "ratings.kindness": null,
    "ratings.transparency": null,
    "ratings.speed": null,
    "ratings.liability": null,
    errorsMsg: null
  };
  componentDidMount() {
    this.baseState = this.state; // save initial state value
  }

  sendReview(val) {
    const { companyId } = this.props;
    if (!companyId) return;
    const body = {
      company_id: companyId,
      title: val.title,
      review: val.review,
      ratings: {
        kindness: val["ratings.kindness"],
        transparency: val["ratings.transparency"],
        speed: val["ratings.speed"],
        liability: val["ratings.liability"]
      }
    };
    Events.trigger("loading", true);
    APICaller(`${Http.reviewEndPoint}`, "POST", global.apiToken, body).then(
      json => {
        if (json) {
          Events.trigger("loading", false);
          if (json.status && json.status === GlobalVar.responseInvalidCode) {
            const errors = json.data.errors;
            this.setState({
              errorsMsg: errors // set state Error message,
            });
            return;
          }
          this.setState(this.baseState);
          Events.trigger("reviewModalVisible", false);
        }
      }
    );
  }

  textInput = (
    placeholder,
    stateName,
    returnKeyType,
    keyboardType,
    nextRef,
    value,
    multiline,
    phoneInput
  ) => {
    return (
      <View key={`${nextRef}_Text`}>
        <TextInputView
          placeholder={placeholder}
          placeholderTextColor={Color.silver}
          placeholderStyle={Styles.placeholderStyle}
          style={Styles.textInput}
          value={value[stateName]}
          returnKeyType={returnKeyType}
          keyboardType={keyboardType}
          maxLength={40}
          multiline={multiline}
          phoneInput={phoneInput}
          onChangeText={email => this.textInputChange(stateName, email)}
          Ref={r => {
            nextRef === "Password" ? (this.Password = r) : (this.Password = r);
          }}
        />
        {this.state.errorsMsg && (
          <ErrorComponent
            stateName={stateName}
            errorsMsg={this.state.errorsMsg}
          />
        )}
      </View>
    );
  };

  /* text input change */
  textInputChange = (stateVal, value) => {
    this.setState({ [stateVal]: value });
  };

  resetVal() {
    this.setState({
      title: null,
      review: null,
      "ratings.kindness": 0,
      "ratings.transparency": 0,
      "ratings.speed": 0,
      "ratings.liability": 0
    });
  }

  reviewCategory = () => {
    const categoryArr = Object.keys(catRR);
    return (
      <View style={Styles.categoryMainView}>
        {categoryArr.map((res, index) => {
          return (
            <View key={index.toString()}>
              <View style={Styles.reviewCategoryView}>
                <Text style={Styles.reviewCategotyTiteText}>
                  {Helper.splitNameWithDot(res)}
                </Text>
                <View style={Styles.ratingStarView}>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    starSize={Matrics.ScaleValue(18)}
                    rating={this.state[`${res}`]}
                    selectedStar={rating => this.onStarRatingPress(rating, res)}
                    fullStarColor={Color.darkRed}
                    starStyle={Styles.starView}
                  />
                </View>
              </View>
              <ErrorComponent
                stateName={res}
                errorsMsg={this.state.errorsMsg}
              />
            </View>
          );
        })}
      </View>
    );
  };

  onStarRatingPress(rating, stateKey) {
    this.setState({
      [`${stateKey}`]: rating
    });
  }

  render() {
    const { visible, closeModalReq } = this.props;
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
                title={Helper.translation("Words.Reviews", "Reviews")}
                leftText="close"
                rightText=""
                closeModal={closeModalReq}
                modalCenter
              />
              <View style={Styles.reviewSections}>
                <View style={Styles.innerView}>
                  <View>
                    <Text style={Styles.heading}>
                      {Helper.translation("Words.Heading", "Heading")}
                    </Text>
                    {textInputRegisterArray &&
                      textInputRegisterArray.map(res => {
                        return this.textInput(
                          res.placeholder,
                          res.stateName,
                          res.returnKeyType,
                          res.keyboardType,
                          res.nextRef,
                          this.state,
                          res.multiline,
                          res.phoneInput
                        );
                      })}
                  </View>
                  {this.reviewCategory()}
                  <View
                    style={{
                      marginTop: Matrics.ScaleValue(5),
                      marginBottom: Matrics.ScaleValue(10)
                    }}
                  >
                    <Text style={Styles.heading}>
                      {Helper.translation("Words.Rating", "Rating")}
                    </Text>
                    {textInputRatingArray &&
                      textInputRatingArray.map(res => {
                        return this.textInput(
                          res.placeholder,
                          res.stateName,
                          res.returnKeyType,
                          res.keyboardType,
                          res.nextRef,
                          this.state,
                          res.multiline,
                          res.phoneInput
                        );
                      })}
                  </View>
                  <Button
                    label={"Send"}
                    onPress={() => this.sendReview(this.state)}
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

export default ReviewModal;
