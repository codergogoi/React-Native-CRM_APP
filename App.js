import React, {Component} from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Provider } from 'react-redux';
import store  from './src/store/Stores';

import AppNavigator from './src/components/appNavigation/AppNavigation';
import { Notifications } from 'expo';

import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { TrackUpdate } from './src/store/actions/UserActions';
import { BASE_URL, PRINT, EMP_ID } from './src/store/actions/AppConst';

const BG_TASK_NAME = "BG_TASK_NAME";

 
export default class App extends Component {

  constructor(props){
    super(props)
    this.state = {
        location: '',
        notification: {},

    }

     
  }
  
  async componentDidMount() {

    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
 
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
      } else {
      this._getLocationAsync();
    }
 
    async function registerForPushNotificationsAsync() {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
    
      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
    
      // Stop here if the user did not grant permissions
      if (finalStatus !== 'granted') {
        return;
      }
    
      // Get the token that uniquely identifies this device
      let token = await Notifications.getExpoPushTokenAsync();
    
      // POST the token to your backend server from where you can retrieve it to send push notifications.
      return fetch(PUSH_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          user: 29,
        }),
      });
    }


    this._notificationSubscription = Notifications.addListener(this._handleNotification);

    this.timer = setInterval(()=> this.getTrackingUpdate(), 600000)
    
  }

  _handleNotification = (notification) => {
    this.setState({notification: notification});
  };

  
  async getTrackingUpdate(){

    const emp_id = EMP_ID();

    const {latitude, longitude } = this.state.location.coords;

    // PRINT(`${JSON.stringify(this.state.location)}`);

    if(emp_id > 0){

      if(latitude !== "" && longitude !== ""){

          fetch(BASE_URL, {
                method: "POST", headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  "action": "trackme",
                  id: emp_id,
                  lat: latitude,
                  lng: longitude
                }),
        })
        .then((response) => response.json())
        .then((responseData) =>
        {
          // PRINT(`I am Background Task ${JSON.stringify(responseData)}`)
        })
        .catch((error) => {
            console.error(error);
        });

      }

    }
    
  }

	  _getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
		  this.setState({
			errorMessage: 'Permission to access location was denied',
		  });
		}
	
		let location = await Location.getCurrentPositionAsync({});
		  this.setState({ location: location });
	  };
  
    
  

  render(){

    
  return (
      <Provider store={store}>
          <AppNavigator />
      </Provider>
    );
  }
}