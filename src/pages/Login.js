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

import Loader from './Loader';

const LoginScreen = ({navigation}) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [retrieve, setRetrieve] = useState();

  function handleBackButtonClick() {
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
          body: formdata,
          headers: {
            //Header Defination
            Accept: 'application/json',
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
              navigation.navigate('pageStatus', {user: 'jane'});
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
        alignContent: 'center',
      },
      android: {
        flex: 1,
        justifyContent: 'center',
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
        borderRadius: 46.7,
        borderWidth: 0.8,
        borderColor: 'rgba(117, 107, 107, 0.59)',

        backgroundColor: '#f7f6f6',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
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
        borderRadius: 46.7,
        borderWidth: 0.8,
        borderColor: 'rgba(117, 107, 107, 0.59)',

        backgroundColor: '#f7f6f6',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
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
        color: '#3b3b3b',
        textAlign: 'center',
        fontWeight: 'normal',
        fontSize: 14,
        alignSelf: 'center',
        padding: 10,
        letterSpacing: 0,
      },
      android: {
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
        fontFamily: 'System',
        fontSize: 13.3,
        fontWeight: 'bold',
        fontStyle: 'normal',
        color: '#3b3b3b',
      },
      android: {
        fontFamily: 'Roboto',
        fontSize: 13.3,
        fontWeight: 'bold',
        fontStyle: 'normal',
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
