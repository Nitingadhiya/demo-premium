import React, { Component } from "react";
import {
  Modal,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image, Linking,
  StyleSheet,
  Share
} from "react-native";
import _ from "lodash";
import { AppEventsLogger } from "react-native-fbsdk";
import Spinner from "react-native-spinkit";
import HTMLView from 'react-native-htmlview';
// import StarRating from "react-native-star-rating";
 import Icon from "react-native-fontawesome-pro";
//import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { TextInputView, Button, Checkbox } from "../index";
import { TimePicker } from "../../../contact-types-general/general/inputs";
import { Matrics, Images, Color, Fonts, ApplicationStyles } from "../../styles";
import Styles from "./styles";
import ModalHeader from "../modal-header";
import GlobalVar from "../../../global";
import ErrorComponent from "../error-message";
import { APICaller, Events, Helper } from "../../../util";
import Http, { setContactPreferencesEndpoint } from "../../../api/http";
import dataOption from "../../../../form-assets/data";
import moment from "moment";
import RegisterObj from "../../../api/register-data";

const styles = StyleSheet.create({
  view: {
    fontFamily: Fonts.type.Rubik,
   fontSize: Matrics.ScaleValue(14),
   color: Color.black30,
    marginTop: Matrics.ScaleValue(5),
   marginBottom: Matrics.ScaleValue(10)
  },
  span: {
   color:Color.darkRed
  },
});
const checkboxArr = [
  {
    label: "Telephone / Mobile Phone",
    key: "phone",
    icon: "phone-alt",
    type: "regular",
    size: 15
  },
  {
    label: "SMS",
    key: "sms",
    icon: "mobile",
    type: "regular",
    size: 15
  },
  {
    label: "Whatsapp",
    key: "whatsapp",
    icon: "whatsapp",
    type: "brands",
    size: 18
  },
  {
    label: "E-Mail",
    key: "email",
    icon: "envelope",
    type: "regular",
    size: 15
  }
];

class AcceptOfferModal extends Component {
  state = {
    textInputArray: [],
    errorsMsg: null,
    loading: false,
    acceptOptions: dataOption.acceptOptions,
    fromTimePickerVisible: false,
    toTimePickerVisible: false,
    fromTimeFormat: "08:00",
    toTimeFormat: "22:00",
    sharableData: null
  };

  componentDidMount() {
     //this.getShareableRefferal("122437");
  }

  timeReachedRequestReview(id) {
    const body = {
      medium: {
        phone: _.includes(RegisterObj.acceptOptions, "phone"),
        sms: _.includes(RegisterObj.acceptOptions, "sms"),
        whatsapp: _.includes(RegisterObj.acceptOptions, "whatsapp"),
        email: _.includes(RegisterObj.acceptOptions, "email")
      },
      time: {
        from: moment(this.state.fromTimeFormat, ["h:mm A"]).format("HH:mm"),
        till: moment(this.state.toTimeFormat, ["h:mm A"]).format("HH:mm")
      }
    };
    console.log("body", body);
    this.setState({
      loading: true
    });
    APICaller(
      `${setContactPreferencesEndpoint(id)}`,
      "PUT",
      global.apiToken,
      body
    ).then(json => {
      if (json) {
        console.log(json, "json");
        if (json.status && json.status === GlobalVar.responseInvalidCode) {
          this.setState({
            errorsMsg: json.data.errors,
            loading: false
          });
          return;
        }
        if (json.status && json.status === GlobalVar.responseSuccess) {
          this.props.contactPreferencesFn();
          this.getShareableRefferal(id);
        }
        this.setState({
          loading: false
        });
      }
    });
  }

  getShareableRefferal(id) {
    this.setState({
      loading: true
    });
    APICaller(
      `${Http.getShareableLinksEndpoint(id)}`,
      "GET",
      global.apiToken
    ).then(json => {
      if (json) {
        console.log(json, "json");
        if (json.status && json.status === GlobalVar.responseInvalidCode) {
          this.setState({
            errorsMsg: json.data.errors,
            loading: false
          });
          return;
        }
        if (json.status && json.status === GlobalVar.responseSuccess) {
          const resp = json.data;
          this.setState({
            sharableData: resp.data
          });
        }
        this.setState({
          loading: false
        });
      }
    });
  }

