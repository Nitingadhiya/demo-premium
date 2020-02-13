import React, { Component, useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import AIcon from "react-native-vector-icons/AntDesign";
import { ButtonSmall } from "../index";
import { Matrics, Images, Color, Fonts } from "../../styles";
import Styles from "./styles";
import ModalHeader from "../modal-header";
import { Helper } from "../../../util";

const Arr = [
  { key: 1, value: true },
  { key: 1, value: false },
  { key: 1, value: false },
  { key: 1, value: true },
  { key: 1, value: false }
];

const DashboardModal = ({
  visible,
  actionOptions,
  onPress,
  imageSrc,
  title,
  closeModalReq,
  actionList,
  navigation
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={closeModalReq}
    >
      <View style={Styles.mainModalView}>
        <ModalHeader
          title={Helper.translation("Home.Your awards", "Your awards")}
          leftText="close"
          rightText=""
          closeModal={closeModalReq}
        />
        <View style={Styles.bodyView}>
          {actionList && (
            <View style={Styles.subView}>
              <Text style={Styles.actionName}>{actionList.name}</Text>
              <Text style={Styles.actionDescription}>
                {actionList.description}
              </Text>
              {actionList.actions.map((res, index) => (
                <TouchableOpacity
                  style={Styles.listView}
                  key={index.toString()}
                  disabled={res.completed}
                  activeOpacity={1}
                  onPress={() => onPress(res)}
                >
                  {res.completed && <View style={Styles.opacityView} />}
                  {res.completed ? (
                    <View style={Styles.checkboxFillView}>
                      <AIcon
                        name="checkcircleo"
                        size={Matrics.ScaleValue(17)}
                        color={Color.green}
                      />
                    </View>
                  ) : (
                    <View style={Styles.checkboxView} />
                  )}
                  <View style={{ flex: 1 }}>
                    <View style={Styles.actTextList}>
                      <Text
                        style={[
                          Styles.textAgree,
                          res.completed && Styles.disabledText
                        ]}
                      >
                        {res.title}
                      </Text>
                      <Text
                        style={[
                          Styles.descText,
                          res.completed && Styles.disabledText
                        ]}
                      >
                        {res.description}
                      </Text>
                    </View>
                    {!res.completed && res.buttonText && (
                      <View
                        style={[
                          Styles.viewButton,
                          res.completed && Styles.disabledText
                        ]}
                      >
                        <ButtonSmall
                          label={res.buttonText}
                          onPress={() => onPress(res)}
                          customStyle={Styles.buttonStyles}
                          customTextStyle={Styles.customTextStyle}
                        />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export { DashboardModal };
