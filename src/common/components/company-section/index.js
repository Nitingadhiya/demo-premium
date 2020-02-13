import React from "react";
import { View, Text, ImageBackground } from "react-native";
import Icon from "react-native-fontawesome-pro";
import StarRating from "react-native-star-rating";
import { Matrics, Color } from "../../styles";
import Styles from "./styles";
import { Helper } from "../../../util";

const starRatingContent = bcomp => {
  if (bcomp && bcomp.rating > 0) {
    return (
      <View style={Styles.companyRatingView}>
        <Text style={Styles.compReviewText}>{bcomp.rating} </Text>
        <StarRating
          disabled={true}
          maxStars={1}
          starSize={Matrics.ScaleValue(8)}
          rating={1}
          fullStarColor={Color.black70}
          starStyle={[Styles.companyStarView, Styles.companySmallStarView]}
          emptyStarColor={Color.paleGreyTwo}
          iconSet={"FontAwesome"}
          emptyStar={"star"}
        />
        <Text style={Styles.compReviewText}>
          {Helper.translation("Words.by", "by")}{" "}
        </Text>

        <Text style={Styles.compReviewText}>
          {bcomp.reviews_count} {Helper.translation("Words.reviews", "reviews")}
        </Text>
      </View>
    );
  }
  return <View />;
};

export const CompanySection = ({ detailsData, customStyle }) => {
  if (!detailsData) {
    return <View />;
  }
  return (
    <View>
      <View style={[Styles.innerViewCard, customStyle]}>
        <View style={{ flex: 1 }}>
          <Text style={Styles.logisticTitle}>
            {detailsData.badge_company ? detailsData.badge_company.name : null}
          </Text>
          <View style={Styles.companyStarView}>
            <StarRating
              disabled={true}
              maxStars={5}
              starSize={Matrics.ScaleValue(15)}
              rating={
                detailsData.badge_company ? detailsData.badge_company.rating : 0
              }
              fullStarColor={Color.darkRed}
              starStyle={Styles.companyStarView}
              emptyStarColor={Color.paleGreyTwo}
              iconSet={"FontAwesome"}
              emptyStar={"star"}
            />
            {starRatingContent(detailsData.badge_company)}
          </View>
        </View>
        <View style={Styles.companyLogoView}>
          {detailsData.badge_company && detailsData.badge_company.logo ? (
            <ImageBackground
              source={{ uri: detailsData.badge_company.logo }}
              style={Styles.companyLogoImage}
              resizeMode="center"
            />
          ) : null}
        </View>
      </View>
      <View style={Styles.hrTag} />

      <View style={Styles.divisonView}>
        {detailsData &&
          detailsData.company_badge_stat.map(res => (
            <View style={Styles.viewResp} key={`${res.name}`}>
              <Text style={Styles.companyBadgeText}>{res.name}</Text>
              <View style={[Styles.drawLine, { borderColor: res.color }]} />
              <Text style={Styles.countTextStyles}>{res.stat}</Text>
              <Icon
                name={Helper.splitIconName(res.icon_class)}
                size={Matrics.ScaleValue(15)}
                type={"regular"}
                color={res.color}
              />
            </View>
          ))}
      </View>
      <View style={Styles.hrTag} />
    </View>
  );
};
