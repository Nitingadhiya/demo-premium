// LIBRARIES
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  AsyncStorage,
  Dimensions,
} from 'react-native';
import {Images, Color, Matrics} from '../../common/styles';
import {getLocationListEndPoint} from '../../config/api-endpoint';
import APICaller from '../../utils/api-caller';
import {generateRandomPoints, generateRandomPoint} from '../../generator';
import {Marker, Callout} from 'react-native-maps';
import ClusteredMapView from 'react-native-maps-super-cluster';
import {SpinnerView, Header} from '../../common/components';

let self;
const italyCenterLatitude = 41.8962667,
  italyCenterLongitude = 11.3340056,
  radius = 600000;
class ServicePackage extends Component {
  state = {
    loadingData: false,
    pins: [],
  };

  componentDidMount() {
    self = this;
    //this.reload();
    this.getMarkerPoint();
  }

  getMarkerPoint() {
    const body = {
      LoginType: '1',
    };
    APICaller(getLocationListEndPoint, 'POST', JSON.stringify(body)).then(
      json => {
        console.log(json, 'json*******************');
        const data = json.data.Response;
        let markerPin = [];
        data.map(res => {
          markerPin.push({
            id: res.ID,
            location: {latitude: res.Latitude, longitude: res.Longitude},
          });
        });
        this.setState({pins: markerPin});
        console.log('***************', markerPin);
        // { id: 'pin86',
        // location: { latitude: 43.759953662747066, longitude: 11.988450525880259 } },
      },
    );
  }

  renderCluster = (cluster, onPress) => {
    const pointCount = cluster.pointCount,
      coordinate = cluster.coordinate,
      clusterId = cluster.clusterId;

    return (
      <Marker
        identifier={`cluster-${clusterId}`}
        coordinate={coordinate}
        onPress={onPress}>
        <View style={styles.clusterContainer}>
          <Text style={styles.clusterText}>{pointCount}</Text>
        </View>
      </Marker>
    );
  };

  renderMarker = pin => {
    return (
      <Marker
        identifier={`pin-${pin.id}`}
        key={pin.id}
        coordinate={pin.location}
        // title="You can also open this callout"
        // description="by pressing on transparent area of custom callout"
      >
        <Image
          source={{
            uri:
              'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
          }}
          style={{width: 30, height: 30}}
        />
        {/* <Callout style={styles.customView}>
          <View>
            <Text>hello</Text>
          </View>
        </Callout> */}
      </Marker>
    );
  };

  reload = () => {
    this.getMarkerPoint();
  };

  loadMore = () => {
    const pins = generateRandomPoints(
      {latitude: italyCenterLatitude, longitude: italyCenterLongitude},
      radius,
      50,
      this.state.pins.length,
    );
    this.setState({pins: this.state.pins.concat(pins)});
  };

  render() {
    const INIT_REGION = {
      latitude: 41.8962667,
      longitude: 11.3340056,
      latitudeDelta: 12,
      longitudeDelta: 12,
    };
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header left="menu" title="Location" />
        {this.state.loadingData ? (
          <View style={styles.spinnerView}>
            <SpinnerView />
          </View>
        ) : null}
        <View style={styles.container}>
          <ClusteredMapView
            style={{flex: 1}}
            data={this.state.pins}
            initialRegion={INIT_REGION}
            ref={r => {
              this.map = r;
            }}
            renderMarker={this.renderMarker}
            renderCluster={this.renderCluster}
          />
        </View>
        {/* <View style={styles.controlBar}>
          <TouchableOpacity style={styles.button} onPress={() => this.reload()}>
            <Text style={styles.text}>Reload</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.loadMore()}>
            <Text style={styles.text}>Load more</Text>
          </TouchableOpacity>
        </View> */}
      </SafeAreaView>
    );
  }
}

//= =====STYLES DECLARATION======//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },

  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    top: '45%',
  },
  spinnerViewPOS: {
    position: 'absolute',
    zIndex: 1,
    top: '45%',
    left: '40%',
  },
  controlBar: {
    top: 58,
    left: 25,
    right: 25,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
});

export default ServicePackage;
