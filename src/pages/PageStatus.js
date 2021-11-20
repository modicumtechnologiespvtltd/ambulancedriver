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
} from 'react-native';

import Geolocation from '@react-native-community/geolocation';
import {TextInput} from 'react-native-paper';
// import auth from '@react-native-firebase/auth'; 🚚 react-native-google-maps-directions 🚲

import AsyncStorage from '@react-native-community/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MapViewDirections from 'react-native-maps-directions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SearchBar, Header} from 'react-native-elements';

import DriverLandingPage from './DriverLandingPage';
import PickupPatient from './PickupPatient';
import DropPatient from './DropPatient';
import {CommonActions, StackActions} from '@react-navigation/native';
import MapView, {
  Marker,
  Polyline,
  Polygon,
  AnimatedRegion,
  Callout,
} from 'react-native-maps';

const origin = {latitude: 48.8587741, longitude: 2.2069771};
const destination = {latitude: 48.8323785, longitude: 2.3361663};
const {width, height} = Dimensions.get('window');
var id = null;

export default class PageStatus extends React.Component {
  constructor(props) {
    super(props);
    // this.validate = this.validate.bind(this);
    this.driverStatus = this.driverStatus.bind(this);

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
      driver_details: '',
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
      loading: true,
      responseData: false,
    };
  }

  // const pages = service / 10;

  // const { itemList, currentPage } = this.state;

  componentDidMount() {
    console.log('pickup page this is and displaying');
    this.getLocalData();
    this.driverStatus();
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if (this.state.driver_details != prevState.driver_details) {
  //     // this.driverStatus();
  //     this.getLocalData();
  //   }
  // }

  getLocalData2() {
    AsyncStorage.getItem('driver_id', (err, value) => {
      if (value !== null) {
        // value previously stored
        console.log('driver_details', value);
        this.setState({driver_details: value}, this.driverStatus());
        console.log('=== ---- ==', this.state.driver_details);
        // this.booker = setInterval(() => this.bookingStatus(), 2000);
      }
    });

    // } catch (e) {
    //   // error reading value
    //   console.log('user_detail_errors', e);
    // }
  }

  getLocalData = async () => {
    try {
      const value = JSON.parse(await AsyncStorage.getItem('driver_id'));
      if (value !== null) {
        // value previously stored
        console.log('driver_details', value);
        id = value;
        console.log('id === id', id);

        this.setState({driver_details: value}, this.driverStatus());
        console.log('=== ---- ==', this.state.driver_details);

        // this.booker = setInterval(() => this.bookingStatus(), 2000);
      }
    } catch (e) {
      // error reading value
      console.log('user_detail_errors', e);
    }
  };

  driverStatus() {
    console.log('his.state.driver_details ==', this.state.driver_details);
    console.log('his.state.driver_details =====', this.state.driver_details);
    console.log('his.state.id ===== id', id);

    let resStatus = 0;
    this.setState({loading: true}, () => {
      // https://kaveriambulance.in/api/location_api.php
      let formdata = new FormData();
      // formdata.append('ems_driver_id', this.state.driver_details);
      formdata.append('ems_driver_id', id);

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
            'booking_Status =--=-=-=-=-=-=-=-=-',
            responseJson.patient_details,
          );
          this.setState({
            booking_Status: responseJson.patient_details,
            loading: false,
          });
          // this.setState({loading: false});
        })
        .catch(error => {
          // console.error(error);
          this.setState({loading: false});
        });
    });
  }

  note() {
    if (
      this.state.booking_Status.ems_status == 'Dispatched' ||
      this.state.booking_Status.ems_status == 'Closed'
    ) {
      this.props.navigation.replace('landingPage');

      //   this.props.navigation.dispatch({
      //     ...CommonActions.navigate('landingPage'),
      //     // source: 'someRoutekey',
      //     // target: 'someStatekey',
      //   });

      // this.props.navigation.dispatch(
      //     StackActions.replace('landingPage', {
      //       user: 'jane',
      //     }),
      //   );
    } else if (this.state.booking_Status.ems_status == 'Accepted') {
      this.props.navigation.replace('pickupPatient');
    } else if (
      this.state.booking_Status.ems_status == 'PickedUp' ||
      this.state.booking_Status.ems_status == 'Reached'
    ) {
      this.props.navigation.replace('dropPatient');
    } else {
      // console.log('hgjhgj');
      this.props.navigation.replace('landingPage');
    }
  }

  getResponse(headerData) {
    console.log('headerData1 ====' + headerData);

    console.log('headerData ====' + JSON.parse(headerData));
    // if (JSON.parse(headerData) == true) {
    // this.getLocalData();
    // }
    this.setState({responseData: headerData}, () => {
      console.log('jhghgj', this.state.responseData);
      // this.getLocalData();
    });
    // console.log('headerData ====', headerData2);
  }

  render() {
    console.log(
      'this state driver =====',
      this.state.booking_Status.ems_status,
    );
    // const {user} = this.props.route.params;
    // console.log('this state driver ===== user: -', user);
    if (this.state.loading) {
      return (
        <View>
          <ActivityIndicator size="large" color="#0c9" />
        </View>
      );
    }
    return (
      <>
        <View>{this.note()}</View>
        {/* <View>
          <Text>hfhyfjygyg</Text>
        </View> */}
      </>
    );
    // if (
    //   this.state.booking_Status.ems_status === 'Dispatched' ||
    //   this.state.booking_Status.ems_status === 'Closed'
    // ) {
    //   return <DriverLandingPage getResponse={this.getResponse} />;
    // } else if (this.state.booking_Status.ems_status === 'Accepted') {
    //   return <PickupPatient getResponse={this.getResponse} />;
    // } else if (
    //   this.state.booking_Status.ems_status === 'PickedUp' ||
    //   this.state.booking_Status.ems_status === 'Reached'
    // ) {
    //   return <DropPatient getResponse={this.getResponse} />;
    // } else {
    //   return (
    //     <View>
    //       <Text>hgfhfjgh</Text>
    //     </View>
    //   );
    // }

    // return (
    //   <>
    //     {this.state.booking_Status.ems_status === 'Dispatched' && (
    //       <DriverLandingPage />
    //     )}
    //     {this.state.booking_Status.ems_status === 'Closed' && (
    //       <DriverLandingPage />
    //     )}
    //     {this.state.booking_Status.ems_status === 'Accepted' && (
    //       <PickupPatient />
    //     )}
    //     {this.state.booking_Status.ems_status === 'PickedUp' && <DropPatient />}
    //     {this.state.booking_Status.ems_status === 'Reached' && <DropPatient />}
    //   </>
    // );
  }
}

