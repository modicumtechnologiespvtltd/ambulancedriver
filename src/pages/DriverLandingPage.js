import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  Modal,
  AppState,
  Pressable,
  BackHandler,
  Dimensions,
  FlatList,
} from 'react-native';
import Moment from 'moment';

import {
  Colors,
  DebugInstructions,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import Tooltip from 'react-native-walkthrough-tooltip';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SearchBar, Header} from 'react-native-elements';
import Loader from './Loader';
import TooltipCom from '../components/TooltipCom';
import PushNotification from 'react-native-push-notification';
import Firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

import {CommonActions, StackActions} from '@react-navigation/native';

import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView, {
  Marker,
  Polyline,
  Polygon,
  AnimatedRegion,
  Callout,
} from 'react-native-maps';
import English from '../i18n/English';
import Kannada from '../i18n/English';
import SetLang from '../i18n/SetLang';
import Sound from '../assets/customSound.mpeg';

const {width, height} = Dimensions.get('window');

class DriverLandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmitPress = this.handleSubmitPress.bind(this);
    this.handleNotification = this.handleNotification.bind(this);
    // this.onBackPress = this.onBackPress.bind(this);

    this.state = {
      page: true,
      retrieve: '',
      latitude: 0,

      longitude: 0,

      error: null,

      Address: null,
      driver_id: '',
      driverData: '',
      appState: AppState.currentState,
      modalVisible: false,
      booking_Status: '',
      loading: false,

      isMapReady: false,
      checkLang: '',
    };
    // setTimeout(() => {
    //   this.setState({page: false});
    // }, 2000);
  }

  onMapLayout = () => {
    this.setState({isMapReady: true});
  };

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  //   componentWillUnmount() {}

  onBackPress() {
    console.log('driver landing page bacxk');
    BackHandler.exitApp();
  }

  handleNotification(notification) {
    console.warn(notification);

    let isBackground = notification.foreground;
    if (isBackground == true) {
      this.props.navigation.navigate('landingPage');
    }
  }
  driverStatus() {
    console.log('Connection type\njhgj\njhghj\njhfgy\ngfg');

    console.log('his.state.driver_details', this.state.driver_id);
    let resStatus = 0;
    let formdata = new FormData();
    formdata.append('ems_driver_id', this.state.driver_id);

    fetch('https://eliteindia-ems.com/dispatchers/driverpatientilist_app', {
      method: 'POST',
      body: formdata,

      headers: {
        Accept: 'application/json',
        // 'Content-Type': 'application/json',
        // 'Content-Type': 'text/html',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({driverData: responseJson});
        this.setState({booking_Status: responseJson.patient_details});
        if (responseJson.patient_details.ems_status === 'Dispatched') {
          this.setState({modalVisible: true});
        }
      })
      .catch(error => {});
  }

  async componentDidMount() {
    const {navigation} = this.props;

    this.getLocalData();

    this.setState({loading: true});
    Geocoder.init('AIzaSyBTDr4GSZAwieG5PYdiArp77UYsfhkNasY');
    Geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,

          longitude: position.coords.longitude,
        });
        console.log('hjvbhj', position);

        Geocoder.from(position.coords.latitude, position.coords.longitude)

          .then(json => {
            var addressComponent = json.results[0].address_components;

            this.setState({
              Address: addressComponent,
            });
            this.setState({loading: false});

            console.log('addressComponent=====', addressComponent);
          })

          .catch(error => console.warn(error));
      },

      error => {
        this.setState({
          error: error.message,
        }),
          this.setState({loading: false});
        console.log(error.code, error.message);
      },

      {
        enableHighAccuracy: false,

        timeout: 10000,

        maximumAge: 100000,
      },
    );

    this.popupNotification();
  }

  componentWillUnmount() {
    console.log('unmount unmount');
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  popupNotification() {
    var that = this;

    PushNotification.configure({
      onRegister: function (token) {
        console.log(
          'TOKEN:\n========================\n=================\n===============\n==============',
          token,
        );
        // this.sendToken(token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        if (notification.foreground) {
          PushNotification.localNotification({
            title: notification.title,
            message: notification.message,
            playSound: true,
            soundName: 'customsound',
            // notification.notificationType === '1' ? 'mass' : 'regular',
          });
          console.log('notification:foreground', notification);
          //   alert('hello');
        }
      },
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      default: true,
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  setAlert(notification) {
    var tha = this;

    Alert.alert(
      'Ride confirmation!!',
      notification.data.type + '\n' + notification.data.type2,
      [
        {
          text: 'OK',
          onPress: () => {
            // this.handleSubmitPress;
            // tha.handleAccept();
            // this.props.navigation.navigate('pickupPatient');
          },
        },
      ],
      {cancelable: false},
    );
  }

  handleAccept() {
    NetInfo.fetch().then(state => {
      if (state.isConnected === false) {
        alert(
          'Your internet connection is weak and may affect your app functionality',
        );
      } else {
        console.log('this.state.driver_id ============', this.state.driver_id);
        console.log('driverData===========driverData', this.state.driverData);

        let formdata = new FormData();

        formdata.append(
          'ems_patient_id',
          this.state.booking_Status.ems_patient_id,
        );
        formdata.append('ems_status', 'Accepted');
        formdata.append('time', Moment(new Date()).format('h:mm A'));

        fetch('https://eliteindia-ems.com/dispatchers/driver_status_update', {
          method: 'POST',
          // body: JSON.stringify(dataToSend),
          body: formdata,
          headers: {
            Accept: 'application/json',
          },
        })
          .then(response => response.json())
          .then(responseJson => {
            this.props.navigation.navigate('pickupPatient');
          })
          .catch(error => {
            //Hide Loader
            console.error(error);
          });
      }
    });
  }

  getLocalData = async () => {
    try {
      const value = JSON.parse(await AsyncStorage.getItem('driver_id'));
      if (value !== null) {
        // value previously stored
        console.log('driver_ details', value);
        this.setState({driver_id: value});
        this.firebaseToken();
        this.booker = setInterval(() => this.driverStatus(), 2000);
      }
    } catch (e) {
      // error reading value
      console.log('user_detail_errors', e);
    }
  };

  async firebaseToken() {
    Firebase.initializeApp(this);
    const enabled = await messaging().hasPermission();
    if (enabled) {
      messaging()
        .getToken()
        .then(fcmToken => {
          if (fcmToken) {
            console.log('fcmToken :-- ', fcmToken);
            this.sendToken(fcmToken);
          } else {
            alert("user doesn't have a device token yet");
          }
        });
    } else {
      alert('no');
    }
  }

  sendToken(token) {
    console.log('this.state.driver_id', this.state.driver_id);
    let formdata = new FormData();

    formdata.append('ems_driver_id', this.state.driver_id);
    formdata.append('token', token);

    fetch('https://eliteindia-ems.com/dispatchers/driver_token', {
      method: 'POST',
      body: formdata,
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        //Hide Loader
        console.log('responseJson for token stored', responseJson);
      })
      .catch(error => {
        //Hide Loader
        console.error(error);
      });
  }

  handleSubmitPress() {
    console.log('gcghchgcfhg==============jhghgfh');
    BackHandler.exitApp();
  }

  renderCenterComponent() {
    return (
      <View>
        <View>
          <Text style={{color: '#fff', fontSize: 16, fontWeight: '800'}}>
            Home
          </Text>
        </View>
      </View>
    );
  }

  handleLogout() {
    AsyncStorage.clear();
    this.props.navigation.navigate('home');
    // BackHandler.exitApp();
  }

  render() {
    return (
      <>
        <Header
          centerComponent={this.renderCenterComponent()}
          rightComponent={
            <View>
              {/* <Image
                source={require('../assets/Ellipse48.png')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  resizeMode: 'contain',
                  // marginLeft: -5,
                }}
                
              /> */}
              <View>
                <TouchableOpacity onPress={() => this.handleLogout()}>
                  <Text style={{color: 'white'}}>Logout</Text>
                </TouchableOpacity>
              </View>
              {/* <View style={{backgroundColor: 'green'}}>
                <TouchableOpacity onPress={() => this.lanTranslate()}>
                  <Text style={{color: 'white'}}>change lan</Text>
                </TouchableOpacity>
              </View> */}
            </View>
          }
          containerStyle={{
            backgroundColor: '#eb5a34',
            justifyContent: 'space-around',
            borderBottomWidth: 0,
            padding: 10,
            height: 90,
          }}
        />

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              width: '100%',
              // height: 520,
              // borderWidth: 0.3,
              // borderColor: 'gray',
              // backgroundColor: 'yellow',
            }}>
            <MapView
              style={[styles.map, {width, height}]}
              showsUserLocation={true}
              showsMyLocationButton={true}
              zoomEnabled={true}
              // zoomControlEnabled={true}
              minZoomLevel={0}
              maxZoomLevel={20}
              initialRegion={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.015 * 10,
                longitudeDelta: 0.0121 * 10,
              }}>
              <Marker
                //    coordinate={marker.coordinates
                //         }
                // ref={marker => { this.marker = marker.ATTRLat }}
                coordinate={{
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                }}
                // hideCallout={false}
                // title={'sdfsdfs'}
                // description={'sdfds'}
                centerOffset={{x: 0, y: 0}}>
                <Callout
                  tooltip={false}
                  style={{padding: 30, borderRadius: 30}}>
                  <View>
                    {this.state.Address !== null ? (
                      <View>
                        <FlatList
                          data={this.state.Address}
                          //   style={{height: 20}}
                          numColumns={3}
                          renderItem={({item, index}) => (
                            <Text style={{color: '#000000'}}>
                              {item.long_name}, &nbsp;
                            </Text>
                          )}
                          keyExtractor={item => item.long_name}
                        />
                      </View>
                    ) : (
                      <Text>Location not fetched </Text>
                    )}
                  </View>
                </Callout>
              </Marker>
            </MapView>
          </View>
        </View>

        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.onBackPress();
            }}>
            <View style={modalStyles.centeredView}>
              <View style={modalStyles.modalView}>
                <View
                  onPress={() =>
                    this.setState({modalVisible: !this.state.modalVisible})
                  }
                  style={{
                    position: 'absolute',
                    // right: 50,
                    top: -50,
                    // left: 50,
                    //   bottom: -26,
                    width: 85,
                    height: 85,
                    borderRadius: 50,
                    backgroundColor: 'white',
                    // backgroundColor: 'gray',
                    zIndex: 99,
                    justifyContent: 'center',
                    alignItems: 'center',

                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                  }}>
                  {/* <Text>x</Text> */}
                  <MaterialIcons
                    name="person"
                    size={55}
                    color={'#a1a1a1'}
                    style={{textAlign: 'right'}}
                  />
                </View>
                <View style={{width: '100%'}}>
                  <Text style={modalStyles.rideConfirm}>
                    Ride confirmation!!
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    // height: 150,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    // backgroundColor: 'yellow',
                  }}>
                  <View
                    style={{
                      width: '25%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {/* <Text>.</Text> */}
                    <Image
                      // source={require('../assets/Bitmap@3x.png')}
                      source={require('../assets/Bitmap.png')}
                      style={{
                        width: 25,
                        height: 25,
                        resizeMode: 'contain',
                        // margin: 10,
                      }}
                    />
                  </View>
                  <View style={{width: '75%'}}>
                    <Text style={modalStyles.ShreyasColonyBangalo}>
                      {this.state.booking_Status.ems_patient_name},&nbsp;
                      {this.state.booking_Status.ems_address},&nbsp;
                      {this.state.booking_Status.ems_landmark}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: '100%',
                    // height: 150,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    // backgroundColor: 'yellow',
                  }}>
                  <View
                    style={{
                      width: '25%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {/* <Text>.</Text> */}
                    <Image
                      // source={require('../assets/Bitmap@3x.png')}
                      source={require('../assets/Grouphome.png')}
                      style={{
                        width: 25,
                        height: 25,
                        resizeMode: 'contain',
                        // margin: 10,
                      }}
                    />
                  </View>
                  <View style={{width: '75%'}}>
                    <Text style={modalStyles.ShreyasColonyBangalo}>
                      Amount to be collected: 
                      <Text style={modalStyles.fareText}>
                        RS. {this.state.booking_Status.ems_pending_amt}
                      </Text>
                    </Text>
                    {/* <Text style={modalStyles.fareText}>ETA : 20 min</Text> */}
                  </View>
                </View>

                <TouchableOpacity
                  //   style={[modalStyles.button, modalStyles.buttonClose]}
                  style={[modalStyles.swipeRightToConfirmStyle]}
                  onPress={() => {
                    this.handleAccept();

                    this.setState({modalVisible: !this.state.modalVisible});
                  }}>
                  <View>
                    <Text style={modalStyles.swipeRightToConfirm}>
                      Click to Accept
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </>
    );
  }
}

