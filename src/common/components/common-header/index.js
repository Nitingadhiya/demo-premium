import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {Color, ApplicationStyles, Images, Matrics} from '../../styles';
import {Appbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

const drawerMenu = ({navigation}) => (
  <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
);

const backButton = ({navigation}) => (
  <Appbar.BackAction onPress={() => navigation.goBack()} />
);

export const Header = ({title, left}) => {
  const navigation = useNavigation();

  return (
    <Appbar.Header>
      {left === 'menu' && drawerMenu(navigation)}
      {left === 'back' && backButton(navigation)}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};