// functinal components ....

// Import React and Component
// import React, {useState, createRef, useEffect} from 'react';
// import {
//   StyleSheet,
//   TextInput,
//   View,
//   Text,
//   ScrollView,
//   Image,
//   Keyboard,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';

// import AsyncStorage from '@react-native-community/async-storage';
// import AppDashboard from '../../AppNavigation';

// // import Loader from './Components/Loader';
// import Loader from './Loader';

// const PageStatus = ({navigation}) => {
//   const [userEmail, setUserEmail] = useState('');
//   const [userPassword, setUserPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errortext, setErrortext] = useState('');
//   const [retrieve, setRetrieve] = useState();
//   const [driver_details, setDriverDetails] = useState();
//   const [booking_Status, setBookingStatus] = useState();

//   useEffect(() => {
//     // try {
//     //   const value = JSON.parse(await AsyncStorage.getItem('driver_id'));
//     //   if (value !== null) {
//     //     // value previously stored
//     //     console.log('driver_details', value);
//     //     setDriverDetails(value);
//     //     // this.setState({driver_details: value});
//     //     driverStatus();
//     //     // this.booker = setInterval(() => this.bookingStatus(), 2000);
//     //   }
//     // } catch (e) {
//     //   // error reading value
//     //   console.log('user_detail_errors', e);
//     // }
//     AsyncStorage.getItem('driver_id', (err, result) => {
//       console.log('user-details-for-redirecting33333333', result);

//       let value = JSON.parse(result);

//       console.log('user-details-for-redirecting2222', value);

//       if (result !== null) {
//         setDriverDetails(JSON.parse(result));
//         // driverStatus();