export default DriverLandingPage;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  flashScreen3: {
    ...Platform.select({
      ios: {
        width: '100%',
        height: '100%',
      },
      android: {
        width: '100%',
        height: '100%',
      },
    }),
  },
  viewCenter: {
    ...Platform.select({
      ios: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
      android: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
    }),
  },
  loginButton: {
    ...Platform.select({
      ios: {
        width: 148.7,
        height: 37.3,
        borderRadius: 46.7,
        backgroundColor: '#f7f6f6',
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 10,
        shadowRadius: 20,
        shadowOffset: {
          height: -70,
          width: 80,
        },
        elevation: 25,
      },
      android: {
        width: 148.7,
        height: 37.3,
        borderRadius: 46.7,
        backgroundColor: '#f7f6f6',
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 10,
        shadowRadius: 20,
        shadowOffset: {
          height: -70,
          width: 80,
        },
        elevation: 25,
      },
    }),
  },
  loginText: {
    ...Platform.select({
      ios: {
        fontFamily: 'System',
        fontSize: 13.3,
        fontWeight: 'bold',
        fontStyle: 'normal',
        color: '#3b3b3b',
      },
      android: {
        fontFamily: 'Roboto',
        fontSize: 13.3,
        fontWeight: 'bold',
        fontStyle: 'normal',
        color: '#3b3b3b',
      },
    }),
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 42,
    backgroundColor: 'rgba(217, 217, 217, 0.3)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  rideConfirm: {
    height: 105,
    fontFamily: 'FuturaMdBT',
    fontSize: 16.7,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 105,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#000000',
    borderBottomWidth: 0.7,
    borderBottomColor: '#707070',
    paddingTop: 20,
  },
  fareCollection: {
    height: 100,
    opacity: 0.53,
    fontFamily: 'FuturaMdBT',
    fontSize: 16.7,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 100,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#000000',
    borderBottomWidth: 0.7,
    borderBottomColor: '#707070',
  },
  fareText: {
    fontFamily: 'FuturaMdBT',
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 28,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#000000',
  },
  swipeRightToConfirmStyle: {
    width: '100%',
    height: 52,
    backgroundColor: '#ed7151',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  swipeRightToConfirm: {
    width: '100%',
    fontFamily: 'FuturaMdBT',
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  arrowOfCoolection: {
    width: 10.7,
    height: 10.7,
    backgroundColor: '#ffffff',
  },
  ShreyasColonyBangalo: {
    fontFamily: 'FuturaMdBT',
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    color: '#636363',
  },
});
