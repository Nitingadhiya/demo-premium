import React, {Component} from 'react';
import {View, Image} from 'react-native';
import Carousel from 'react-native-looped-carousel';
import APICaller from '../../../utils/api-caller';
import APIEndpoint from '../../../config/api-endpoint';
import {Matrics, Color} from '../../styles';
import styles from './styles';

class CarouselSliderView extends Component {
  state = {
    sliderImage: null,
  };

  componentDidMount() {
    this.getSliderImage();
  }

  getSliderImage() {
    APICaller(APIEndpoint.sliderImagesEndPoint, 'GET', '').then(json => {
      if (json.data.Success === '1') {
        this.setState({
          sliderImage: json.data.Response,
        });
      }
    });
  }
  render() {
    const {sliderImage} = this.state;
    return (
      <View style={styles.childContainer}>
        {sliderImage ? (
          <Carousel style={styles.carouselView} pageInfo={false}>
            {sliderImage.map((data, index) => {
              return (
                <View style={styles.sliderImageView} key={`${index}_str`}>
                  <Image
                    source={{uri: `${data.Slide}?${Math.random()}`}}
                    resizeMode="stretch"
                    style={styles.sliderImage}
                  />
                </View>
              );
            })}
          </Carousel>
        ) : null}
      </View>
    );
  }
}

export default CarouselSliderView;