//         console.log('his.state.driver_details', driver_details);
//         let resStatus = 0;
//         let formdata = new FormData();
//         formdata.append('ems_driver_id', driver_details.ems_driver_id);

//         fetch('https://eliteindia-ems.com/dispatchers/driverpatientilist_app', {
//           method: 'POST',
//           body: formdata,

//           headers: {
//             Accept: 'application/json',
//             // 'Content-Type': 'application/json',
//             // 'Content-Type': 'text/html',
//           },
//           //   body: JSON.stringify({
//           //     userid: this.state.driver_details.id,
//           //   }),
//         })
//           .then(response => response.json())
//           .then(responseJson => {
//             console.log('booking_Status', responseJson);
//             setBookingStatus(responseJson.patient_details);
//             // if (
//             //   responseJson.patient_details.ems_status == 'Dispatched' ||
//             //   responseJson.patient_details.ems_status == 'Closed'
//             // ) {
//             //   navigation.navigate('landingPage');
//             // } else if (responseJson.patient_details.ems_status == 'Accepted') {
//             //   navigation.navigate('pickupPatient');
//             // } else if (
//             //   responseJson.patient_details.ems_status == 'PickedUp' ||
//             //   responseJson.patient_details.ems_status == 'Reached'
//             // ) {
//             //   navigation.navigate('dropPatient');
//             // } else {
//             //   console.log('hgjhgj');
//             // }
//             // this.setState({booking_Status: responseJson.patient_details});
//           })
//           .catch(error => {
//             console.error(error);
//           });
//       }
//       // this.setState({loggedInStatus: result});
//       //   setRetrieve(result);
//       //   getLocalData();
//       // console.log(this.state.loggedInStatus);
//       // navigation.navigate(retrieve !== null ? 'AppDashboard' : 'AppNavigation');
//     });
//     // getLocalData();
//     // const valueString = AsyncStorage.getItem('user_id');
//     // const value = JSON.parse(valueString);
//     // console.log('user-details-for-redirecting', value);
//     // console.log('user-details-for-redirecting2', valueString);
//     // const retrieveData = async () => {
//     //   try {
//     //     const valueString = await AsyncStorage.getItem('user_id');
//     //     const value = JSON.parse(valueString);
//     //     console.log('user-details-for-redirecting', value);
//     //     console.log('user-details-for-redirecting2', valueString);
//     //     // Other set states
//     //     // setData(value);
//     //   } catch (error) {
//     //     console.log(error);
//     //   }
//     // };
//     // Retrieve if has new data
//     // if (retrieve)
//     //   retrieveData();
//     //   setRetrieve(false);
//     // }
//   });

//   const getLocalData = async () => {
//     try {
//       const value = JSON.parse(await AsyncStorage.getItem('driver_id'));
//       if (value !== null) {
//         // value previously stored
//         console.log('driver_details', value);
//         setDriverDetails(value);
//         // this.setState({driver_details: value});
//         driverStatus();
//         // this.booker = setInterval(() => this.bookingStatus(), 2000);
//       }
//     } catch (e) {
//       // error reading value
//       console.log('user_detail_errors', e);
//     }
//   };

//   const driverStatus = () => {
//     console.log('his.state.driver_details', driver_details);
//     let resStatus = 0;
//     let formdata = new FormData();
//     formdata.append('ems_driver_id', driver_details.ems_driver_id);

//     fetch('https://eliteindia-ems.com/dispatchers/driverpatientilist_app', {
//       method: 'POST',
//       body: formdata,

//       headers: {
//         Accept: 'application/json',
//         // 'Content-Type': 'application/json',
//         // 'Content-Type': 'text/html',
//       },
//       //   body: JSON.stringify({
//       //     userid: this.state.driver_details.id,
//       //   }),
//     })
//       .then(response => response.json())
//       .then(responseJson => {
//         console.log('booking_Status', responseJson.patient_details);
//         setBookingStatus(responseJson.patient_details);
//         // if (
//         //   responseJson.patient_details.ems_status == 'Dispatched' ||
//         //   responseJson.patient_details.ems_status == 'Closed'
//         // ) {
//         //   navigation.navigate('landingPage');
//         // } else if (responseJson.patient_details.ems_status == 'Accepted') {
//         //   navigation.navigate('pickupPatient');
//         // } else if (
//         //   responseJson.patient_details.ems_status == 'PickedUp' ||
//         //   responseJson.patient_details.ems_status == 'Reached'
//         // ) {
//         //   navigation.navigate('dropPatient');
//         // } else {
//         //   console.log('hgjhgj');
//         // }
//         // this.setState({booking_Status: responseJson.patient_details});
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   };

