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
import Helper from '../../utils/helper';

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
    setInterval(() => {
      this.getMarkerPoint();
    }, 90000);
  }

  componentWillUnmount() {
    clearInterval();
  }

  async getMarkerPoint() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    if (!userInfo) return;
    const body = {
      LoginType: userInfo.LoginType,
    };
    this.setState({
      loadingData: true,
    });
    APICaller(getLocationListEndPoint, 'POST', JSON.stringify(body)).then(
      json => {
        const data = json.data.Response;
        let markerPin = [];
        data.map(res => {
          markerPin.push({
            id: res.ID,
            location: {latitude: res.Latitude, longitude: res.Longitude},
          });
        });
        this.setState({pins: markerPin, loadingData: false});
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
      latitude: 21.2266,
      longitude: 72.8312,
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
        <View style={styles.controlBar}>
          <TouchableOpacity style={styles.button} onPress={() => this.reload()}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => this.loadMore()}>
            <Text style={styles.text}>Load more</Text>
          </TouchableOpacity> */}
        </View>
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
    right: 10,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  clusterContainer: {
    width: 30,
    height: 30,
    padding: 6,
    borderWidth: 1,
    borderRadius: 15,
    alignItems: 'center',
    borderColor: '#65bc46',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  clusterText: {
    fontSize: 13,
    color: '#65bc46',
    fontWeight: '500',
    textAlign: 'center',
  },
  refreshText: {
    fontWeight: 'bold',
  },
});

export default ServicePackage;
