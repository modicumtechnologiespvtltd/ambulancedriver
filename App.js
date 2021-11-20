// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow strict-local
//  */

// import React from 'react';
// import type {Node} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// const Section = ({children, title}): Node => {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// };

// const App: () => Node = () => {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.js</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import LandingPage from './src/pages/LandingPage';
// import FindLocation from './src/pages/FindLocation';
// import History from './src/pages/History';
// import AppNavigation2 from './AppNavigation';
import AppNavigation from './AppNavigation';
import AppDashboard from './AppDashboard';
import AsyncStorage from '@react-native-community/async-storage';

// const Stack = createStackNavigator();

class App extends React.Component {
  constructor(props) {
    super(props);
    // this.isPermitted = this.isPermitted.bind(this);
    this.state = {
      page: true,
      retrieve: '',
    };
    setTimeout(() => {
      this.setState({page: false});
    }, 2000);
  }

  componentDidMount() {
    AsyncStorage.getItem('driver_id', (err, result) => {
      console.log('user-details-for-redirecting', result);
      // this.setState({loggedInStatus: result});
      this.setState({retrieve: result});
      // console.log(this.state.loggedInStatus);
      // navigation.navigate(retrieve !== null ? 'AppDashboard' : 'AppNavigation');
    });
  }

  render() {
    console.log('aap page user', this.state.retrieve);
    if (this.state.page) {
      return (
        <View style={styles.flashScreen3}>
          <View style={styles.viewCenter}>
            <>
              <Image
                source={require('./src/assets/logonew.png')}
                style={{
                  // width: 300,
                  width: '100%',
                  height: 200,
                  resizeMode: 'contain',
                  // borderRadius: 10,
                }}
              />
              {/* <Text
                style={{color: '#000000', fontSize: 22}}
                allowFontScaling={false}>
                Driver
              </Text> */}
            </>
          </View>
        </View>
      );
    } else {
      return (
        // <NavigationContainer>
        //   <Stack.Navigator>
        //     <Stack.Screen
        //       name="home"
        //       component={FindLocation}
        //       options={{headerShown: false}}
        //       // options={{
        //       //   headerStyle: {
        //       //     backgroundColor: '#1c2124',
        //       //     borderBottomColor: '#f8f6ff',
        //       //     shadowOpacity: 0,
        //       //     elevation: 0,
        //       //   },
        //       //   headerTintColor: '#fff',
        //       //   headerTitleStyle: {
        //       //     fontWeight: 'bold',
        //       //   },
        //       //   headerLeft: () => (
        //       //     <View style={{flexDirection: 'row'}}>
        //       //       <View style={{padding: 15}}>
        //       //         <TouchableOpacity
        //       //           onPress={() => {
        //       //             alert('This is a button!');
        //       //           }}>
        //       //           <Image
        //       //             source={require('./src/assets/images/icon_ionic_ios_menu.png')}
        //       //             alt="jhgj"
        //       //             style={[
        //       //               {
        //       //                 tintColor: 'white',
        //       //                 width: 21,
        //       //                 height: 16,
        //       //               },
        //       //             ]}
        //       //           />
        //       //         </TouchableOpacity>
        //       //       </View>
        //       //       <View
        //       //         style={{
        //       //           padding: 15,
        //       //           flexDirection: 'row',
        //       //         }}>
        //       //         <Image
        //       //           source={require('./src/assets/images/icon_metro_location.png')}
        //       //           alt="jhgj"
        //       //           style={[
        //       //             {
        //       //               tintColor: '#fff',
        //       //               marginTop: 3,
        //       //               width: 8,
        //       //               height: 12,
        //       //             },
        //       //           ]}
        //       //         />

        //       //         <Text style={{color: '#fff'}}>
        //       //           &nbsp; &nbsp;delivery location
        //       //         </Text>
        //       //       </View>
        //       //     </View>
        //       //   ),
        //       //   headerRight: () => (
        //       //     <View>
        //       //       <TouchableOpacity
        //       //         onPress={() => {
        //       //           alert('This is a button!');
        //       //         }}>
        //       //         <Image
        //       //           source={require('./src/assets/images/icon_awesome_shopping_bag.png')}
        //       //           alt="jhgj"
        //       //           style={[
        //       //             {
        //       //               tintColor: 'white',
        //       //               paddingRight: 40,
        //       //               paddingTop: 28,
        //       //               width: 35,
        //       //               height: 35,
        //       //             },
        //       //           ]}
        //       //         />
        //       //       </TouchableOpacity>
        //       //     </View>
        //       //   ),
        //       // }}
        //     />
        //     <Stack.Screen name="findLocation" component={FindLocation} />
        //     <Stack.Screen name="history" component={History} />
        //   </Stack.Navigator>
        // </NavigationContainer>

        <>
          <NavigationContainer>
            {this.state.retrieve !== null ? (
              <AppDashboard />
            ) : (
              <AppNavigation />
            )}
            {/* <AppNavigation2 /> */}
          </NavigationContainer>
        </>

        // <>
        //   <NavigationContainer>
        //     <AppNavigation />
        //   </NavigationContainer>
        // </>
      );
    }
  }
}

export default App;

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
        backgroundColor: '#ffffff',
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
});

// function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen
//           name=" "
//           component={FindLocation}
//           options={{
//             // headerStyle: {
//             //   backgroundColor: '#f8f6ff',
//             //   borderBottomColor: '#f8f6ff',
//             //   shadowOpacity: 0,
//             //   elevation: 0,
//             // },
//             headerTintColor: '#000',
//             headerTitleStyle: {
//               fontWeight: 'bold',
//             },
//             // headerLeft: () => (
//             //   <View style={{flexDirection: 'row'}}>
//             //     <View style={{padding: 15}}>
//             //       <TouchableOpacity
//             //         onPress={() => {
//             //           alert('This is a button!');
//             //         }}>
//             //         <Image
//             //           source={require('./src/assets/images/icon_ionic_ios_menu.png')}
//             //           alt="jhgj"
//             //           style={[
//             //             {
//             //               color: 'white',
//             //               width: 21,
//             //               height: 16,
//             //             },
//             //           ]}
//             //         />
//             //       </TouchableOpacity>
//             //     </View>
//             //     <View
//             //       style={{
//             //         padding: 15,
//             //         flexDirection: 'row',
//             //       }}>
//             //       <Image
//             //         source={require('./src/assets/images/icon_metro_location.png')}
//             //         alt="jhgj"
//             //         style={[
//             //           {
//             //             marginTop: 3,
//             //             width: 8,
//             //             height: 12,
//             //           },
//             //         ]}
//             //       />

//             //       <Text>&nbsp; &nbsp;delivery location</Text>
//             //     </View>
//             //   </View>
//             // ),
//             // headerRight: () => (
//             //   <View>
//             //     <TouchableOpacity
//             //       onPress={() => {
//             //         alert('This is a button!');
//             //       }}>
//             //       <Image
//             //         source={require('./src/assets/images/icon_awesome_shopping_bag.png')}
//             //         alt="jhgj"
//             //         style={[
//             //           {
//             //             color: 'white',
//             //             paddingRight: 40,
//             //             paddingTop: 28,
//             //             width: 35,
//             //             height: 35,
//             //           },
//             //         ]}
//             //       />
//             //     </TouchableOpacity>
//             //   </View>
//             // ),
//           }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;
