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
  Dimensions,
} from 'react-native';
import {Images, Color, Matrics} from '../../common/styles';
import {MIcon} from '../../common/assets/vector-icon'
import {getLocationListEndPoint, getComplaintMarkerEndpoint} from '../../config/api-endpoint';
import APICaller from '../../utils/api-caller';
import {generateRandomPoints, generateRandomPoint} from '../../generator';
import {Marker, Callout} from 'react-native-maps';
import ClusteredMapView from 'react-native-maps-super-cluster';
import {SpinnerView, Header} from '../../common/components';
import Helper from '../../utils/helper';
import Events from '../../utils/events';
import styles from './styles';
import ToastComponent from '../../common/components/toast';
import _ from 'lodash';

let self;
const italyCenterLatitude = 41.8962667,
  italyCenterLongitude = 11.3340056,
  radius = 600000;
class ServicePackage extends Component {
  state = {
    loadingData: false,
    pins: [],
    toastVisible: false,
  };

  componentDidMount() {
    self = this;
    //this.reload();
    this.getMarkerPoint();
    this.getCompalintMarkerPoint()
    setInterval(() => {
      this.getMarkerPoint();
    }, 90000);
  }

  componentWillUnmount() {
    clearInterval();
  }

  async getCompalintMarkerPoint() {
    const userInfo = await Helper.getLocalStorageItem('userInfo');
    if (!userInfo) return;

    const body = {
      LoginType: userInfo.LoginType,
    };
    this.setState({
      loadingData: true,
    });
    const userName = _.get(userInfo,'UserName','')
    APICaller(getComplaintMarkerEndpoint(userName), 'GET', JSON.stringify(body)).then(
      json => {
        const data = json.data.Response;
        console.log(data,'dataaa')
        let markerPin = [];
        data &&
          data.map(res => {
            markerPin.push({
              id: res.ComplaintID,
              location: {latitude: res.Latitude, longitude: res.Longitude},
              type:'complaint',
              complaintDesc: res.ComplaintDesc,
              companyName: res.CompanyName,
              complaintSubject: res.ComplaintSubject,
              name: res.Name,
              systemTag: res.SystemTag
            });
          });
        if (markerPin.length === 0) {
          Events.trigger('toast', 'No Data Found');
        }
        this.setState({pins: _.concat(this.state.pins ,markerPin), loadingData: false});
        // { id: 'pin86',
        // location: { latitude: 43.759953662747066, longitude: 11.988450525880259 } },
      },
    );
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
        console.log(data,'data..')
        data &&
          data.map(res => {
            markerPin.push({
              id: res.ID,
              location: {latitude: res.Latitude, longitude: res.Longitude},
              type: 'person',
              name: _.get(res,'FirstName','') + _.get(res,'LastName',''),
            });
          });
        if (markerPin.length === 0) {
          Events.trigger('toast', 'No Data Found');
        }
        this.setState({pins: _.concat(this.state.pins ,markerPin), loadingData: false});
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
        { pin.type == 'person' ? 
        <MIcon name="person-pin-circle" size={30} color={'green'} />
        :
        <MIcon name="pin-drop" size={30} color={'red'} />
        }
        {/* <Image
          source={{
            uri:
              'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
          }}
          style={{width: 30, height: 30}}
        /> */}
        
        <Callout>
        {pin.type == 'person' ?
          <View style={styles.personCalloutView}>
            <Text style={styles.pinNameText}>{pin.name}</Text>
          </View>
          : 
          <View style={styles.complaintCalloutView}>
            <Text style={styles.pinComplaint}>{pin.name} ({pin.companyName})</Text>
            <Text style={styles.complaintSub}>{pin.complaintSubject}</Text>
            <Text style={styles.complaintSub}>{pin.complaintDesc}</Text>
          </View>
          }
        </Callout>
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
    const {toastVisible,pins} = this.state;
    console.log(pins,'pinsss')
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
        <ToastComponent />
      </SafeAreaView>
    );
  }
}

export default ServicePackage;