//   const note = () => {
//     if (
//       booking_Status.patient_details.ems_status == 'Dispatched' ||
//       booking_Status.patient_details.ems_status == 'Closed'
//     ) {
//       navigation.navigate('landingPage');
//     } else if (booking_Status.patient_details.ems_status == 'Accepted') {
//       navigation.navigate('pickupPatient');
//     } else if (
//       booking_Status.patient_details.ems_status == 'PickedUp' ||
//       booking_Status.patient_details.ems_status == 'Reached'
//     ) {
//       navigation.navigate('dropPatient');
//     } else {
//       console.log('hgjhgj');
//     }
//   };

//   // console.log('retrieve != null', retrieve);

//   // if (retrieve != null || retrieve != undefined) {
//   //   return <AppDashboard />;
//   //   // return navigation.navigate('AppDashboard');
//   // } else {
//   return (
//     <View>
//       {note}
//       {/* <Loader loading={loading} />
//       <ScrollView
//         keyboardShouldPersistTaps="handled"
//         contentContainerStyle={{
//           flex: 1,
//           justifyContent: 'center',
//           alignContent: 'center',
//         }}>
//         <View>
//           <KeyboardAvoidingView enabled>
//             <View style={{alignItems: 'center'}}>
//               <Image
//                 source={require('../assets/logo.png')}
//                 style={{
//                   width: '50%',
//                   height: 100,
//                   resizeMode: 'contain',
//                   margin: 30,
//                 }}
//               />
//             </View>
//             <View>
//               <TextInput
//                 onChangeText={UserEmail => setUserEmail(UserEmail)}
//                 placeholder="Enter Phone Number" //dummy@abc.com
//                 placeholderTextColor="#8b9cb5"
//                 autoCapitalize="none"
//                 keyboardType="email-address"
//                 returnKeyType="next"
//                 onSubmitEditing={() =>
//                   passwordInputRef.current && passwordInputRef.current.focus()
//                 }
//                 underlineColorAndroid="#f000"
//                 blurOnSubmit={false}
//               />
//             </View>
//             <View>
//               <TextInput
//                 onChangeText={UserPassword => setUserPassword(UserPassword)}
//                 placeholder="Enter Password" //12345
//                 placeholderTextColor="#8b9cb5"
//                 keyboardType="default"
//                 ref={passwordInputRef}
//                 onSubmitEditing={Keyboard.dismiss}
//                 blurOnSubmit={false}
//                 secureTextEntry={true}
//                 underlineColorAndroid="#f000"
//                 returnKeyType="next"
//               />
//             </View>
//             {errortext != '' ? <Text>{errortext}</Text> : null}
//             <View style={{height: 20}}></View>
//             <View style={{justifyContent: 'center', alignItems: 'center'}}>
//               <TouchableOpacity activeOpacity={0.5} onPress={handleSubmitPress}>
//                 <Text allowFontScaling={false}>LOGIN</Text>
//               </TouchableOpacity>
//             </View>
//             {/* <Text
//               allowFontScaling={false}
//               style={styles.registerTextStyle}
//               onPress={() =>
//                 navigation.navigate('register', {user: 'dgdrgreg'})
//               }>
//               New Driver ? Sign Up
//             </Text>
//           </KeyboardAvoidingView>
//         </View>
//       </ScrollView> */}
//     </View>
//   );
//   //  }
// };
// export default PageStatus;

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
    height: 90,
    fontFamily: 'FuturaMdBT',
    fontSize: 16.7,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 90,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#000000',
    borderBottomWidth: 0.7,
    borderBottomColor: '#707070',
    paddingTop: 20,
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
