import React, {Component} from 'react';
import {Modal, View, Text, TouchableOpacity} from 'react-native';
import Styles from './styles';
import Helper from '../../../utils/helper';
const ConfirmModal = ({
  visible,
  title,
  message,
  leftButton,
  rightButton,
  leaveModalReq,
  cancelModalReq,
  backDisabled,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={backDisabled ? null : cancelModalReq}>
      <View style={Styles.modalViewContainer}>
        <View style={Styles.viewContainer}>
          <View style={Styles.spaceView}>
            {title ? <Text style={Styles.titleText}>{title}</Text> : null}
            <Text style={Styles.msgStyle}>{message}</Text>
          </View>
          <View style={Styles.btnView}>
            {leftButton && (
              <TouchableOpacity
                style={[Styles.btnStyle, Styles.btnFirst]}
                onPress={cancelModalReq}>
                <Text style={Styles.leaveText}>{leftButton}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={Styles.btnStyle} onPress={leaveModalReq}>
              <Text style={Styles.cancelText}>{rightButton}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export {ConfirmModal};