  fromToClock(timeFormat, title, type) {
    return (
      <TimePicker
        title={title}
        time={timeFormat}
        fromTimeProps={value => {
          if (type === "fromType") {
            this.setState({
              fromTime: value
            });
          }
          if (type === "toType") {
            this.setState({
              toTime: value
            });
          }
        }}
      />
    );
  }

  checkURLSupport(data, res) {
   const url = _.get(data[res],'link_mobile', '');
   if(!url) return;
   let callback_url = '';
    if(res === 'facebook_messenger') {
      callback_url = 'https://play.google.com/store/apps/details?id=com.facebook.orca&hl=en';
    }
    if(res === 'whatsapp') {
      callback_url = 'https://play.google.com/store/apps/details?id=com.whatsapp&hl=en';
    }
    Linking.canOpenURL(url).then(supported => {

      if (!supported) {
        if(!callback_url) {
          Events.trigger('toast', `Please install ${data[res].name} app`);
          return;
        }
        Linking.openURL(callback_url)
        return;
        console.log('Can\'t handle url: ' + url);
      }else{
        return Linking.openURL(url);
      }
     }).catch(err =>
         console.log('An error occurred', err));
    }

  replaceString = (string, value) => {
    return _.replace(string, ":amount", value);
  };

  contactPreferencesView = (
    fromTimeFormat,
    toTimeFormat,
    acceptOptions,
    data
  ) => (
    <View style={Styles.reviewSections}>
      <View style={Styles.innerView}>
        <View
          style={{
            marginTop: Matrics.ScaleValue(5),
            marginBottom: Matrics.ScaleValue(10)
          }}
        >
          <Text style={Styles.heading}>
            <Text style={{ textAlign: "center" }}>
              {Helper.translation("OfferAccept.Excellent!", "Excellent!")}{" "}
            </Text>
            {Helper.translation(
              "OfferAccept.You have been unlocked for",
              "You have been unlocked for"
            )}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginVertical: Matrics.ScaleValue(10),
            borderBottomWidth: 1,
            borderBottomColor: Color.paleGrey,
            paddingBottom: Matrics.ScaleValue(10)
          }}
        >
          <View
            style={{
              width: Matrics.ScaleValue(80),
              height: Matrics.ScaleValue(50),
              marginRight: Matrics.ScaleValue(5),
              
            }}
          >
            {data && data.badge_company && data.badge_company.logo ? (
              <Image
                source={{
                  uri: _.get(data, "badge_company.logo")
                }}
                style={{
                  width: Matrics.ScaleValue(75),
                  height: Matrics.ScaleValue(45)
                }}
                resizeMode={"center"}
              />
            ) : (
              <View style={{ width: Matrics.ScaleValue(80),
                height: Matrics.ScaleValue(50),borderWidth: 1,
                borderRadius: Matrics.ScaleValue(5),borderColor: Color.paleGreyTwo, justifyContent: "center",
                }}>
              <Text
                style={{
                  color: Color.darkGray,
                  fontSize: Matrics.ScaleValue(12),
                  fontFamily: Fonts.type.Rubik,
                  textAlign: "center"
                }}
              >
                {Helper.translation('OfferAccept.No Image', 'No Image')}
              </Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1,flexWrap: 'wrap'}}>
            <Text
              style={{
                fontFamily: Fonts.type.RubikMedium,
                fontSize: Matrics.ScaleValue(14),
                color: Color.black30
              }}
            >
              {_.get(data, "badge_company.name", "")}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.type.RubikMedium,
                fontSize: Matrics.ScaleValue(14),
                color: Color.black30,
                marginTop: Matrics.ScaleValue(5)
              }}
            >
              {_.get(data, "badge_user.name", "")}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.type.Rubik,
                fontSize: Matrics.ScaleValue(12),
                color: Color.black70
              }}
            >
              {_.get(data, "badge_user.position", "")}
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={{
              fontSize: Matrics.ScaleValue(16),
              fontFamily: Fonts.type.Rubik,
              color: Color.black30
            }}
          >
            {Helper.translation('OfferAccept.How and when do you most want to be reached?', 'How and when do you most want to be reached?')}
          </Text>
          <View>
            <Checkbox
              items={checkboxArr}
              title={""}
              stateName="acceptOptions"
              onPress={val => {
                Helper.checkboxselectOption("acceptOptions", val);
                this.setState({
                  acceptOptions
                });
              }}
              customView={ApplicationStyles.checkboxView}
              langType="OfferAccept"
              icon={true}
            />
          </View>
        </View>
        <View style={{ marginVertical: Matrics.ScaleValue(10) }}>
          <Text
            style={{
              fontSize: Matrics.ScaleValue(16),
              fontFamily: Fonts.type.Rubik,
              color: Color.black30
            }}
          >
            {Helper.translation('OfferAccept.Between and clock', 'Between and clock')}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            {this.fromToClock(fromTimeFormat, "From Time", "fromType")}
            {this.fromToClock(toTimeFormat, "To Time", "toType")}
          </View>
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
          label={Helper.translation("OfferAccept.Further", "further")}
          onPress={() => this.timeReachedRequestReview(data.offer_id)}
        />
        {data.has_voucher_amount ?
        <Text
          style={{
            fontSize: Matrics.ScaleValue(14),
            fontFamily: Fonts.type.RubikMedium,
            color: Color.darkRed,
            marginTop: Matrics.ScaleValue(20),
            textAlign: "center"
          }}
        >
           {this.replaceString(data.voucher_title, data.voucher_amount)}
        </Text>
         : null}
      </View>
    </View>
  );

  fetchIconType = (data, res) => {
    const name = data[res].icon_class;
    if(!name) return 'solid';
    const type = `${name}`.split(" ")[0];
    console.log(type, 'type')
    if(type === 'fas') {
      return 'solid'
    }
    if(type === 'fab') {
      return 'brands'
    }
  }

  fetchIconSize = (data, res) => {
    const name = data[res].icon_class;
    if(!name) return Matrics.ScaleValue(15);
    const type = `${name}`.split(" ")[0];
    console.log(type, 'type')
    if(type === 'fas') {
      return Matrics.ScaleValue(15)
    }
    if(type === 'fab') {
      return Matrics.ScaleValue(18)
    }
  }

  fetchIconName= (data, res) => {
    const name = data[res].icon_class;
    if(!name) return ['fas', 'question'];
    const type = `${name}`.split(" ")[0];
    const n = name.split(" ").pop();
    const iconName = n.replace('fa-','')
    return iconName;
  }

  onShare = async (link) => {
    try {
      const result = await Share.share({
        message: `${GlobalVar.shareJobPostContent}: ${link}`
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          AppEventsLogger.logEvent("ShareJobPost",`${result.activityType}`);
          // shared with activity type of result.activityType
        } else {
          Helper.customTrackEvent("ShareJobPost");
          // shared
        }
        this.props.offerScreen();
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  sharePreferencesView = (data) => {
    return (
      <View style={{ padding: Matrics.ScaleValue(10) }}>
        {data && data.has_voucher_amount ?
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <View
            style={{
              flexWrap: "wrap",
              flex: 1,
              paddingRight: Matrics.ScaleValue(5)
            }}
          >
            <Text
              style={{
                fontSize: Matrics.ScaleValue(16),
                fontFamily: Fonts.type.RubikMedium,
                color: Color.black30,
              }}
            >
              {this.replaceString(data.voucher_title, data.voucher_amount)}
            </Text>
            <HTMLView
              value={data.voucher_description}
              stylesheet={styles}
            />
          </View>
          <View>
            <Image
              source={Images.amazonVouchar}
              style={{
                width: Matrics.ScaleValue(80),
                height: Matrics.ScaleValue(50)
              }}
              resizeMode="contain"
            />
          </View>
        </View>
        : null }

        {/* <View
          style={{
            backgroundColor: Color.paleGreyTwo,
            padding: Matrics.ScaleValue(10),
            marginVertical: Matrics.ScaleValue(10),
            borderRadius: Matrics.ScaleValue(5),
            borderWidth: 1,
            borderColor: Color.paleGreyThree,
            flexWrap: "wrap"
          }}
        >
          <Text
            style={{
              color: Color.black30,
              fontSize: Matrics.ScaleValue(14),
              fontFamily: Fonts.type.Rubik
            }}
          >
            {data && data.shareable_link}
          </Text>
        </View> */}
        {/* <View style={{ alignItems: 'center'}}>
          <TouchableOpacity onPress={()=>this.onShare(data.shareable_link)} style={Styles.sharebleTouch}>
            <Icon name="share" type="solid" color={Color.white}  />
            <Text style={Styles.shareJobText}>5 € {Helper.translation('OfferAccept.Voucher received', "Gutschein erhalten")}</Text>
          </TouchableOpacity>
        </View> */}
       <View
          style={{
            borderWidth: 1,
            borderColor: Color.paleGreyTwo,
            borderRadius: Matrics.ScaleValue(5)
          }}
        >
        
           {data.social && _.map(_.keys(data.social),(res,index)=>(
            <TouchableOpacity
              style={{ padding: Matrics.ScaleValue(10), flexDirection: "row", borderBottomColor: Color.paleGrey, borderBottomWidth: 1 }}
              onPress={() => this.checkURLSupport(data.social, res)}
              key={`${index.toString()}`}
            >
              <Icon name={this.fetchIconName(data.social, res)} type={this.fetchIconType(data.social, res)} color={_.get(data.social[res],'color', Color.black30)} size={this.fetchIconSize(data.social, res)} />
             <Text style={{ marginLeft: Matrics.ScaleValue(5), color: Color.black30, fontFamily: Fonts.type.Rubik, fontSize: Matrics.ScaleValue(14)  }}>{_.get(data.social[res],'name', '')}</Text>
            </TouchableOpacity> 
          ))}
        </View> 
        <View
          style={{
            marginTop: Matrics.ScaleValue(20),
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            style={{ padding: Matrics.ScaleValue(10) }}
            onPress={() => this.props.offerScreen()}
          >
            <Text
              style={{
                fontSize: Matrics.ScaleValue(14),
                fontFamily: Fonts.type.RubikMedium,
                color: Color.darkRed,
                textAlign: "center",
                textDecorationLine: 'underline'
              }}
            >
              {Helper.translation('OfferAccept.See more offers', 'See more offers')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const { visible, closeModalReq, data, contactPreferences } = this.props;
    const {
      acceptOptions,
      fromTimePickerVisible,
      toTimePickerVisible,
      fromTimeFormat,
      toTimeFormat,
      sharableData
    } = this.state;
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={closeModalReq}
      >
        <View style={Styles.mainModalView}>
          <KeyboardAvoidingView
            behavior={GlobalVar.keyboardBehavior()}
            keyboardVerticalOffset={GlobalVar.verticalOffset()}
            style={Styles.bodyView}
          >
            <ModalHeader
              title={Helper.translation(
                "OfferAccept.Offer Accepted",
                "Offer Accepted"
              )}
              leftText="close"
              rightText=""
              closeModal={closeModalReq}
              modalCenter
            />
            <ScrollView keyboardShouldPersistTaps={"handled"}>
              {!contactPreferences
                ? this.contactPreferencesView(
                    fromTimeFormat,
                    toTimeFormat,
                    acceptOptions,
                    data
                  )
                : null}
                { contactPreferences && sharableData ? this.sharePreferencesView(sharableData) : null}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  }
}

export default AcceptOfferModal;