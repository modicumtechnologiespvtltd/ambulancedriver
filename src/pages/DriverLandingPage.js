import React from 'react';
// import type {Node} from 'react';
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

// import {createStackNavigator} from '@react-navigation/stack';
// import LandingPage from './src/pages/LandingPage';
// import FindLocation from './src/pages/FindLocation';
// import History from './src/pages/History';
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

// const Stack = createStackNavigator();
const {width, height} = Dimensions.get('window');

class DriverLandingPage extends React.Component {
  constructor(props) {
    super(props);
    // this.isPermitted = this.isPermitted.bind(this);
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
    // this.props.navigation.popToTop();
    // this.props.navigation.pop(0);
    // this.props.navigation.dispatch({
    //   ...CommonActions.navigate('home'),
    //   // source: 'someRoutekey',
    //   // target: 'someStatekey',
    // });
    // this.props.navigation.reset({
    //   index: 0,
    //   routes: [{name: 'home'}],
    // });
    // this.props.navigation.dispatch(
    //   StackActions.replace('home', {
    //     user: 'jane',
    //   }),
    // );
    console.log('driver landing page bacxk');
    BackHandler.exitApp();
  }

  handleNotification(notification) {
    //your logic here,
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
    // this.setState({insertLoader2: true}, () => {
    // https://kaveriambulance.in/api/location_api.php
    let formdata = new FormData();
    formdata.append('ems_driver_id', this.state.driver_id);

    // https://kaveriambulance.in/api/status_api.php
    fetch('https://eliteindia-ems.com/dispatchers/driverpatientilist_app', {
      method: 'POST',
      body: formdata,

      headers: {
        Accept: 'application/json',
        // 'Content-Type': 'application/json',
        // 'Content-Type': 'text/html',
      },
      //   body: JSON.stringify({
      //     userid: this.state.driver_details.id,
      //   }),
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(
        //   'booking_Status ------------------------------',
        //   responseJson,
        // );
        this.setState({driverData: responseJson});
        this.setState({booking_Status: responseJson.patient_details});
        if (responseJson.patient_details.ems_status === 'Dispatched') {
          this.setState({modalVisible: true});
        }
        // for (let i = 0; i < responseJson.length; i++) {
        //   if (responseJson.patient_details[i].ems_status === 'Dispatched') {
        //     console.log(
        //       'eeeeeeeeeeeeeeerrrrrrrrrrrrrrrrrrooooooooooooooorrrrrrrrrrrr = successful',
        //     );
        //     this.setState({modalVisible: true});
        //     this.setState({booking_Status: responseJson.patient_details[i]});
        //   } else {
        //     console.log(
        //       'eeeeeeeeeeeeeeerrrrrrrrrrrrrrrrrrooooooooooooooorrrrrrrrrrrr',
        //     );
        //   }
        // }

        // alert('Ambulance Booked Successfully');
        // alert(responseJson.message, 'saved');
        // this.setState({insertLoader2: false});
      })
      .catch(error => {
        // console.error(error);
      });
    // });
  }

  async componentDidMount() {
    const {navigation} = this.props;

    this.getLocalData();

    // Firebase.initializeApp(this);
    // messaging()
    //   .getToken()
    //   .then(token => {
    //     console.log('message token', token);
    //     return this.sendToken(token);
    //   });
    // AsyncStorage.getItem('driver_id', (err, result) => {
    //   console.log('user-details-for-redirecting', result);
    //   this.setState({retrieve: result});
    // });

    // this.focusListener = navigation.addListener('didFocus', () => {
    //   // this.setState({ count: 0 });
    console.log('hello', this.props);
    // });
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
          // Geocoder.from(41.89, 12.49)

          .then(json => {
            // console.log('json', json);

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
        // See error code charts below.

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

    // this.appStateSubscription = AppState.addEventListener(
    //   'change',
    //   //   messaging().onMessage(async remoteMessage => {
    //   //     Alert.alert(
    //   //       'A new EMS message arrived!',
    //   //       JSON.stringify(remoteMessage.notification.title),
    //   //       JSON.stringify(remoteMessage.notification.body),
    //   //     );
    //   //   }),
    //   nextAppState => {
    //     if (
    //       this.state.appState.match(/inactive|background/) &&
    //       nextAppState === 'active'
    //     ) {
    //       console.log('App has come to the foreground!');
    //     }
    //     this.setState({appState: nextAppState});
    //   },
    // );

    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   console.log('Message handled in the background!', remoteMessage);
    // });

    //push notification
    // PushNotification.configure({
    //   // (optional) Called when Token is generated (iOS and Android)
    //   onRegister: function (token) {
    //     console.log('TOKEN:', token);
    //     // this.sendToken(token);
    //   },

    //   // (required) Called when a remote is received or opened, or local notification is opened
    //   onNotification: function (notification) {
    //     console.log('NOTIFICATION:', notification);

    //     // alert(notification.data.type);
    //     Alert.alert(
    //       'Ride confirmation!!',
    //       notification.data.type + '\n' + notification.data.type2,
    //       [
    //         //   {
    //         //     text: 'Cancel',
    //         //     onPress: () => console.log('Cancel Pressed'),
    //         //     style: 'cancel',
    //         //   },
    //         {
    //           text: 'OK',
    //           onPress: () => {
    //             console.log('OK Pressed');
    //             this.props.navigation.navigate('pickupPatient');
    //           },
    //         },
    //       ],
    //       {cancelable: false},
    //     );
    //     // process the notification

    //     // (required) Called when a remote is received or opened, or local notification is opened
    //     // notification.finish(PushNotificationIOS.FetchResult.NoData);

    //     if (notification.foreground) {
    //       PushNotification.localNotification({
    //         title: notification.title,
    //         message: notification.message,
    //       });
    //     }
    //   },

    //   // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    //   onAction: function (notification) {
    //     console.log('ACTION:', notification.action);
    //     console.log('NOTIFICATION:', notification);

    //     // process the action
    //   },

    //   // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    //   onRegistrationError: function (err) {
    //     console.error(err.message, err);
    //   },

    //   // IOS ONLY (optional): default: all - Permissions to register.
    //   permissions: {
    //     alert: true,
    //     badge: true,
    //     sound: true,
    //   },

    //   // Should the initial notification be popped automatically
    //   // default: true
    //   popInitialNotification: true,

    //   /**
    //    * (optional) default: true
    //    * - Specified if permissions (ios) and token (android and ios) will requested or not,
    //    * - if not, you must call PushNotificationsHandler.requestPermissions() later
    //    * - if you are not using remote notification or do not have Firebase installed, use this:
    //    *     requestPermissions: Platform.OS === 'ios'
    //    */
    //   requestPermissions: true,
    // });
  }

  componentWillUnmount() {
    console.log('unmount unmount');
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);

    // this.appStateSubscription.remove();
  }

  popupNotification() {
    var that = this;

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
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
        // that.handleNotification(notification);

        // that.setAlert(notification);
        // alert(notification.data.type);
        // Alert.alert(
        //   'Ride confirmation!!',
        //   notification.data.type + '\n' + notification.data.type2,
        //   [
        //     //   {
        //     //     text: 'Cancel',
        //     //     onPress: () => console.log('Cancel Pressed'),
        //     //     style: 'cancel',
        //     //   },
        //     {
        //       text: 'OK',
        //       onPress: () => {
        //         console.log('OK Pressed');
        //         // this.handleSubmitPress;
        //         this.props.navigation.navigate('pickupPatient');
        //       },
        //     },
        //   ],
        //   {cancelable: false},
        // );
        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        // notification.finish(PushNotificationIOS.FetchResult.NoData);

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

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: Sound,
      default: true,
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  }

  setAlert(notification) {
    var tha = this;

    // console.log('driverData===========driverData', this.state.driverData);
    Alert.alert(
      'Ride confirmation!!',
      notification.data.type + '\n' + notification.data.type2,
      [
        //   {
        //     text: 'Cancel',
        //     onPress: () => console.log('Cancel Pressed'),
        //     style: 'cancel',
        //   },
        {
          text: 'OK',
          onPress: () => {
            console.log('OK Pressed');
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
      // console.log("Connection type", state.type);
      // console.log("Is connected?", state.isConnected);

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
            //Header Defination
            // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            Accept: 'application/json',
            // 'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(responseJson => {
            //Hide Loader
            // console.log('driver_status_update', responseJson);
            this.props.navigation.navigate('pickupPatient');
            // this.props.getResponse(true);
          })
          .catch(error => {
            //Hide Loader
            console.error(error);
          });
      }
    });
  }

  //   componentDidUpdate(prevProps, prevState, snapshot) {
  //     if (this.state.driver_details == prevState.driver_details) {
  //       //   this.driverStatus();
  //       this.booker = setInterval(() => this.driverStatus(), 1000);
  //     }
  //   }

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
    // messaging()
    //   .getToken()
    //   .then(token => {
    //     console.log('message token', token);
    //     return this.sendToken(token);
    //   });
  }

