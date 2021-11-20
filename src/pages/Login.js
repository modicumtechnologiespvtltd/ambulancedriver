// // Example of Splash, Login and Sign Up in React Native
// // httpss://aboutreact.com/react-native-login-and-signup/

// // Import React and Component
// import React, {useState, createRef} from 'react';
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
// } from 'react-native';

// import AsyncStorage from '@react-native-community/async-storage';

// // import Loader from './Components/Loader';
// import Loader from './Loader';

// const LoginScreen = ({navigation}) => {
//   const [userEmail, setUserEmail] = useState('');
//   const [userPassword, setUserPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errortext, setErrortext] = useState('');

//   const passwordInputRef = createRef();

//   const handleSubmitPress = () => {
//     setErrortext('');
//     if (!userEmail) {
//       alert('Please fill Email');
//       return;
//     }
//     if (!userPassword) {
//       alert('Please fill Password');
//       return;
//     }
//     setLoading(true);
//     let dataToSend = {contactNo: userEmail, password: userPassword};
//     let formBody = [];
//     for (let key in dataToSend) {
//       let encodedKey = encodeURIComponent(key);
//       let encodedValue = encodeURIComponent(dataToSend[key]);
//       formBody.push(encodedKey + '=' + encodedValue);
//     }
//     formBody = formBody.join('&');
//     // https://localhost:3000/api/user/login
//     fetch('https://kaveriambulance.in/api/login_api.php', {
//       method: 'POST',
//       body: JSON.stringify(dataToSend),
//       headers: {
//         //Header Defination
//         // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//     })
//       .then(response => response.json())
//       .then(responseJson => {
//         //Hide Loader
//         setLoading(false);
//         console.log(responseJson);
//         // If server response message same as Data Matched
//         if (responseJson.message === 'successful') {
//           AsyncStorage.setItem('user_id', JSON.stringify(responseJson));
//           console.log(responseJson.id);
//           navigation.replace('findLocation');
//         } else {
//           setErrortext(responseJson.msg);
//           console.log('Please check your email id or password');
//         }
//       })
//       .catch(error => {
//         //Hide Loader
//         setLoading(false);
//         console.error(error);
//       });
//   };

//   return (
//     <View style={styles.mainBody}>
//       <Loader loading={loading} />
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
//                 source={require('../assets/logo.jpeg')}
//                 style={{
//                   width: '50%',
//                   height: 100,
//                   resizeMode: 'contain',
//                   margin: 30,
//                 }}
//               />
//             </View>
//             <View style={styles.SectionStyle}>
//               <TextInput
//                 style={styles.inputStyle}
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
//             <View style={styles.SectionStyle}>
//               <TextInput
//                 style={styles.inputStyle}
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
//             {errortext != '' ? (
//               <Text style={styles.errorTextStyle}>{errortext}</Text>
//             ) : null}
//             <TouchableOpacity
//               style={styles.buttonStyle}
//               activeOpacity={0.5}
//               onPress={handleSubmitPress}>
//               <Text style={styles.buttonTextStyle}>LOGIN</Text>
//             </TouchableOpacity>
//             <Text
//               style={styles.registerTextStyle}
//               onPress={() => navigation.navigate('register')}>
//               New Here ? Register
//             </Text>
//           </KeyboardAvoidingView>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };
// export default LoginScreen;

// const styles = StyleSheet.create({
//   mainBody: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: '#307ecc',
//     alignContent: 'center',
//   },
//   SectionStyle: {
//     flexDirection: 'row',
//     height: 40,
//     marginTop: 20,
//     marginLeft: 35,
//     marginRight: 35,
//     margin: 10,
//   },
//   buttonStyle: {
//     backgroundColor: '#7DE24E',
//     borderWidth: 0,
//     color: '#FFFFFF',
//     borderColor: '#7DE24E',
//     height: 40,
//     alignItems: 'center',
//     borderRadius: 30,
//     marginLeft: 35,
//     marginRight: 35,
//     marginTop: 20,
//     marginBottom: 25,
//   },
//   buttonTextStyle: {
//     color: '#FFFFFF',
//     paddingVertical: 10,
//     fontSize: 16,
//   },
//   inputStyle: {
//     flex: 1,
//     color: 'white',
//     paddingLeft: 15,
//     paddingRight: 15,
//     borderWidth: 1,
//     borderRadius: 30,
//     borderColor: '#dadae8',
//   },
//   registerTextStyle: {
//     color: '#FFFFFF',
//     textAlign: 'center',
//     fontWeight: 'bold',
//     fontSize: 14,
//     alignSelf: 'center',
//     padding: 10,
//   },
//   errorTextStyle: {
//     color: 'red',
//     textAlign: 'center',
//     fontSize: 14,
//   },
// });

// Example of Splash, Login and Sign Up in React Native
// httpss://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, createRef, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import AppDashboard from '../../AppNavigation';
import NetInfo from '@react-native-community/netinfo';

