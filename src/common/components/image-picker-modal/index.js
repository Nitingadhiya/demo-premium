import React, { Component } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import { ApplicationStyles, Images, Fonts, Color, Matrics } from '../../styles';

const ImagePickerModal = ({
  visible,
  onPressGallery,
  onPressCamera,
  onPressCancel,
}) => {
  return (
    <Modal visible={visible} transparent>
      <TouchableWithoutFeedback onPress={onPressCancel}>
        <View style={styles.modalViewContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.viewContainer}>
              <Text style={styles.titleText}>Choose Image</Text>

              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={onPressCamera}>
                  <View style={{ margin: Matrics.ScaleValue(20) }}>
                    <Image source={Images.camera} />
                  </View>
                  <Text style={[styles.textStyle]}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onPressGallery}>
                  <View style={{ margin: Matrics.ScaleValue(20) }}>
                    <Image source={Images.gallery} />
                  </View>
                  <Text style={styles.textStyle}>Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
const styles = {
  ...ApplicationStyles,
  viewContainer: {
    backgroundColor: Color.white,
    borderRadius: Matrics.ScaleValue(10),
    alignSelf: 'center',
    padding: Matrics.ScaleValue(20),
  },
  titleText: {
    fontSize: Matrics.ScaleValue(20),
    // color: Color.lightBlack,
    fontFamily: Fonts.type.Arimo,
    alignSelf: 'center',
    marginBottom: Matrics.ScaleValue(10),
  },
  textStyle: {
    fontSize: Matrics.ScaleValue(17),
    color: Color.darkGray,
    fontFamily: Fonts.type.Arimo,
    alignSelf: 'center',
  },
};

export { ImagePickerModal };
