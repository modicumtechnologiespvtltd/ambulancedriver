import * as React from 'react';
import {Platform, BackHandler} from 'react-native';
import {
  NavigationContainer,
  CommonActions,
  TabActions,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {createStackNavigator} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';

import DriverLandingPage from './src/pages/DriverLandingPage';
// import FindLocation from './src/pages/FindLocation';
// import History from './src/pages/History';
// import Contact from './src/pages/Contactus';
// import Register from './src/pages/Register';
// import Logout from './src/pages/Logout';
// import Home from './src/pages/Home';
// import Logout2 from './src/pages/Logout2';
// import BookAmbulanceServices from './src/modal/BookAmbulanceServices';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import AsyncStorage from '@react-native-community/async-storage';

import Login from './src/pages/Login';
import Register from './src/pages/Register';
import PickupPatient from './src/pages/PickupPatient';
import DropPatient from './src/pages/DropPatient';
import PageStatus from './src/pages/PageStatus';

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
} from 'react-native';
import {color} from 'react-native-reanimated';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// function stackFindLocation() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="home"
//         component={FindLocation}
//         options={{headerShown: false}}

//       />
//       <Stack.Screen
//         name="book"
//         component={BookAmbulanceServices}
//         options={{title: 'Book'}}
//       />
//     </Stack.Navigator>
//   );
// }

// function stackHistory() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="history"
//         component={History}
//         options={{title: 'History'}}
//       />
//     </Stack.Navigator>
//   );
// }

// function stackBookAmbulance() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="book"
//         component={BookAmbulanceServices}
//         options={{title: 'Book'}}
//       />
//     </Stack.Navigator>
//   );
// }

// function stackContact() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="contact"
//         component={Contact}
//         options={{title: 'Contact Us'}}
//       />
//     </Stack.Navigator>
//   );
// }

// Tab Navigation

// const TabNav = ({navigation}) => {
//   return (
//     <Tab.Navigator
//       screenOptions={
//         {

//         }
//       }
//       initialRouteName="landingPage"
//       tabBarOptions={{
//         activeTintColor: '#fff',
//         inactiveTintColor: '#25348d',
//         activeBackgroundColor: '#25348d',
//         inactiveBackgroundColor: '#ffffff',
//         style: {
//           paddingBottom: 1,
//         },
//       }}

//       sceneAnimationEnabled={false}
//       activeColor="#00aea2"
//       inactiveColor="#95a5a6"
//       barStyle={{backgroundColor: 'green'}}

//     >

//       <Tab.Screen
//         name="landingPage"
//         component={Home}
//         options={{
//           tabBarLabel: 'Home',
//           tabBarIcon: ({color, size}) => (
//             <MaterialIcons name="home" size={size} color={color} />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="findLocationTab"
//         component={stackFindLocation}
//         options={{
//           tabBarLabel: 'Find Location',
//           tabBarIcon: ({color, size}) => (
//             <MaterialIcons name="location-on" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="history"
//         component={History}
//         options={{
//           tabBarLabel: 'History',
//           tabBarIcon: ({color, size}) => (
//             <MaterialIcons name="history" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="contact"
//         component={Contact}
//         options={{
//           tabBarLabel: 'Contact Us',

//           tabBarIcon: ({color, size}) => (
//             <MaterialIcons name="phone" size={size} color={color} />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="logout"
//         component={stackHistory}
//         listeners={{
//           tabPress: e => {
//             e.preventDefault();
//             console.log('khgjghj', navigation);
//             AsyncStorage.clear();
//             navigation.navigate('home');
//           },
//         }}
//         options={{
//           tabBarLabel: 'Log out',
//           tabBarIcon: ({color, size}) => (
//             <MaterialIcons name="logout" size={size} color={color} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

export default function AppNavigation() {
  return (
    // <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="register"
        component={Register}
        options={{
          title: '',
          headerStyle: {
            backgroundColor: '#f7f6f6',
            borderBottomColor: '#307ecc',
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="pageStatus"
        component={PageStatus}
        // options={{
        //   title: '',
        //   headerStyle: {
        //     backgroundColor: '#f7f6f6',
        //     borderBottomColor: '#307ecc',
        //     shadowOpacity: 0,
        //     elevation: 0,
        //   },
        //   headerTintColor: '#000',
        //   headerTitleStyle: {
        //     fontWeight: 'bold',
        //   },
        // }}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="landingPage"
        component={DriverLandingPage}
        options={{
          headerShown: false,
        }}
        // options={{
        //   title: '',
        //   headerStyle: {
        //     backgroundColor: '#f7f6f6',
        //     borderBottomColor: '#307ecc',
        //     shadowOpacity: 0,
        //     elevation: 0,
        //   },
        //   headerTintColor: '#000',
        //   headerTitleStyle: {
        //     fontWeight: 'bold',
        //   },
        // }}
      />

      <Stack.Screen
        name="pickupPatient"
        component={PickupPatient}
        // options={{
        //   title: '',
        //   headerStyle: {
        //     backgroundColor: '#f7f6f6',
        //     borderBottomColor: '#307ecc',
        //     shadowOpacity: 0,
        //     elevation: 0,
        //   },
        //   headerTintColor: '#000',
        //   headerTitleStyle: {
        //     fontWeight: 'bold',
        //   },
        // }}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="dropPatient"
        component={DropPatient}
        options={{
          headerShown: false,
        }}
      />

      {/* <Stack.Screen
        name="findLocation"
        component={TabNav}
        options={{
          headerShown: false,
        }}
      /> */}
    </Stack.Navigator>
    // {/* </NavigationContainer> */}
  );
}
