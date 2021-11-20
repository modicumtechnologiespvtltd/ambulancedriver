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
  FlatList,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
// import Tooltip from 'react-native-walkthrough-tooltip';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SearchBar, Tooltip} from 'react-native-elements';

// import {createStackNavigator} from '@react-navigation/stack';
// import LandingPage from './src/pages/LandingPage';
// import FindLocation from './src/pages/FindLocation';
// import History from './src/pages/History';
// import AppNavigation2 from './AppNavigation';

import AsyncStorage from '@react-native-community/async-storage';

// const Stack = createStackNavigator();

class TooltipCom extends React.Component {
  constructor(props) {
    super(props);
    // this.isPermitted = this.isPermitted.bind(this);
    this.state = {
      page: true,
      retrieve: '',
      latitude: 0,

      longitude: 0,

      error: null,

      Address: null,
    };
    // setTimeout(() => {
    //   this.setState({page: false});
    // }, 2000);
  }

  async componentDidMount() {
    // AsyncStorage.getItem('driver_id', (err, result) => {
    //   console.log('user-details-for-redirecting', result);
    //   this.setState({retrieve: result});
    // });
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
            console.log('json', json);

            var addressComponent = json.results[0].address_components;

            this.setState({
              Address: addressComponent,
            });

            console.log('addressComponent=====', addressComponent);
          })

          .catch(error => console.warn(error));
      },

      error => {
        // See error code charts below.

        this.setState({
          error: error.message,
        }),
          console.log(error.code, error.message);
      },

      {
        enableHighAccuracy: false,

        timeout: 10000,

        maximumAge: 100000,
      },
    );
  }

  handleSubmitPress() {
    console.log('gcghchgcfhg==============jhghgfh');
    this.props.navigation.navigate('pickupPatient');
  }

  render() {
    // console.log('aap page user', this.state.retrieve);
    // console.log('ggg', this.state.Address);

    return (
      <>
        {/* <Tooltip
          isVisible={true}
          arrowSize={{width: 20, height: 10}}
          tooltipStyle={{width: '100%', height: '30%'}}
          contentStyle={{width: '100%', height: '30%'}}
          content={
            <>
              <View style={{flexDirection: 'row'}}>
                {this.state.Address !== null ? (
                  this.state.Address.map((address, i) => (
                    <Text>{address.long_name}, </Text>
                  ))
                ) : (
                  <Text>Location not fetched </Text>
                )}
              </View>
            </>
          }
          placement="top"
          backgroundColor="rgba(0,0,0)"
          // onClose={() => this.setState({ toolTipVisible: false })}
          onClose={() => console.log('close')}
          disableShadow={true}
          allowChildInteraction={true}
          //   useReactNativeModal={false}
        >
          <MaterialIcons
            name="location-pin"
            size={65}
            color={'#d7755c'}
            style={{width: 300, height: 100, textAlign: 'center'}}
          />
        </Tooltip> */}
        <View>
          <View style={styles.tooltip}>
            <View
              style={{
                position: 'absolute',
                // right: 0,
                // top: '50%',
                bottom: -26,
                // width: 15,
                // height: 15,
                // borderRadius: 50,
                // backgroundColor: 'white',
                zIndex: 99,
              }}>
              <MaterialIcons
                name="arrow-drop-down"
                size={45}
                color={'#ffffff'}
                // color={'#d7755c'}
                // style={{width: 300, height: 100, textAlign: 'center'}}
              />
            </View>
            {this.state.Address !== null ? (
              //   this.state.Address.map((address, i) => (
              //     <Text style={{color: '#000000'}}>{address.long_name}, </Text>
              //   ))
              <View style={{height: 60}}>
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
          <View style={{marginTop: 5}}>
            <MaterialIcons
              name="location-pin"
              size={65}
              color={'#d7755c'}
              style={{width: '100%', height: 100, textAlign: 'center'}}
            />
          </View>
        </View>
      </>
    );
  }
}

export default TooltipCom;

const styles = StyleSheet.create({
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
  tooltip: {
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
        // width: 148.7,
        // height: 37.3,
        borderRadius: 15,
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
        padding: 20,
      },
    }),
  },
});
