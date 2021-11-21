import React from 'react';
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
import Moment from 'moment';

import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import {TextInput} from 'react-native-paper';

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
import {CommonActions, StackActions} from '@react-navigation/native';
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import MapView, {
  Marker,
  Polyline,
  Polygon,
  AnimatedRegion,
  Callout,
} from 'react-native-maps';

const origin = {latitude: 48.8587741, longitude: 2.2069771};
const destination = {latitude: 48.8323785, longitude: 2.3361663};
const GOOGLE_MAPS_APIKEY = 'AIzaSyBkiTO5OmFOljf7s93hl-wjoH3vLtUxW8k';

const {width, height} = Dimensions.get('window');

const dropdown = [
  {label: 'Football', value: 'football'},
  {label: 'Baseball', value: 'baseball'},
  {label: 'Hockey', value: 'hockey'},
  {label: 'Hockey', value: 'hockey'},
  {label: 'Hockey', value: 'hockey'},
  {label: 'Hockey', value: 'hockey'},
  {label: 'Hockey', value: 'hockey'},
  {label: 'Hockey', value: 'hockey'},
  {label: 'Hockey', value: 'hockey'},
  {label: 'Hockey', value: 'hockey'},
];

const service = [
  {id: 0, serviceName: 'Oxygen Cylinder'},
  {id: 1, serviceName: 'Ventilator'},
  {id: 2, serviceName: 'Air condition'},
  {id: 3, serviceName: 'wheel chair'},
  {id: 4, serviceName: 'strecher'},
  {id: 5, serviceName: 'Doctors'},
  {id: 6, serviceName: 'Ecxtra helper'},
  {id: 7, serviceName: 'Paramedic'},
];

export default class PickupPatient extends React.Component {
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
      driver_details: {},
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
      loading: false,

