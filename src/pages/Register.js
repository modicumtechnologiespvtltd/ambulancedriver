// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';

// import Loader from './Components/Loader';
import Loader from './Loader';

const RegisterScreen = props => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

  const emailInputRef = createRef();
  const ageInputRef = createRef();
  const addressInputRef = createRef();
  const passwordInputRef = createRef();

  console.log('data from another page', props.route);

  const handleSubmitButton = () => {
    setErrortext('');
    if (!userName) {
      alert('Please fill Name');
      return;
    }
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!userAge) {
      alert('Please fill Phone Number');
      return;
    }
    if (!userAddress) {
      alert('Please fill Address');
      return;
    }
    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    //Show Loader
    setLoading(true);
    var dataToSend = {
      name: userName,
      email: userEmail,
      contactNo: userAge,
      address: userAddress,
      password: userPassword,
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    //http://localhost:3000/api/user/register
    fetch('http://kaveriambulance.in/api/registration_api.php', {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        //Header Defination
        // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        //Hide Loader
        setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.message === 'success') {
          setIsRegistraionSuccess(true);
          console.log('Registration Successful. Please Login to proceed');
        } else {
          setErrortext(responseJson.msg);
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };
  if (isRegistraionSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#f7f6f6',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../assets/png-clipart-round-green-check-mark-illustration-check-mark-bottle-material-green-tick-miscellaneous-angle-thumbnail.png')}
          style={{
            height: 100,
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
        />
        <Text allowFontScaling={false} style={styles.successTextStyle}>
          Registration Successful
        </Text>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'yellow',
          }}>
          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.5}
            onPress={() => props.navigation.navigate('home')}>
            <Text allowFontScaling={false} style={styles.loginText}>
              Login Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: '#307ecc',
        backgroundColor: '#f7f6f6',
        // height: '100%',
      }}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../assets/logo.png')}
            style={{
              width: '80%',
              height: 100,
              resizeMode: 'contain',
              margin: 30,
            }}
          />
        </View>
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={UserName => setUserName(UserName)}
              underlineColorAndroid="#f000"
              selectionColor="#000000"
              placeholder="Enter Name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                emailInputRef.current && emailInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={UserEmail => setUserEmail(UserEmail)}
              underlineColorAndroid="#f000"
              placeholder="Enter Email"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current && passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={UserAge => setUserAge(UserAge)}
              underlineColorAndroid="#f000"
              placeholder="Enter Phone Number"
              placeholderTextColor="#8b9cb5"
              keyboardType="numeric"
              ref={ageInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                addressInputRef.current && addressInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={UserPassword => setUserPassword(UserPassword)}
              underlineColorAndroid="#f000"
              placeholder="Enter Password"
              placeholderTextColor="#8b9cb5"
              ref={passwordInputRef}
              returnKeyType="next"
              secureTextEntry={true}
              onSubmitEditing={() =>
                ageInputRef.current && ageInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={UserAddress => setUserAddress(UserAddress)}
              underlineColorAndroid="#f000"
              placeholder="Enter Address"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              ref={addressInputRef}
              returnKeyType="next"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
            />
          </View>
          {errortext != '' ? (
            <Text allowFontScaling={false} style={styles.errorTextStyle}>
              {errortext}
            </Text>
          ) : null}
          <View style={{height: 20}}></View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: 'yellow',
            }}>
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.5}
              onPress={handleSubmitButton}>
              <Text allowFontScaling={false} style={styles.loginText}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 20}}></View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default RegisterScreen;

const styles = StyleSheet.create({
  SectionStyle: {
    ...Platform.select({
      ios: {
        flexDirection: 'row',
        height: 45,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
      },
      android: {
        flexDirection: 'row',
        height: 45,
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
        marginBottom: 20,
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
        marginBottom: 20,
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
  // inputStyle: {
  //   flex: 1,
  //   color: 'white',
  //   paddingLeft: 15,
  //   paddingRight: 15,
  //   borderWidth: 1,
  //   borderRadius: 30,
  //   borderColor: '#dadae8',
  // },
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

        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 30,
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

        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 30,
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
  successTextStyle: {
    ...Platform.select({
      ios: {
        color: '#000',
        textAlign: 'center',
        fontSize: 18,
        padding: 30,
      },
      android: {
        color: '#000',
        textAlign: 'center',
        fontSize: 18,
        padding: 30,
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
        shadowOpacity: 1,
        shadowRadius: 2,
        shadowOffset: {
          height: 0,
          width: 0,
        },
        elevation: 5,
      },
      android: {
        width: 148.7,
        height: 37.3,
        borderRadius: 46.7,
        backgroundColor: '#f7f6f6',
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 1,
        shadowRadius: 2,
        shadowOffset: {
          height: 0,
          width: 0,
        },
        elevation: 5,
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
