import React, {Component} from 'react';
import {SafeAreaView, Linking, View} from 'react-native';
import CarouselSliderView from '../../common/components/carousel-slider-view';
import LoginComponent from '../../components/login';
import styles from './styles';
import NavigationHelper from '../../utils/navigation-helper';
import {FloatingMenu} from '../../package';
import {McIcon} from '../../common/assets/vector-icon';
import {Color} from '../../common/styles';

const items = [
  {label: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/pscsrt'},
  {
    label: 'Instagram',
    icon: 'instagram',
    url: 'https://www.instagram.com/pscsurat',
  },
  {
    label: 'Telegram',
    icon: 'telegram',
    url: 'https://t.me/joinchat/AAAAAEnltsxmb1GF_S6Xgg',
  },
  {label: 'Twitter', icon: 'twitter', url: 'https://twitter.com/premiumsurat'},
  {
    label: 'WhatsApp',
    icon: 'whatsapp',
    url: 'https://wa.me/919033685001?text=Send+me+Updates',
  },
  {label: 'Product List', icon: 'file-document'},
];

class Login extends Component {
  state = {
    isMenuOpen: false,
  };

  handleMenuToggle = () => {
    const {isMenuOpen} = this.state;
    this.setState({
      isMenuOpen: !isMenuOpen,
    });
  };

  renderItemIcon = (item, index, menuState) => {
    const {itemsDown} = menuState;
    const isItemPressed = itemsDown[index];
    const color = isItemPressed ? '#fff' : Color.primary;

    if (item.icon) {
      return <McIcon name={item.icon} color={color} size={22} />;
    }

    return null;
  };

  renderMenuIcon = menuState => {
    const {isMenuOpen} = this.state;
    const {menuButtonDown} = menuState;
    console.log(isMenuOpen, menuState);

    return isMenuOpen ? (
      <McIcon
        name={'close'}
        color={menuButtonDown ? '#fff' : Color.primary}
        size={25}
      />
    ) : (
      <McIcon
        name={'menu'}
        color={menuButtonDown ? '#fff' : Color.primary}
        size={25}
      />
    );
  };

  handleItemPress = item => {
    const {navigation} = this.props;
    if (item.icon == 'file-document') {
      NavigationHelper.navigate(navigation, 'ProductListScreen');
    } else {
      console.log('URL', item.url);
      Linking.openURL(item.url);
    }
  };

  floatingIcon = () => {
    return (
      <FloatingMenu
        items={items}
        isOpen={this.state.isMenuOpen}
        onMenuToggle={this.handleMenuToggle}
        onItemPress={this.handleItemPress}
        renderItemIcon={this.renderItemIcon}
        renderMenuIcon={this.renderMenuIcon}
        style={{marginRight: -20}}
      />
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <CarouselSliderView />
        <LoginComponent navigation={this.props.navigation} />
        {this.floatingIcon()}

        {/* <TouchableOpacity
          style={styles.productListIcon}
          onPress={() =>
            NavigationHelper.navigate(navigation, 'ProductListScreen')
          }>
          <AIcon name="filetext1" size={20} color="#fff" style={{margin: 5}} />
        </TouchableOpacity> */}
      </SafeAreaView>
    );
  }
}
export default Login;
