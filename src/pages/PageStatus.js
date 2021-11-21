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
} from 'react-native';


import AsyncStorage from '@react-native-community/async-storage';

const origin = {latitude: 48.8587741, longitude: 2.2069771};
const destination = {latitude: 48.8323785, longitude: 2.3361663};
const {width, height} = Dimensions.get('window');
var id = null;

export default class PageStatus extends React.Component {
  constructor(props) {
    super(props);
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
      }
    });


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

      }
    } catch (e) {
      // error reading value
      console.log('user_detail_errors', e);
    }
  };

  driverStatus() {

    let resStatus = 0;
    this.setState({loading: true}, () => {
      let formdata = new FormData();
      formdata.append('ems_driver_id', id);

      fetch('https://eliteindia-ems.com/dispatchers/driverpatientilist_app', {
        method: 'POST',
        body: formdata,

        headers: {
          Accept: 'application/json',
        },
 
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
        })
        .catch(error => {
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

    } else if (this.state.booking_Status.ems_status == 'Accepted') {
      this.props.navigation.replace('pickupPatient');
    } else if (
      this.state.booking_Status.ems_status == 'PickedUp' ||
      this.state.booking_Status.ems_status == 'Reached'
    ) {
      this.props.navigation.replace('dropPatient');
    } else {
      this.props.navigation.replace('landingPage');
    }
  }

  getResponse(headerData) {
    console.log('headerData1 ====' + headerData);

    console.log('headerData ====' + JSON.parse(headerData));
    this.setState({responseData: headerData}, () => {
      console.log('jhghgj', this.state.responseData);
    });
  }

  render() {
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
      </>
    );
  }
