import React from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  Image
} from "react-native";
import EIcon from "react-native-vector-icons/EvilIcons";
import FIcon from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-fontawesome-pro";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Color, Images, Matrics, Fonts, ApplicationStyles } from "../../styles";
import NativeComponent from "../../components/native-component";
import Styles from "./styles";
import { CompanySection } from "../";
import BottomButton from "../bottom-button";
import { Helper } from "../../../util";
import ServerVar from "../../../../config/server-config";

export default class ListViewOptions extends React.PureComponent {
  imageRenderView = data => (
    <View style={Styles.itemImage}>
      <ImageBackground
        source={
          data.campaign_image
            ? { uri: data.campaign_image }
            : Images.listDefault
        }
        style={Styles.bgImage}
      >
        <View style={Styles.bgView}>
          <View style={Styles.topDistanceView}>
            {/* <View style={Styles.transportTypeView}>
              <Text style={Styles.transportText}>Transport Type</Text>
            </View> */}
            {data && data.distance && (
              <View style={Styles.distanceSubView}>
                <Text style={Styles.distanceText}>{data.distance}</Text>
              </View>
            )}
          </View>
          <Text style={Styles.itemTitle} numberOfLines={2}>
            {data && data.title}
          </Text>
          {/* <Text style={Styles.itemSubTitle}>{data && data.company_name}</Text> */}
        </View>
      </ImageBackground>
    </View>
  );

  descriptionRenderView = (data, onPress) => (
    <View style={Styles.descriptionView}>
      {data && data.location_name ? (
        <View style={Styles.locationView}>
          <View style={Styles.iconView}>
            <EIcon
              name="location"
              color={Color.black}
              size={Matrics.ScaleValue(18)}
            />
          </View>
          <Text style={Styles.locationText} numberOfLines={2}>
            {data.location_name}
          </Text>
        </View>
      ) : null}

      {ServerVar.contactType === "driver" &&
      data.travelling &&
      data.travelling.length > 0 ? (
        <View style={Styles.locationView}>
          <View style={Styles.iconView}>
            <FIcon
              name="tripadvisor"
              color={Color.black}
              size={Matrics.ScaleValue(12)}
            />
          </View>
          {data.travelling && (
            <Text numberOfLines={2} style={Styles.locationText}>
              {data.travelling.map((res, index) =>
                data.travelling.length - 1 === index ? res : `${res}, `
              )}
            </Text>
          )}
        </View>
      ) : null}
      <View style={Styles.mainAdvantageView}>
        <Text style={Styles.advantageText}>
          {Helper.translation("Words.Advantage", "Advantage")}
        </Text>
        {data.benefits &&
          data.benefits.length > 0 &&
          data.benefits.slice(0, 3).map((res, index) => (
            <View style={Styles.advantageView} key={`index${index}`}>
              <Icon
                name="star"
                size={Matrics.ScaleValue(12)}
                color={Color.darkRed}
                type={"solid"}
              />
              <Text style={Styles.textRes}>{res}</Text>
            </View>
          ))}
      </View>
    </View>
  );

  render() {
    const { onPress, data } = this.props;
    return (
      <View style={Styles.listItem}>
        <View style={Styles.itemView}>
          <NativeComponent activeOpacity={1} onPress={onPress}>
            <View>
              {this.imageRenderView(data)}

              <CompanySection
                detailsData={data}
                customStyle={Styles.companyViewStyles}
              />

              {this.descriptionRenderView(data, onPress)}
              <BottomButton
                buttonText={Helper.translation(
                  "Words.View offer",
                  "View offer"
                )}
                onPress={onPress}
                color={Color.darkRed}
                customStyle={{
                  borderBottomLeftRadius: Matrics.ScaleValue(5),
                  borderBottomRightRadius: Matrics.ScaleValue(5)
                }}
              />
            </View>
          </NativeComponent>
        </View>
      </View>
    );
  }
}
