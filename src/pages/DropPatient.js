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

const origin = {latitude: 48.8587741, longitude: 2.2069771};
const destination = {latitude: 48.8323785, longitude: 2.3361663};
const GOOGLE_MAPS_APIKEY = 'AIzaSyBkiTO5OmFOljf7s93hl-wjoH3vLtUxW8k';

const {width, height} = Dimensions.get('window');

export default class DropPatient extends React.Component {
  constructor(props) {
    super(props);

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
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  getLocalData = async () => {
    this.setState({loading: true});

    try {
      const value = JSON.parse(await AsyncStorage.getItem('driver_id'));
      if (value !== null) {
        console.log('driver_details', value);
        this.setState({driver_details: value}, this.driverStatus());
      }
    } catch (e) {
      console.log('user_detail_errors', e);
    }
  };

  driverStatus() {
    NetInfo.fetch().then(state => {
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
        let formdata = new FormData();
        formdata.append('ems_driver_id', this.state.driver_details);

        fetch('https://eliteindia-ems.com/dispatchers/driverpatientilist_app', {
          method: 'POST',
          body: formdata,

          headers: {
            Accept: 'application/json',
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
          })
          .catch(error => {
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
        formdata.append('time', Moment(new Date()).format('h:mm A'));

        fetch('https://eliteindia-ems.com/dispatchers/driver_status_update', {
          method: 'POST',
          body: formdata,
          headers: {
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
        this.setState({book_details: value});
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
        });
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
    let resStatus = 0;
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
        this.setState({booking_Status: responseJson});
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
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 20,
                    width: 100,
                    fontWeight: '800',
                  }}>
                  Dropping
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

              // latitude: 22.764081666666666,
              // longitude: 75.84687333333333,
              // latitudeDelta: 0.115 * 10,
              // longitudeDelta: 0.0121 * 10,
            }}>
            <Marker
              coordinate={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
              }}
              centerOffset={{x: 0, y: 0}}>
              <Callout tooltip={false} style={{padding: 30, borderRadius: 30}}>
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
              width: '100%',
              alignItems: 'center',
            }}>
            <View
              style={[
                styles.addressCard,
                {marginBottom: 7, flexDirection: 'row', height: 90},
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
                <Text style={{color: '#ee7e61'}}>Drop off</Text>
                <Text style={{color: '#000'}}>
                  {this.state.booking_Status.ems_patient_name}
                </Text>
              </View>
              <View style={{width: '35%'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}></View>
              </View>
            </View>
            <View
              style={[
                styles.userCard,
                {marginBottom: 7, flexDirection: 'row', height: 90},
              ]}>
              <View style={{width: '25%'}}>
                <View
                  style={{
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
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
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
              </View>
            </View>
            {this.state.booking_Status.ems_status === 'Closed' ? (
              <View style={styles.dropButton}>
                <TouchableOpacity
                  onPress={() => {
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
          onRequestClose={() => {
            // setModalVisible(!modalVisible);
            this.props.navigation.goBack();
          }}>
          <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
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
            </View>
          </View>
        </Modal>
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
        height: hp('86%'),
        width: wp('100%'),
        alignItems: 'center',
      },
      android: {
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
        width: '99%',
        height: 57.3,
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
        height: hp('86%'),
        width: wp('100%'),
        alignItems: 'center',
      },
      android: {
        //  ...StyleSheet.absoluteFillObject,
        height: hp('64%'),
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
    width: '75%',
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
  fareCollection: {
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