  sendToken(token) {
    console.log('this.state.driver_id', this.state.driver_id);
    let formdata = new FormData();

    formdata.append('ems_driver_id', this.state.driver_id);
    formdata.append('token', token);

    fetch('https://eliteindia-ems.com/dispatchers/driver_token', {
      method: 'POST',
      // body: JSON.stringify(dataToSend),
      body: formdata,
      headers: {
        //Header Defination
        // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
        // 'Content-Type': 'application/json',
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
    // this.props.navigation.navigate('pickupPatient');
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

  // lanTranslate() {
  //   console.log('---', SetLang);
  //   this.setState({checkLang: 'Kannada'});
  //   // AsyncStorage.setItem(
  //   //   'ln',
  //   //   JSON.stringify(),
  //   // );
  // }

  render() {
    // console.log('aap page user', this.state.retrieve);
    // console.log('ggg', this.state.Address);

    return (
      <>
        <Header
          // leftComponent={
          //   // icon: 'menu',
          //   // color: '#000',
          //   // iconStyle: {color: '#000'},
          //   <View>
          //     <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          //       <MaterialIcons
          //         name="arrow-back"
          //         // style={styles.loginText}
          //         style={{color: 'white'}}
          //         size={25}
          //       />
          //     </TouchableOpacity>
          //   </View>
          // }

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
              }}
              // onMapReady={this.onMapLayout}
              // provider={PROVIDER_GOOGLE}
              // loadingIndicatorColor="#e21d1d"
              // ref={map => (this.map = map)}
              // style={{
              //   width,
              //   height,
              // }}
              // loadingEnabled={true}
            >
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
                {/* <View >
                  <View>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}>
                      kgjgjgj hjgjh
                    </Text>
                    <Text>jhgjhg hghjg uhujk</Text>
                  </View>
                </View> */}
                <Callout
                  tooltip={false}
                  style={{padding: 30, borderRadius: 30}}>
                  <View>
                    {this.state.Address !== null ? (
                      //   this.state.Address.map((address, i) => (
                      //     <Text style={{color: '#000000'}}>{address.long_name}, </Text>
                      //   ))
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
          {/* <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                width: '100%',
                // height: 520,
                // borderWidth: 0.3,
                // borderColor: 'gray',
                // backgroundColor: 'yellow',
              }}>
              <MapView
                style={[styles.map, {width, height, marginBottom: 20}]}
                showsUserLocation={true}
                showsMyLocationButton={true}
                zoomEnabled={true}
                zoomControlEnabled={true}
                minZoomLevel={0}
                maxZoomLevel={20}
                initialRegion={{
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                  latitudeDelta: 0.015 * 80,
                  longitudeDelta: 0.0121 * 80,
                }}
                // onMapReady={this.onMapLayout}
                // provider={PROVIDER_GOOGLE}
                // loadingIndicatorColor="#e21d1d"
                // ref={map => (this.map = map)}
                // style={{
                //   width,
                //   height,
                // }}
                // loadingEnabled={true}
              >
                <Marker
                //    coordinate={marker.coordinates
                //         }
                // ref={marker => { this.marker = marker.ATTRLat }}
                coordinate={{
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                }}
                title={'sdfsdfs'}
                description={'sdfds'}
                // centerOffset={{x: 0, y: 0}}
              >
               
                <Callout>
                  <View>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}>
                      kgjgjgj hjgjh
                    </Text>
                    <Text>jhgjhg hghjg uhujk</Text>
                  </View>
                </Callout>
              </Marker>
              </MapView>
            </View>
          </View> */}
          {/* <View style={styles.flashScreen3}>
            <View style={styles.viewCenter}>
              <Loader loading={this.state.loading} />

              <TooltipCom />
              
            </View>
          </View> */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            //   onRequestClose={() => {
            //     Alert.alert('Modal has been closed.');
            //     // setModalVisible(!modalVisible);
            //     this.setState({modalVisible: !this.state.modalVisible});
            //   }}
            onRequestClose={() => {
              // setModalVisible(!modalVisible);
              // this.props.navigation.goBack();
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
                {/* <Pressable
                style={{
                  position: 'absolute',
                  right: -10,
                  top: -10,
                  //   bottom: -26,
                  width: 25,
                  height: 25,
                  borderRadius: 50,
                  backgroundColor: 'gray',
                  zIndex: 99,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() =>
                  this.setState({modalVisible: !this.state.modalVisible})
                }>
                <Text>x</Text>
              </Pressable> */}
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
                    {/* <Text style={modalStyles.ShreyasColonyBangalo}>
                      Amount to be collected: 
                      <Text style={modalStyles.fareText}>
                        RS. {this.state.booking_Status.ems_total_amt}
                      </Text>
                    </Text> */}
                    {/* <Text style={modalStyles.fareText}>ETA : 20 min</Text> */}
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

                {/* <Text style={modalStyles.modalText}>Hello World!</Text> */}
                {/* <Pressable
                style={[modalStyles.button, modalStyles.buttonClose]}
                onPress={() =>
                  this.setState({modalVisible: !this.state.modalVisible})
                }>
                <Text style={modalStyles.textStyle}>Hide Modal</Text>
              </Pressable> */}
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
        // backgroundColor: '#1e385d',
      },
      android: {
        width: '100%',
        height: '100%',
        // backgroundColor: '#1e385d',
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
        // width: '100%',
        // height: 100,
        // backgroundColor: 'yellow',
        // flex: 1,
        fontFamily: 'System',
        fontSize: 13.3,
        fontWeight: 'bold',
        fontStyle: 'normal',
        // letterSpacing: 0,
        // textAlign: 'left',
        // justifyContent: 'center',
        // alignSelf: 'center',
        color: '#3b3b3b',
      },
      android: {
        // width: '100%',
        // height: 100,
        // backgroundColor: 'yellow',
        // flex: 1,
        fontFamily: 'Roboto',
        fontSize: 13.3,
        fontWeight: 'bold',
        fontStyle: 'normal',
        // letterSpacing: 0,
        // textAlign: 'left',
        // justifyContent: 'center',
        // alignSelf: 'center',
        color: '#3b3b3b',
      },
    }),
  },
});

// import React, {Component} from 'react';

// import {StyleSheet, Text, View} from 'react-native';

// import Geocoder from 'react-native-geocoding';

// // import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';

// export default class LocationDemo extends Component {
//   constructor() {
//     super();

//     this.state = {
//       latitude: 0,

//       longitude: 0,

//       error: null,

//       Address: null,
//     };
//   }

//   async componentDidMount() {
//     Geocoder.init('AIzaSyBTDr4GSZAwieG5PYdiArp77UYsfhkNasY');
//     Geolocation.getCurrentPosition(
//       position => {
//         this.setState({
//           latitude: position.coords.latitude,

//           longitude: position.coords.longitude,
//         });
//         console.log('hjvbhj', position);

//         Geocoder.from(position.coords.latitude, position.coords.longitude)
//           // Geocoder.from(41.89, 12.49)

//           .then(json => {
//             console.log('json', json);

//             var addressComponent = json.results[0].address_components;

//             this.setState({
//               Address: addressComponent,
//             });

//             console.log('addressComponent=====', addressComponent);
//           })

//           .catch(error => console.warn(error));
//       },

//       error => {
//         // See error code charts below.

//         this.setState({
//           error: error.message,
//         }),
//           console.log(error.code, error.message);
//       },

//       {
//         enableHighAccuracy: false,

//         timeout: 10000,

//         maximumAge: 100000,
//       },
//     );
//   }

//   render() {
//     return (
//       <View>
//         {this.state.error ? (
//           <Text> Error : {this.state.error} </Text>
//         ) : (
//           <Text>hjgj</Text>
//         )}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   MainContainer: {
//     flex: 1,

//     justifyContent: 'center',

//     backgroundColor: '#f5fcff',

//     padding: 11,
//   },

//   text: {
//     fontSize: 22,

//     color: '#000',

//     textAlign: 'center',

//     marginBottom: 10,
//   },
// });

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 42,
    backgroundColor: 'rgba(217, 217, 217, 0.3)',
  },
  modalView: {
    // margin: 20,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    // padding: 15,
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
    // padding: 10,
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
    // width: 97.3,
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
    // marginBottom: 40,
  },
  fareCollection: {
    // width: '100%',
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
    // width: '100%',
    // height: 100,
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
    // height: 52,
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
    // width: 112,
    // height: 11.3,
    fontFamily: 'FuturaMdBT',
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    // textAlign: 'center',
    color: '#636363',
  },
});
