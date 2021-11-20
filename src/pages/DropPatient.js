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
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  Button,
  ActivityIndicator,
  Alert,
  Linking,
  BackHandler,
  KeyboardAwareView,
  KeyboardAvoidingView,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import Moment from 'moment';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import {TextInput} from 'react-native-paper';
// import auth from '@react-native-firebase/auth'; 🚚 react-native-google-maps-directions 🚲

import AsyncStorage from '@react-native-community/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapViewDirections from 'react-native-maps-directions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SearchBar, Header} from 'react-native-elements';
import DroppingModal from '../modal/DroppingModal';
import Loader from './Loader';
import {CommonActions, StackActions} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import MapView, {
  Marker,
  Polyline,
  Polygon,
  AnimatedRegion,
  Callout,
} from 'react-native-maps';

// import ModalDropdown from 'react-native-modal-dropdown';
// import RNPickerSelect from 'react-native-picker-select';
// import {Picker} from '@react-native-community/picker';
// import CheckBox from '@react-native-community/checkbox';

const origin = {latitude: 48.8587741, longitude: 2.2069771};
const destination = {latitude: 48.8323785, longitude: 2.3361663};
const GOOGLE_MAPS_APIKEY = 'AIzaSyBkiTO5OmFOljf7s93hl-wjoH3vLtUxW8k';
// AIzaSyBkiTO5OmFOljf7s93hl-wjoH3vLtUxW8k
// AIzaSyDfwo7C7-WLO8GU-bc6WmvqmsF8FKipzuE

const {width, height} = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;  httpss://www.youtube.com/watch?v=gkTUPOlCYqs

export default class DropPatient extends React.Component {
  constructor(props) {
    super(props);
    // this.validate = this.validate.bind(this);
    // this.onBackPress = this.onBackPress.bind(this);

    this.state = {
      search: '',
      dataSource: [],
      curLong: '',
      curLat: '',
      count: 1,
      fromLocation: '',
      toLocation: '',
      note: '',
      user: '',
      insertLoader2: false,
      user_details: {},
      book_details: {},
      booking_Status: '',
      favSport2: '',
      errortext: '',
      storeCheckedValue: [],
      checkBox: [],
      itemList: [],
      pages: 0,
      currentPage: 0,
      modalVisible: false,
      ambulance_type: '',
      driver_details: '',
      loading: false,
      latitude: 0,

      longitude: 0,
    };
  }

  // const pages = service / 10;

  // const { itemList, currentPage } = this.state;

  updateSearch = search => {
    this.setState({search});
  };

  //   componentWillMount() {
  //     BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  //   }

  onBackPress() {
    // this.props.navigation.pop(0);

    // this.props.navigation.dispatch(
    //   //   StackActions.replace('home', {
    //   //     user: 'jane',
    //   //   }),
    //   StackActions.pop(0),
    // );
    BackHandler.exitApp();
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    console.log('pickup page this is and displaying');
    this.getLocalData();

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

    if (this.state.booking_Status.ems_status == 'Reached') {
      this.setState({modalVisible: true});
    }
  }

  setModalVisible(visible, okCancel) {
    this.setState({modalVisible: visible});
    console.log('ok============cancel', okCancel);
    if (okCancel !== undefined) {
      if (okCancel === 1) {
        console.log('ok============date', this.state.date);
        this.setState({mainDate: this.state.date});
      } else {
        console.log('not set');
      }
    }

    console.log('ok============cancel', this.state.mainDate);
  }

  componentWillUnmount() {
    // Geolocation.clearWatch(this.watchID);
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if (this.state.driver_details == prevState.driver_details) {
  //     this.driverStatus();
  //   }
  // }

  getLocalData = async () => {
    this.setState({loading: true});

    try {
      const value = JSON.parse(await AsyncStorage.getItem('driver_id'));
      if (value !== null) {
        // value previously stored
        console.log('driver_details', value);
        this.setState({driver_details: value}, this.driverStatus());
      }
    } catch (e) {
      // error reading value
      console.log('user_detail_errors', e);
    }
  };

  driverStatus() {
    NetInfo.fetch().then(state => {
      // console.log("Connection type", state.type);
      // console.log("Is connected?", state.isConnected);

      if (state.isConnected === false) {
        alert(
          'Your internet connection is weak and may affect your app functionality',
        );
      } else {
        console.log(
          'his.state.driver_details ==-==-==-==',
          this.state.driver_details,
        );
        let resStatus = 0;
        // this.setState({insertLoader2: true}, () => {
        // https://kaveriambulance.in/api/location_api.php
        let formdata = new FormData();
        formdata.append('ems_driver_id', this.state.driver_details);

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
            console.log(
              'booking_Status -----===------',
              responseJson.patient_details,
            );
            this.setState({booking_Status: responseJson.patient_details});
            if (this.state.booking_Status.ems_status == 'Reached') {
              this.setState({modalVisible: true});
            } else if (this.state.booking_Status.ems_status === 'Closed') {
              this.props.navigation.navigate('landingPage');
            } else {
              console.log('errorrr');
            }
            this.setState({loading: false});

            // AsyncStorage.setItem('book_key', JSON.stringify(responseJson));
            // alert('Ambulance Booked Successfully');
            // alert(responseJson.message, 'saved');
            // Alert.alert(
            //   '',
            //   responseJson.message,
            //   'saved',
            //   [
            //     {
            //       text: 'Cancel',
            //       onPress: () => console.log('Cancel Pressed'),
            //       // style: 'cancel',
            //     },
            //     {
            //       text: 'OK',
            //       onPress: () => this.props.navigation.navigate('history'),
            //     },
            //   ],
            //   // {cancelable: true},
            // );
            // this.setState({insertLoader2: false});
          })
          .catch(error => {
            // console.error(error);
            this.setState({loading: false});
          });
        // });
      }
    });
  }

