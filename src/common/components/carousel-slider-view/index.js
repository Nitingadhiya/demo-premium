import React, {Component} from 'react';
import {View, Image} from 'react-native';
import Carousel from 'react-native-looped-carousel';
import APICaller from '../../../utils/api-caller';
import {
  sliderImagesEndPoint,
  getDealerImageEndPoint,
} from '../../../config/api-endpoint';
import {Matrics, Color} from '../../styles';
import styles from './styles';

class CarouselSliderView extends Component {
  state = {
    sliderImage: null,
  };

  componentDidMount() {
    const {type} = this.props;
    if (type === 'Dealer') {
      this.dealerItem();
    } else {
      this.getSliderImage();
    }
  }

  getSliderImage() {
    APICaller(sliderImagesEndPoint, 'GET', '').then(json => {
      if (json.data.Success === '1') {
        this.setState({
          sliderImage: json.data.Response,
        });
      }
    });
  }

  dealerItem() {
    APICaller({getDealerImageEndPoint}, 'GET').then(json => {
      this.setState({
        loadingData: false,
      });
      if (json.data.Success === '1') {
        let data = json.data.Response;
        _.map(data, res => {
          res.uri = res.Slide;
          delete res.Slide;
        });
        this.setState({sliderImage: data});
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