      latitude: 0,
      longitude: 0,
      error: null,
      Address: null,
    };
  }

  updateSearch = search => {
    this.setState({search});
  };

  onBackPress() {
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
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  getLocalData = async () => {
    this.setState({loading: true});
    try {
      const value = JSON.parse(await AsyncStorage.getItem('driver_id'));
      if (value !== null) {
        console.log('driver_details', value);
        this.setState({driver_details: value});
        this.driverStatus();
      }
    } catch (e) {
      // error reading value
      console.log('user_detail_errors', e);
    }
  };

  driverStatus() {
    console.log('his.state.driver_details', this.state.driver_details);
    let resStatus = 0;
    NetInfo.fetch().then(state => {
      if (state.isConnected === false) {
        alert(
          'Your internet connection is weak and may affect your app functionality',
        );
      } else {
        let formdata = new FormData();
        formdata.append('ems_driver_id', this.state.driver_details);

        fetch('https://eliteindia-ems.com/dispatchers/driverpatientilist_app', {
          method: 'POST',
          body: formdata,

          headers: {
            Accept: 'application/json',
          },
        })
          .then(response => response.json())
          .then(responseJson => {
            console.log('booking_Status', responseJson.patient_details);
            this.setState({booking_Status: responseJson.patient_details});
            this.setState({loading: false});
          })
          .catch(error => {
            this.setState({loading: false});
          });
      }
    });
  }

  handleAccept() {
    console.log('this.state.driver_id ============', this.state.driver_id);
    console.log(
      'driverData===========driverData',
      this.state.booking_Status.ems_patient_id,
    );
    NetInfo.fetch().then(state => {
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
        formdata.append('ems_status', 'PickedUp');
        formdata.append('time', Moment(new Date()).format('h:mm A'));

        fetch('https://eliteindia-ems.com/dispatchers/driver_status_update', {
          method: 'POST',
          body: formdata,
          headers: {
            Accept: 'application/json',
          },
        })
          .then(response => response.json())
          .then(responseJson => {
            //Hide Loader
            console.log(
              'driver_status_update ======== from picked up patients',
              responseJson,
            );
            this.props.navigation.navigate('dropPatient');
          })
          .catch(error => {
            //Hide Loader
            console.error(error);
          });
      }
    });
  }

  callNumber = phone => {
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
      // phoneNumber = `telprompt:${phone}`;
      phoneNumber = `tel://${phone}`;
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

  redirecttomap() {
    let latitude = '40.7127753';
    let longitude = '-74.0059728';
    let label = 'New York, NY, USA';

    let url = Platform.select({
      ios: 'maps:' + latitude + ',' + longitude + '?q=' + label,
      android: 'geo:' + latitude + ',' + longitude + '?q=' + label,
    });
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        let browser_url =
          'https://www.google.de/maps/@' +
          latitude +
          ',' +
          longitude +
          '?q=' +
          label;
        return Linking.openURL(browser_url);
      }
    });
  }

  renderCenterComponent() {
    return (
      <View>
        <View>
          <Text style={{color: '#fff', fontSize: 20}}>Arrived</Text>
        </View>
      </View>
    );
  }

  render() {
    const {search, dataSource} = this.state;
    const {itemList, currentPage} = this.state;

    return (
      <>
        <Loader loading={this.state.loading} />
        <Header
          leftComponent={
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <MaterialIcons
                  name="arrow-back"
                  // style={styles.loginText}
                  size={25}
                />
              </TouchableOpacity>
              <View style={{width: 20}}></View>
              <View>
                <Text style={{color: '#fff', fontSize: 20, fontWeight: '800'}}>
                  Arrived
                </Text>
              </View>
            </View>
          }
          containerStyle={{
            backgroundColor: '#eb5a34',
            justifyContent: 'space-around',
            borderBottomWidth: 0,
          }}
        />

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
            <View style={{width: '20%', justifyContent: 'center'}}></View>
          </View>
        </View>

        {/* map starts */}

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
            }}>
            <Marker
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
              bottom: 1,
              width: '100%',
            }}>
            <View style={{}}>
              <View
                style={[
                  styles.addressCard,
                  {
                    marginBottom: 7,
                    // flexDirection: 'row',
                    height: 120,
                    width: '90%',
                    alignSelf: 'center',
                  },
                ]}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      width: '25%',
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                      }}>
                      <Image
                        source={require('../assets/Bitmap.png')}
                        style={{
                          width: 25,
                          height: 25,
                          resizeMode: 'contain',
                          // margin: 10,
                        }}
                      />
                    </View>
                  </View>
                  <View style={{width: '75%'}}>
                    <View>
                      <Text style={{color: '#ee7e61'}}>From</Text>
                      <Text style={{color: '#000'}}>
                        {this.state.booking_Status.ems_address}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: 'yellow',
                    height: 30,
                  }}></View>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      width: '25%',
                    }}>
                    <View
                      style={{
                        // backgroundColor: 'yellow',
                        // justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <MaterialCommunityIcons
                        name="hospital-building"
                        size={25}
                        color={'rgba(162, 53, 18, 0.7)'}
                        style={{
                          width: 25,
                          height: 25,
                          textAlign: 'center',
                          // opacity: 0.5,
                          // backgroundColor: '#e6e6e6',
                          // borderRadius: 50,
                        }}
                      />
                    </View>
                  </View>
                  <View style={{width: '75%'}}>
                    <View>
                      <Text style={{color: '#ee7e61'}}>To</Text>
                      <Text style={{color: '#000'}}>
                        {this.state.booking_Status.ems_destination}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/*  */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={[
                  styles.userCard,
                  {
                    marginBottom: 7,
                    flexDirection: 'row',
                    height: 90,
                    width: '90%',
                  },
                ]}>
                <View style={{width: '25%'}}>
                  <View
                    style={{
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
                  <Text style={{color: '#ee7e61'}}>Pick up</Text>
                  <Text style={{color: '#000'}}>
                    {this.state.booking_Status.ems_patient_name}
                  </Text>
                </View>
                <View style={{width: '35%'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={{width: '50%'}}>
                      <TouchableOpacity onPress={() => this.redirecttomap()}>
                        <MaterialIcons
                          name="navigation"
                          size={25}
                          color={'#ee7e61'}
                          style={{width: '65%', textAlign: 'right'}}
                        />
                        <Text style={{color: '#ee7e61'}}>Navigate</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{width: '50%'}}>
                      <TouchableOpacity
                        onPress={() =>
                          this.callNumber(this.state.booking_Status.ems_contact)
                        }
                        style={{}}>
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
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity
              //   onPress={() => alert('hello')}
              style={styles.pickupButton}
              onPress={
                () => this.handleAccept()
                // this.props.navigation.navigate('dropPatient')
              }>
              <View>
                <Text
                  style={{color: '#d7755c', fontSize: 16, fontWeight: '800'}}>
                  Patient picked up
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container2: {},
  chickenCurryCutSmall: {
    ...Platform.select({
      ios: {
        fontFamily: 'System',
        fontSize: 15,
        fontWeight: '600',
        fontStyle: 'normal',
        letterSpacing: 0.2,
        textAlign: 'center',
        color: '#00437c',
      },
      android: {
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
        fontFamily: 'System',
        fontSize: 10,
        fontWeight: '500',
        fontStyle: 'normal',
        letterSpacing: 0.1,
        textAlign: 'left',
        color: '#707070',
      },
      android: {
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
        fontFamily: 'System',
        fontSize: 18,
        fontWeight: '900',
        fontStyle: 'normal',
        letterSpacing: 0.27,
        textAlign: 'left',
        color: '#000000',
      },
      android: {
        fontFamily: 'Poppins',
        fontSize: 18,
        fontWeight: '900',
        fontStyle: 'normal',
        letterSpacing: 0.27,
        textAlign: 'left',
        color: '#000000',
      },
    }),
  },
  rectangle6: {
    ...Platform.select({
      ios: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: '#00437c',
        justifyContent: 'center',
      },
      android: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: '#00437c',
        justifyContent: 'center',
      },
    }),
  },
  add: {
    ...Platform.select({
      ios: {
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
        height: hp('86%'),
        width: wp('100%'),
        alignItems: 'center',
      },
      android: {
        //  ...StyleSheet.absoluteFillObject,
        height: hp('86%'),
        width: wp('100%'),
        alignItems: 'center',
      },
    }),
  },
  map: {
    ...Platform.select({
      ios: {
        ...StyleSheet.absoluteFillObject,
      },
      android: {
        ...StyleSheet.absoluteFillObject,
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
        fontFamily: 'System',
        fontSize: 14.5,
        fontWeight: 'bold',
        fontStyle: 'normal',
        color: '#ffffff',
      },
      android: {
        fontFamily: 'Roboto',
        fontSize: 14.5,
        fontWeight: 'bold',
        fontStyle: 'normal',
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
        width: '100%',
        height: 57.3,
        borderWidth: 2,
        borderColor: '#ee7e61',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 100,
        shadowRadius: 0,
        shadowOffset: {
          height: 0,
          width: 0,
        },
        elevation: 55,
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
        width: '100%',
        height: 37.3,
        backgroundColor: '#f7f6f6',
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 10,
        shadowRadius: 20,
        shadowOffset: {
          height: 0,
          width: 0,
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
        width: '100%',
        height: 37.3,
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

        width: wp('100%'),

        alignItems: 'center',
      },
      android: {
        //  ...StyleSheet.absoluteFillObject,
        height: hp('60%'),
        width: wp('100%'),

        alignItems: 'center',
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