  handleAccept(driverStatus) {
    console.log('this.state.driver_id ============', this.state.driver_id);
    console.log(
      'driverData===========driverData',
      this.state.booking_Status.ems_patient_id,
    );
    NetInfo.fetch().then(state => {
      // console.log("Connection type", state.type);
      // console.log("Is connected?", state.isConnected);

      if (state.isConnected === false) {
        alert(
          'Your internet connection is weak and may affect your app functionality',
        );
      } else {
        let formdata = new FormData();

        formdata.append(
          'ems_patient_id',
          this.state.booking_Status.ems_patient_id,
        );
        formdata.append(
          'ems_driver_id',
          this.state.driver_details.ems_driver_id,
        );
        formdata.append('ems_status', driverStatus);
        // formdata.append('time', new Date());
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
            console.log(
              'driver_status_update ======== from picked up patients',
              responseJson,
            );
            this.driverStatus();
            // this.props.getResponse(true);
          })
          .catch(error => {
            //Hide Loader
            console.error(error);
          });
      }
    });
  }

  bookData = async () => {
    try {
      const value = JSON.parse(await AsyncStorage.getItem('book_key'));
      if (value !== null) {
        // value previously stored
        // console.log('book_details', value);
        this.setState({book_details: value});

        // this.booker = setInterval(() => this.submit2(), 5000);
      }
    } catch (e) {
      // error reading value
      console.log('user_detail_errors', e);
    }
  };

  mapData() {
    fetch(
      'https://www.oneqlik.in/pullData/pullDataForUser1?token=eyJfaWQiOiI1ZGYwYmQzNjcxMzI4NDVkNjU0MGY5OTkiLCJlbWFpbCI6InByYWJodS5zb2Z0d2FyZUBnbWFpbC5jb20iLCJwaG4iOiI4MDczODkxMzUzIiwiZm4iOiJQcmFiaHUgR3BzIiwibG4iOiJTb2Z0d2FyZSIsImVtYWlsX3ZlcmZpIjpmYWxzZSwicGhvbmVfdmVyZmkiOnRydWUsImlzRGVhbGVyIjpmYWxzZSwiaXNPcmdhbmlzYXRpb24iOmZhbHNlLCJvcmdhbmlzYXRpb24iOiI1OWNiYmRiZTUwOGYxNjRhYTJmZWYzZDgiLCJncm91cHMiOltdLCJhY2NvdW50IjoibXRlY2giLCJleHAiOjE2MjgwNTc4MzIsInNjaG9vbCI6Ik5BIiwic3RhdHVzIjp0cnVlLCJpc1N1cGVyQWRtaW4iOnRydWUsImlzT3BlcmF0b3IiOmZhbHNlLCJpbWFnZURvYyI6W10sImZ1ZWxfdW5pdCI6IkxJVFJFIiwicmVwb3J0X3ByZWZlcmVuY2UiOnsiZGFpbHlfcmVwb3J0Ijp7IlJzdGF0dXMiOnRydWUsIkFzdGF0dXMiOnRydWV9LCJkYXl3aXNlX3JlcG9ydCI6eyJSc3RhdHVzIjp0cnVlLCJBc3RhdHVzIjp0cnVlfSwic3BlZWRfdmFyaWF0aW9uIjp7IlJzdGF0dXMiOnRydWUsIkFzdGF0dXMiOnRydWV9LCJmdWVsX3JlcG9ydCI6eyJSc3RhdHVzIjp0cnVlLCJBc3RhdHVzIjp0cnVlfSwiaWRsZV9yZXBvcnQiOnsiUnN0YXR1cyI6dHJ1ZSwiQXN0YXR1cyI6dHJ1ZX0sImZ1ZWxfY29uc3VtcHRpb25fcmVwb3J0Ijp7IlJzdGF0dXMiOnRydWUsIkFzdGF0dXMiOnRydWV9LCJ0cmlwX3JlcG9ydCI6eyJSc3RhdHVzIjp0cnVlLCJBc3RhdHVzIjp0cnVlfSwidHJhdmVsX3BhdGhfcmVwb3J0Ijp7IlJzdGF0dXMiOnRydWUsIkFzdGF0dXMiOnRydWV9LCJzdW1tYXJ5X3JlcG9ydCI6eyJSc3RhdHVzIjp0cnVlLCJBc3RhdHVzIjp0cnVlfSwiZ2VvZmVuY2VfcmVwb3J0Ijp7IlJzdGF0dXMiOnRydWUsIkFzdGF0dXMiOnRydWV9LCJvdmVyc3BlZWRfcmVwb3J0Ijp7IlJzdGF0dXMiOnRydWUsIkFzdGF0dXMiOnRydWV9LCJyb3V0ZV92aW9sYXRpb25fcmVwb3J0Ijp7IlJzdGF0dXMiOnRydWUsIkFzdGF0dXMiOnRydWV9LCJzdG9wcGFnZV9yZXBvcnQiOnsiUnN0YXR1cyI6dHJ1ZSwiQXN0YXR1cyI6dHJ1ZX0sImlnbml0aW9uX3JlcG9ydCI6eyJSc3RhdHVzIjp0cnVlLCJBc3RhdHVzIjp0cnVlfSwiZGlzdGFuY2VfcmVwb3J0Ijp7IlJzdGF0dXMiOnRydWUsIkFzdGF0dXMiOnRydWV9LCJwb2lfcmVwb3J0Ijp7IlJzdGF0dXMiOnRydWUsIkFzdGF0dXMiOnRydWV9LCJzb3NfcmVwb3J0Ijp7IlJzdGF0dXMiOnRydWUsIkFzdGF0dXMiOnRydWV9LCJhY19yZXBvcnQiOnsiUnN0YXR1cyI6dHJ1ZSwiQXN0YXR1cyI6dHJ1ZX0sImRyaXZlcl9wZXJmb3JtYW5jZV9yZXBvcnQiOnsiUnN0YXR1cyI6dHJ1ZSwiQXN0YXR1cyI6dHJ1ZX0sInVzZXJfdHJpcF9yZXBvcnQiOnsiUnN0YXR1cyI6dHJ1ZSwiQXN0YXR1cyI6dHJ1ZX0sImFsZXJ0X3JlcG9ydCI6eyJSc3RhdHVzIjp0cnVlLCJBc3RhdHVzIjp0cnVlfX0sImRhc2hib2FyZF9jb2x1bW4iOnsiaWduaXRpb25Mb2NrIjp0cnVlLCJncHNfY29sdW1uIjp0cnVlLCJhY19jb2x1bW4iOnRydWUsInBvd2VyX2NvbHVtbiI6dHJ1ZSwiZ3NtX2NvbHVtbiI6dHJ1ZSwiaWduaXRpb25fY29sdW1uIjp0cnVlLCJleHRfdm9sdCI6dHJ1ZSwiZG9vcl9jb2x1bW4iOmZhbHNlLCJ0ZW1wX2NvbHVtbiI6ZmFsc2UsImNoYXJnaW5nX2NvbHVtbiI6ZmFsc2V9LCJsYW5ndWFnZV9jb2RlIjoiZW4iLCJkZXZpY2VfYWRkX3Blcm1pc3Npb24iOnRydWUsImN1c3RfYWRkX3Blcm1pc3Npb24iOnRydWUsImlhdCI6MTYyNzQ1MzAzMn0',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          loading: false,
          dataSource: responseJson.devices,
          //   dataSource: responseJson.root.VehicleData,
        });
        // alert(JSON.stringify(this.state.dataSource));
      })
      .catch(error => {
        console.error(error);
        this.setState({loading: false});
      });
  }

  validate(e) {
    e.preventDefault();
    console.log('fghj', e.target);
  }

  bookingStatus() {
    // console.log('booking_satatus', this.state.booking_Status);
    let resStatus = 0;
    // this.setState({insertLoader2: true}, () => {
    // https://kaveriambulance.in/api/location_api.php
    fetch('https://kaveriambulance.in/api/status_api.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // 'Content-Type': 'text/html',
      },
      body: JSON.stringify({
        userid: this.state.user_details.id,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log('booking_Status', responseJson);
        this.setState({booking_Status: responseJson});
        // AsyncStorage.setItem('book_key', JSON.stringify(responseJson));
        // alert('Ambulance Booked Successfully');
        // alert(responseJson.message, 'saved');
        // Alert.alert(
        //   '',
        //   responseJson.message,
        //   'saved',
        //   [
        //     {
        //       text: 'Cancel',
        //       onPress: () => console.log('Cancel Pressed'),
        //       // style: 'cancel',
        //     },
        //     {
        //       text: 'OK',
        //       onPress: () => this.props.navigation.navigate('history'),
        //     },
        //   ],
        //   // {cancelable: true},
        // );
        // this.setState({insertLoader2: false});
      })
      .catch(error => {
        // console.error(error);
      });
    // });
  }

  submit() {
    const {fromLocation, toLocation} = this.state;
    this.setState({errortext: ''});
    if (!fromLocation) {
      alert('Please fill from location');
      return;
    }
    if (!toLocation) {
      alert('Please fill to location');
      return;
    }
    console.log(
      'data',
      this.state.fromLocation,
      this.state.toLocation,
      this.state.note,
      this.state.user_details.id,
      this.state.storeCheckedValue,
      JSON.stringify({
        userid: this.state.user_details.id,
        name: this.state.user_details.name,
        mobile: this.state.user_details.contact_no,
        fromLocation: this.state.fromLocation,
        toLocation: this.state.toLocation,
        Notes: this.state.note,
        service: this.state.storeCheckedValue,
      }),
    );
    let resStatus = 0;
    this.setState({insertLoader2: true}, () => {
      fetch('https://kaveriambulance.in/api/booking_api.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: this.state.user_details.id,
          name: this.state.user_details.name,
          mobile: this.state.user_details.contact_no,
          fromLocation: this.state.fromLocation,
          toLocation: this.state.toLocation,
          Notes: this.state.note,
          service: this.state.storeCheckedValue,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log('responseJson', responseJson);
          AsyncStorage.setItem('book_key', JSON.stringify(responseJson));
          alert('Ambulance Booked Successfully');

          this.state.storeCheckedValue.length = 0;
          this.state.checkBox.length = 0;
          this.setState({insertLoader2: false});
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  callNumber = phone => {
    // let phone = '9591392656';
    console.log('callNumber ----> ', phone);
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`;
    } else {
      phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  };

  renderCenterComponent() {
    return (
      <View>
        <View>
          <Text style={{color: '#fff', fontSize: 20}}>Dropping</Text>
        </View>
      </View>
    );
  }

  render() {
    // this.state.user = this.props.navigation.getParam('user', 'user');
    // const user = this.props.route.params;
    const {search, dataSource} = this.state;
    const {itemList, currentPage} = this.state;
    // const startingIndex = currentPage + 4;
    // const endingIndex = startingIndex + 4;
    // const data = itemList.slice(startingIndex, endingIndex);
    // const selectedAmbu = this.props.route.getState(
    //   'ambulanceData',
    //   'ambulanceData',
    // );
    // const {user} = this.props.route.params;

    // console.log('previous page data', JSON.stringify(user));
    // console.log('previous page data', user);

    // console.log('previous page data', this.props.route.params.user);

    // if (this.state.insertLoader2) {
    //   return (
    //     <View style={styles.loader}>
    //       <ActivityIndicator size="large" color="#0c9" />
    //     </View>
    //   );
    // }
    return (
      <>
        <Loader loading={this.state.loading} />

        <Header
          leftComponent={
            // icon: 'menu',
            // color: '#000',
            // iconStyle: {color: '#000'},
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                // style={{backgroundColor: 'green'}}
                onPress={() => this.props.navigation.goBack()}>
                <MaterialIcons
                  name="arrow-back"
                  // style={styles.loginText}
                  size={25}
                />
              </TouchableOpacity>
              <View style={{width: 20}}></View>
              <View>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 20,
                    width: 100,
                    fontWeight: '800',
                    // backgroundColor: 'yellow',
                  }}>
                  Dropping
                </Text>
              </View>
            </View>
          }
          //   centerComponent={{
          //     // text: this.headerStatus(),
          //     text: 'Arrived',
          //     // this.state.booking_Status.key == 0 && 'WAITING'
          //     // this.state.booking_Status.key == 1
          //     //   ? 'TRACKING'
          //     //   : 'BOOKING',
          //     style: {
          //       color: '#fff',
          //       justifyContent: 'center',
          //       alignItems: 'center',
          //       fontSize: 22,
          //     },
          //   }}

          // centerComponent={this.renderCenterComponent()}
          // rightComponent={
          //   <View>
          //     <Image
          //       source={require('../assets/Ellipse48.png')}
          //       style={{
          //         width: 40,
          //         height: 40,
          //         borderRadius: 50,
          //         resizeMode: 'contain',
          //         // marginLeft: -5,
          //       }}
          //     />
          //   </View>
          // }
          containerStyle={{
            backgroundColor: '#eb5a34',
            justifyContent: 'space-around',
            borderBottomWidth: 0,
          }}
        />
        {/* <Header
          centerComponent={{
            text: 'Arrived',

            style: {
              color: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 22,
              backgroundColor: 'yellow',
            },
          }}
          containerStyle={{
            backgroundColor: '#eb5a34',
            justifyContent: 'space-around',
          }}
        /> */}
        <View
          style={{
            width: '100%',
            height: 40,
            backgroundColor: '#eb5a34',
            justifyContent: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '92%',
              alignSelf: 'center',
              //   backgroundColor: 'yellow',
              justifyContent: 'center',
            }}>
            <View style={{width: '80%', justifyContent: 'center'}}>
              <Text style={{color: '#fff', fontSize: 12}}>
                Fare to be Collected: Rs.{' '}
                {this.state.booking_Status.ems_pending_amt} | Time:{' '}
                {Moment(this.state.booking_Status.ems_dispatch_time).format(
                  'h:mm A',
                )}
              </Text>
            </View>
            <View style={{width: '20%', justifyContent: 'center'}}>
              {/* <Text style={{color: '#fff', fontSize: 18}}>ETA 20</Text> */}
            </View>
          </View>
        </View>
        {/* <View style={[styles.addressCard, {width: '100%', height: 90}]}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: '30%',
                borderRightWidth: 0.7,
                borderRightColor: 'gray',
              }}>
              <MaterialIcons
                name="navigation"
                size={25}
                color={'#1592e6'}
                style={{width: '65%', textAlign: 'right'}}
              />
              <Text style={{textAlign: 'center'}}>Navigate</Text>
            </View>
            <View style={{width: '70%'}}>
             
              <Text style={{marginLeft: 20}}>
                {this.state.booking_Status.ems_address}
              </Text>
            </View>
          </View>
        </View> */}

        {/* map starts */}

        {/*  */}

        <View style={styles.containerMap}>
          <MapView
            style={[styles.map, {width, height}]}
            showsUserLocation={true}
            showsMyLocationButton={true}
            zoomEnabled={true}
            // zoomControlEnabled={true}
            minZoomLevel={0}
            maxZoomLevel={20}
            // provider={PROVIDER_GOOGLE} initialR
            // tracksViewChanges={false}
            initialRegion={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.015 * 100,
              longitudeDelta: 0.0121 * 100,

              // latitude: 22.764081666666666,
              // longitude: 75.84687333333333,
              // latitudeDelta: 0.115 * 10,
              // longitudeDelta: 0.0121 * 10,

              //glb
              // latitude: 16.824103409637274,
              // longitude: 75.7212422836291,
              // latitudeDelta: 0.0522 ,
              // longitudeDelta: 0.0221,

              //cur
              // latitude: this.state.curLat,
              // longitude: this.state.curLong,
              // latitudeDelta: 0.0522,
              // longitudeDelta: 0.0221,
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
              <Callout tooltip={false} style={{padding: 30, borderRadius: 30}}>
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

        {/* mapends */}

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}>
          <View
            style={{
              position: 'absolute',
              bottom: 4,
              //   backgroundColor: 'yellow',
              width: '100%',
              alignItems: 'center',
            }}>
            <View
              style={[
                styles.addressCard,
                {marginBottom: 7, flexDirection: 'row', height: 90},
              ]}>
              {/* <Text style={{color: '#000'}}>gfghf</Text> */}
              <View style={{width: '25%'}}>
                {/* <Text style={{color: '#000'}}>gfghf</Text> */}
                <View
                  style={{
                    // backgroundColor: 'yellow',
                    // justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialIcons
                    name="person"
                    size={25}
                    color={'#000000'}
                    style={{width: '28%', textAlign: 'right'}}
                  />
                </View>
              </View>
              <View style={{width: '40%'}}>
                <Text style={{color: '#ee7e61'}}>Drop off</Text>
                <Text style={{color: '#000'}}>
                  {this.state.booking_Status.ems_patient_name}
                </Text>
              </View>
              <View style={{width: '35%'}}>
                <View
                  style={{
                    // backgroundColor: 'yellow',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {/* <View style={{width: '50%'}}>
                    <MaterialIcons
                      name="navigation"
                      size={25}
                      color={'#ee7e61'}
                      style={{width: '65%', textAlign: 'right'}}
                    />
                    <Text style={{color: '#ee7e61'}}>Navigate</Text>
                  </View>
                  <View style={{width: '50%'}}>
                    <MaterialIcons
                      name="local-phone"
                      size={25}
                      color={'#ee7e61'}
                      style={{width: '65%', textAlign: 'right'}}
                    />
                    <Text style={{color: '#ee7e61', textAlign: 'center'}}>
                      Call
                    </Text>
                  </View> */}
                </View>
                {/* <Text style={{color: '#000'}}>gfghf</Text> */}
              </View>
            </View>
            <View
              style={[
                styles.userCard,
                {marginBottom: 7, flexDirection: 'row', height: 90},
              ]}>
              <View style={{width: '25%'}}>
                {/* <Text style={{color: '#000'}}>gfghf</Text> */}
                <View
                  style={{
                    // backgroundColor: 'yellow',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name="hospital-building"
                    size={25}
                    color={'#a23512'}
                    style={{
                      width: 30,
                      height: 30,
                      textAlign: 'center',

                      backgroundColor: '#e6e6e6',
                      borderRadius: 50,
                    }}
                  />
                </View>
              </View>
              <View style={{width: '40%'}}>
                <Text style={{color: '#ee7e61'}}>Selected hospital</Text>
                <Text style={{color: '#000'}}>
                  {this.state.booking_Status.ems_destination}
                </Text>
              </View>
              <View style={{width: '35%'}}>
                <View
                  style={{
                    // backgroundColor: 'yellow',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={{width: '50%'}}>
                    <TouchableOpacity
                      onPress={() =>
                        this.callNumber(this.state.booking_Status.ems_contact)
                      }
                      style={
                        {
                          // flexDirection: 'row',
                          // justifyContent: 'flex-end',
                          // alignItems: 'flex-end',
                        }
                      }>
                      <MaterialIcons
                        name="local-phone"
                        size={25}
                        color={'#ee7e61'}
                        style={{width: '65%', textAlign: 'right'}}
                      />
                      <Text style={{color: '#ee7e61', textAlign: 'center'}}>
                        Call
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{width: '50%'}}>
                    <MaterialIcons
                      name="headset-mic"
                      size={25}
                      color={'#ee7e61'}
                      style={{width: '65%', textAlign: 'right'}}
                    />
                    <Text style={{color: '#ee7e61', textAlign: 'center'}}>
                      Support
                    </Text>
                  </View>
                </View>
                {/* <Text style={{color: '#000'}}>gfghf</Text> */}
              </View>
              {/* <Text style={{color: '#000'}}>gfghf</Text> */}
            </View>
            {/* <View style={styles.pickupButton}>
              <TouchableOpacity
                onPress={() => {
                  // this.handleModal()}
                  this.handleAccept('Reached');
                  this.setState({modalVisible: true});
                }}>
                <Text style={{color: '#d7755c'}}> Collect Fare & Drop</Text>
              </TouchableOpacity>
            </View> */}
            {this.state.booking_Status.ems_status === 'Closed' ? (
              <View style={styles.dropButton}>
                <TouchableOpacity
                  onPress={() => {
                    // this.handleModal()}
                    this.handleAccept('Drop');
                  }}>
                  <Text style={{color: '#ffffff', fontWeight: '800'}}>
                    {' '}
                    Drop off
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.pickupButton}
                onPress={() => {
                  // this.handleModal()}
                  this.handleAccept('Reached');
                  this.setState({modalVisible: true});
                }}>
                <View>
                  <Text
                    style={{color: '#d7755c', fontSize: 16, fontWeight: '800'}}>
                    {' '}
                    Collect Fare & Drop
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Modal
          //   animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          //   onRequestClose={() => {
          //     Alert.alert('Modal has been closed.');
          //     // setModalVisible(!modalVisible);
          //     this.setState({modalVisible: !this.state.modalVisible});
          //   }}
          onRequestClose={() => {
            // setModalVisible(!modalVisible);
            this.props.navigation.goBack();
          }}>
          <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
              {/* <View
                onPress={() =>
                  this.setState({modalVisible: !this.state.modalVisible})
                }
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
                }}>
                <Text>x</Text>
              </View> */}
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
                <Text style={modalStyles.fareCollection}>Fare Collection</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 150,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <Text style={modalStyles.fareText}>
                  Fare collected confirmation of RS.{' '}
                  {this.state.booking_Status.ems_pending_amt}
                </Text>
              </View>

              <TouchableOpacity
                //   style={[modalStyles.button, modalStyles.buttonClose]}
                style={[modalStyles.swipeRightToConfirmStyle]}
                onPress={() => {
                  this.handleAccept('Closed');

                  this.setState({modalVisible: !this.state.modalVisible});
                }}>
                <View>
                  <Text style={modalStyles.swipeRightToConfirm}>
                    Swipe right to confirm
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
      </>
    );
  }
}

const styles = StyleSheet.create({
  container2: {
    // backgroundColor: '#4c69a5',
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  chickenCurryCutSmall: {
    ...Platform.select({
      ios: {
        // width: 62.7,
        // height: 23.3,
        fontFamily: 'System',
        fontSize: 15,
        fontWeight: '600',
        fontStyle: 'normal',
        letterSpacing: 0.2,
        textAlign: 'center',
        color: '#00437c',
      },
      android: {
        // width: 62.7,
        // height: 23.3,
        fontFamily: 'Poppins',
        fontSize: 15,
        fontWeight: '600',
        fontStyle: 'normal',
        letterSpacing: 0.2,
        textAlign: 'center',
        color: '#00437c',
      },
    }),
  },
  boneInChunkyPiecesOfSkin: {
    ...Platform.select({
      ios: {
        // width: 62.7,
        // height: 5.3,
        fontFamily: 'System',
        fontSize: 10,
        fontWeight: '500',
        fontStyle: 'normal',
        letterSpacing: 0.1,
        textAlign: 'left',
        color: '#707070',
      },
      android: {
        // width: 62.7,
        // height: 5.3,
        fontFamily: 'Poppins',
        fontSize: 10,
        fontWeight: '500',
        fontStyle: 'normal',
        letterSpacing: 0.1,
        textAlign: 'left',
        color: '#707070',
      },
    }),
  },
  rs261: {
    ...Platform.select({
      ios: {
        // width: 17.3,
        // height: '43%',
        fontFamily: 'System',
        fontSize: 18,
        fontWeight: '900',
        fontStyle: 'normal',
        letterSpacing: 0.27,
        textAlign: 'left',
        color: '#000000',
        // backgroundColor: 'yellow',
        // justifyContent: 'center',
        // alignItems: 'center',
        // alignSelf: 'center',
        // alignContent: 'center',
      },
      android: {
        // width: 17.3,
        // height: '43%',
        fontFamily: 'Poppins',
        fontSize: 18,
        fontWeight: '900',
        fontStyle: 'normal',
        letterSpacing: 0.27,
        textAlign: 'left',
        color: '#000000',
        // backgroundColor: 'yellow',
        // justifyContent: 'center',
        // alignItems: 'center',
        // alignSelf: 'center',
        // alignContent: 'center',
      },
    }),
  },
  rectangle6: {
    ...Platform.select({
      ios: {
        width: '100%',
        // height: '43%',
        borderRadius: 10,
        backgroundColor: '#00437c',
        justifyContent: 'center',
      },
      android: {
        width: '100%',
        // height: '43%',
        borderRadius: 10,
        backgroundColor: '#00437c',
        justifyContent: 'center',
      },
    }),
  },
  add: {
    ...Platform.select({
      ios: {
        // width: 22.7,
        // height: 10,
        fontFamily: 'System',
        fontSize: 15,
        fontWeight: '900',
        fontStyle: 'normal',
        letterSpacing: 0.17,
        textAlign: 'center',
        color: '#ffffff',
        padding: 7,
      },
      android: {
        // width: 22.7,
        // height: 10,
        fontFamily: 'Poppins',
        fontSize: 15,
        fontWeight: '900',
        fontStyle: 'normal',
        letterSpacing: 0.17,
        textAlign: 'center',
        color: '#ffffff',
        padding: 7,
      },
    }),
  },
  container: {
    ...Platform.select({
      ios: {
        //  ...StyleSheet.absoluteFillObject,
        // flex: 1,
        height: hp('86%'),
        width: wp('100%'),
        // justifyContent: 'flex-end',
        // width: width,
        // height: height,
        alignItems: 'center',
        // backgroundColor: 'yellow',
        // marginBottom: 10,
        // shadowOpacity: 0.6,
        // shadowRadius: 0,
        // shadowOffset: {
        //   height: 0,
        //   width: 0,
        // },
        // elevation: 0,
      },
      android: {
        //  ...StyleSheet.absoluteFillObject,
        // flex: 1,
        height: hp('86%'),
        width: wp('100%'),
        // justifyContent: 'flex-end',
        // width: width,
        // height: height,
        alignItems: 'center',
        // backgroundColor: 'yellow',
        // marginBottom: 10,
        // shadowOpacity: 0.6,
        // shadowRadius: 0,
        // shadowOffset: {
        //   height: 0,
        //   width: 0,
        // },
        // elevation: 0,
      },
    }),
  },
  map: {
    ...Platform.select({
      ios: {
        ...StyleSheet.absoluteFillObject,
        // backgroundColor: 'green',
        // flex: 1,
        // backgroundColor: 'green',
      },
      android: {
        ...StyleSheet.absoluteFillObject,
        // backgroundColor: 'green',
        // flex: 1,
        // backgroundColor: 'green',
      },
    }),
  },
  marker: {
    ...Platform.select({
      ios: {
        marginLeft: 46,
        marginTop: 33,
        fontWeight: 'bold',
        backgroundColor: 'green',
      },
      android: {
        marginLeft: 46,
        marginTop: 33,
        fontWeight: 'bold',
        backgroundColor: 'green',
      },
    }),
  },

  loginButton: {
    ...Platform.select({
      ios: {
        width: 160,
        height: 42,
        borderRadius: 46.7,
        backgroundColor: '#25348d',
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
        width: 160,
        height: 42,
        borderRadius: 46.7,
        backgroundColor: '#25348d',
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
        fontSize: 14.5,
        fontWeight: 'bold',
        fontStyle: 'normal',
        // letterSpacing: 0,
        // textAlign: 'left',
        // justifyContent: 'center',
        // alignSelf: 'center',
        color: '#ffffff',
      },
      android: {
        // width: '100%',
        // height: 100,
        // backgroundColor: 'yellow',
        // flex: 1,
        fontFamily: 'Roboto',
        fontSize: 14.5,
        fontWeight: 'bold',
        fontStyle: 'normal',
        // letterSpacing: 0,
        // textAlign: 'left',
        // justifyContent: 'center',
        // alignSelf: 'center',
        color: '#ffffff',
      },
    }),
  },
  rectangle173: {
    ...Platform.select({
      ios: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#ebebf3',
        marginTop: 1,
        justifyContent: 'center',
        paddingLeft: 10,
      },
      android: {
        width: '100%',
        height: 50,
        borderRadius: 4,
        backgroundColor: '#ebebf3',
        marginTop: 7,
        // paddingTop: -10,
      },
    }),
  },
  pickupButton: {
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
        width: '99%',
        height: 57.3,
        // borderRadius: 15,
        borderWidth: 2,
        borderColor: '#ee7e61',
        backgroundColor: '#fcfcfc',
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 10,
        shadowRadius: 20,
        shadowOffset: {
          height: -70,
          width: 80,
        },
        elevation: 55,
      },
    }),
  },
  dropButton: {
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
        width: '100%',
        height: 47.3,
        // borderRadius: 15,
        borderWidth: 0.7,
        borderColor: '#ee7e61',
        backgroundColor: '#e5795d',
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
  userCard: {
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
        width: '90%',
        height: 37.3,
        // borderRadius: 15,
        // borderWidth: 0.7,
        // borderColor: '#ee7e61',
        backgroundColor: '#f7f6f6',
        // backgroundColor: '#fcfcfc',
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
  addressCard: {
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
        width: '90%',
        height: 37.3,
        // borderRadius: 15,
        // borderWidth: 0.7,
        // borderColor: '#ee7e61',
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
  containerMap: {
    ...Platform.select({
      ios: {
        //  ...StyleSheet.absoluteFillObject,
        // flex: 1,
        height: hp('86%'),
        width: wp('100%'),
        // justifyContent: 'flex-end',
        // width: width,
        // height: height,
        alignItems: 'center',
        // backgroundColor: 'yellow',
        // marginBottom: 10,
        // shadowOpacity: 0.6,
        // shadowRadius: 0,
        // shadowOffset: {
        //   height: 0,
        //   width: 0,
        // },
        // elevation: 0,
      },
      android: {
        //  ...StyleSheet.absoluteFillObject,
        // flex: 1,
        height: hp('64%'),
        // height: Dimensions.get('window').height,
        width: wp('100%'),
        // justifyContent: 'flex-end',
        // width: width,
        // height: height,
        alignItems: 'center',
        // backgroundColor: 'yellow',
        // marginBottom: 10,
        // shadowOpacity: 0.6,
        // shadowRadius: 0,
        // shadowOffset: {
        //   height: 0,
        //   width: 0,
        // },
        // elevation: 0,
      },
    }),
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    // paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 42,
    backgroundColor: 'rgba(217, 217, 217, 0.5)',
  },
  modalView: {
    // margin: 20,
    width: '75%',
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
  fareCollection: {
    // width: '100%',
    height: 60,
    opacity: 0.53,
    fontFamily: 'FuturaMdBT',
    fontSize: 16.7,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 60,
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
    fontSize: 20.7,
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
});
