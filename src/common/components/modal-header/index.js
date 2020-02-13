import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Images } from "../../styles";
import Styles from "./styles";

class ModalHeader extends Component {
  render() {
    const {
      title,
      leftText,
      rightText,
      closeModal,
      resetModal,
      modalCenter
    } = this.props;
    return (
      <View
        style={[Styles.modalHeader, modalCenter && Styles.removeHeaderSpace]}
      >
        <TouchableOpacity style={Styles.resetBtn} onPress={closeModal}>
          <Image source={Images.close} />
        </TouchableOpacity>
        <View style={Styles.modalTitle}>
          <Text style={Styles.titleText}>{title}</Text>
        </View>
        <TouchableOpacity
          style={[Styles.resetBtn, !rightText && Styles.spaceCover]}
          onPress={resetModal}
        >
          <Text style={Styles.resetText}>{rightText}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default ModalHeader;