// import Loader from './Components/Loader';
import Loader from './Loader';

const LoginScreen = ({navigation}) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [retrieve, setRetrieve] = useState();

  // useEffect(() => {
  //   AsyncStorage.getItem('user_id', (err, result) => {
  //     console.log('user-details-for-redirecting', result);
  //     // this.setState({loggedInStatus: result});
  //     setRetrieve(result);
  //     // console.log(this.state.loggedInStatus);
  //     // navigation.navigate(retrieve !== null ? 'AppDashboard' : 'AppNavigation');
  //   });

  //   // const valueString = AsyncStorage.getItem('user_id');
  //   // const value = JSON.parse(valueString);
  //   // console.log('user-details-for-redirecting', value);
  //   // console.log('user-details-for-redirecting2', valueString);
  //   // const retrieveData = async () => {
  //   //   try {
  //   //     const valueString = await AsyncStorage.getItem('user_id');
  //   //     const value = JSON.parse(valueString);
  //   //     console.log('user-details-for-redirecting', value);
  //   //     console.log('user-details-for-redirecting2', valueString);
  //   //     // Other set states
  //   //     // setData(value);
  //   //   } catch (error) {
  //   //     console.log(error);
  //   //   }
  //   // };
  //   // Retrieve if has new data
  //   // if (retrieve)
  //   //   retrieveData();
  //   //   setRetrieve(false);
  //   // }
  // }, [retrieve]);

  function handleBackButtonClick() {
    // navigation.goBack();
    BackHandler.exitApp();

    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  });

  const passwordInputRef = createRef();

  const handleSubmitPress = () => {
    // navigation.navigate('landingPage');

    setErrortext('');
    if (!userEmail) {
      alert('Please fill Phone No.');
      return;
    }
    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    NetInfo.fetch().then(state => {
      // console.log("Connection type", state.type);
      // console.log("Is connected?", state.isConnected);

      if (state.isConnected === false) {
        alert('Please check Your internet connection');
      } else {
        setLoading(true);
        let dataToSend = {contactNo: userEmail, password: userPassword};
        let formBody = [];
        for (let key in dataToSend) {
          let encodedKey = encodeURIComponent(key);
          let encodedValue = encodeURIComponent(dataToSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
        let formdata = new FormData();
        formdata.append('ems_driver_contact', userEmail);
        formdata.append('ems_driver_pass', userPassword);

        fetch('https://eliteindia-ems.com/dispatchers/driverapp_login', {
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
            // setLoading(false);
            console.log(
              'responseJson =================================\n',
              responseJson,
            );
            if (responseJson.ems_driver_id === 'Failed') {
              alert('Invalid Inputs');
              setLoading(false);
            } else {
              setLoading(false);
              AsyncStorage.setItem(
                'driver_id',
                JSON.stringify(responseJson.ems_driver_id),
              );
              // AsyncStorage.setItem('driver_id', responseJson);

              // navigation.navigate('landingPage');
              navigation.navigate('pageStatus', {user: 'jane'});

              // If server response message same as Data Matched
              // if (responseJson.message === 'successful') {
              //   AsyncStorage.setItem('user_id', JSON.stringify(responseJson));
              //   console.log(responseJson.id);
              //   // navigation.replace('findLocation');
              //   // navigation.navigate('findLocation');
              //   navigation.navigate('findLocation');
              // } else {
              //   setErrortext(responseJson.msg);
              //   console.log('Please check your email id or password');
              // }
            }
          })
          .catch(error => {
            //Hide Loader
            setLoading(false);
            console.error(error);
          });
      }
    });
  };

  // console.log('retrieve != null', retrieve);

  // if (retrieve != null || retrieve != undefined) {
  //   return <AppDashboard />;
  //   // return navigation.navigate('AppDashboard');
  // } else {
  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../assets/logonew.png')}
                style={{
                  width: '80%',
                  height: 140,
                  resizeMode: 'contain',
                  margin: 10,
                }}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserEmail => setUserEmail(UserEmail)}
                placeholder="Enter Phone Number" //dummy@abc.com
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserPassword => setUserPassword(UserPassword)}
                placeholder="Enter Password" //12345
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}>{errortext}</Text>
            ) : null}
            <View style={{height: 20}}></View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                style={styles.loginButton}
                activeOpacity={0.5}
                onPress={handleSubmitPress}>
                <Text allowFontScaling={false} style={styles.loginText}>
                  LOGIN
                </Text>
              </TouchableOpacity>
            </View>
            {/* <Text
              allowFontScaling={false}
              style={styles.registerTextStyle}
              onPress={() =>
                navigation.navigate('register', {user: 'dgdrgreg'})
              }>
              New Driver ? Sign Up
            </Text> */}
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
  //  }
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    ...Platform.select({
      ios: {
        flex: 1,
        justifyContent: 'center',
        // backgroundColor: '#307ecc',
        alignContent: 'center',
      },
      android: {
        flex: 1,
        justifyContent: 'center',
        // backgroundColor: '#307ecc',
        alignContent: 'center',
      },
    }),
  },
  SectionStyle: {
    ...Platform.select({
      ios: {
        flexDirection: 'row',
        height: 50,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
      },
      android: {
        flexDirection: 'row',
        height: 50,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
      },
    }),
  },
  buttonStyle: {
    ...Platform.select({
      ios: {
        backgroundColor: '#7DE24E',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#7DE24E',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 25,
      },
      android: {
        backgroundColor: '#7DE24E',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#7DE24E',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 25,
      },
    }),
  },
  buttonTextStyle: {
    ...Platform.select({
      ios: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
      },
      android: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
      },
    }),
  },
  inputStyle: {
    ...Platform.select({
      ios: {
        flex: 1,

        color: 'gray',
        paddingLeft: 15,
        paddingRight: 15,
        // borderWidth: 0.8,
        // borderRadius: 30,
        // borderColor: '#dadae8',
        borderRadius: 46.7,
        // borderStyle: 'solid',
        borderWidth: 0.8,
        borderColor: 'rgba(117, 107, 107, 0.59)',
        // shadowOpacity: 1,
        // shadowRadius: 2,
        // shadowOffset: {
        //   height: 0,
        //   width: 0,
        // },
        // elevation: 30,
        // shadowColor: 'green',
        // shadowOffset: {
        //   width: 0,
        //   height: 0,
        // },
        // shadowOpacity: 0.12,
        // shadowRadius: 60,

        // overflow: 'hidden',
        // shadowOpacity: 1,
        // shadowRadius: 10,
        // elevation: 25,

        backgroundColor: '#f7f6f6',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        // shadowOpacity: 0.2,
        // shadowRadius: 1.41,
        // elevation: 20,
        overflow: 'hidden',
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 25,
      },
      android: {
        flex: 1,

        color: 'gray',
        paddingLeft: 15,
        paddingRight: 15,
        // borderWidth: 0.8,
        // borderRadius: 30,
        // borderColor: '#dadae8',
        borderRadius: 46.7,
        // borderStyle: 'solid',
        borderWidth: 0.8,
        borderColor: 'rgba(117, 107, 107, 0.59)',
        // shadowOpacity: 1,
        // shadowRadius: 2,
        // shadowOffset: {
        //   height: 0,
        //   width: 0,
        // },
        // elevation: 30,
        // shadowColor: 'green',
        // shadowOffset: {
        //   width: 0,
        //   height: 0,
        // },
        // shadowOpacity: 0.12,
        // shadowRadius: 60,

        // overflow: 'hidden',
        // shadowOpacity: 1,
        // shadowRadius: 10,
        // elevation: 25,

        backgroundColor: '#f7f6f6',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        // shadowOpacity: 0.2,
        // shadowRadius: 1.41,
        // elevation: 20,
        overflow: 'hidden',
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 25,
      },
    }),
  },
  registerTextStyle: {
    ...Platform.select({
      ios: {
        // color: '#FFFFFF',
        color: '#3b3b3b',
        textAlign: 'center',
        fontWeight: 'normal',
        fontSize: 14,
        alignSelf: 'center',
        padding: 10,
        letterSpacing: 0,
      },
      android: {
        // color: '#FFFFFF',
        color: '#3b3b3b',
        textAlign: 'center',
        fontWeight: 'normal',
        fontSize: 14,
        alignSelf: 'center',
        padding: 10,
        letterSpacing: 0,
      },
    }),
  },
  errorTextStyle: {
    ...Platform.select({
      ios: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
      },
      android: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
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

  textBox: {
    ...Platform.select({
      ios: {
        width: 191.3,
        height: 39.3,
        borderRadius: 46.7,
        borderStyle: 'solid',
        borderWidth: 3.3,
        borderColor: '#ffffff',
      },
      android: {
        width: 191.3,
        height: 39.3,
        borderRadius: 46.7,
        borderStyle: 'solid',
        borderWidth: 3.3,
        borderColor: '#ffffff',
      },
    }),
  },
  placeholderText: {
    ...Platform.select({
      ios: {
        width: 60,
        height: 17.3,
        opacity: 0.48,
        fontFamily: 'System',
        fontSize: 13.3,
        fontWeight: 'bold',
        fontStyle: 'normal',
        letterSpacing: 0,
        textAlign: 'left',
        color: '#3b3b3b',
      },
      android: {
        width: 60,
        height: 17.3,
        opacity: 0.48,
        fontFamily: 'Roboto',
        fontSize: 13.3,
        fontWeight: 'bold',
        fontStyle: 'normal',
        letterSpacing: 0,
        textAlign: 'left',
        color: '#3b3b3b',
      },
    }),
  },
});
