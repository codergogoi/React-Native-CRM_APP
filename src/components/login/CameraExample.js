import * as React from 'react';
import { Button, Image, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {ImagePicker, Constants} from 'expo';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera'
import ClickIcon from '../../images/camera_click.png';
import SwitchIcon from '../../images/camera_switch.png';
import FlashIcon from '../../images/camera_flash.png';
import BackArrow from '../../images/back_arrow.png';
import PlaceHolder from '../../images/img_placeholder.png';
import { UpdateImageURI } from '../../store/actions/TaskActions';
import { connect } from 'react-redux';
import { APP_TOKEN, BASE_URL, PRINT } from '../../store/actions/AppConst';
import { Bubbles } from 'react-native-loader';


class CameraExample extends React.Component {
  
  camera = null;
  
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      captures: null,
      uri: null,
      isUploading: false,
      task : props.navigation.getParam('task')
    };

    

}


  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    this.getPermissionAsync();

  }

  clickPhoto = async () => {

    const result = await this.camera.takePictureAsync();

    if (!result.cancelled) {
      this.setState({ capturing: false, captures: result, uri: result.uri })
      this.props.UpdateImageURI({ uri : result.uri});
      this.setState({image:  result.uri, isUploading: true});
      this.onUploadFile();
    }
    
};

switchCamera = () => {
  this.setState({
    type:
      this.state.type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
  });
}

onTapBack  = () => {

    this.props.navigation.goBack();
  
}

onUploadFile = () => {

  const { image } = this.state;
  const task  = this.props.navigation.getParam('task');

  // console.log(`Task Details ===> ${JSON.stringify(task)}`);

  const task_id = task.id;
  const file_name = 'task_proof_'+task_id+'.jpg';


  PRINT(`Upload File Name : ${file_name} File Name: ${image}`);


  var data = new FormData();  
  data.append('file', {  
    uri: image, // your file path string
    name: file_name,
    type: 'image/jpeg'
  });

  const app_token = APP_TOKEN();

  fetch(BASE_URL+'upload-task', {  
    headers: {
      'Accept': 'application/json',
      'Authorization':  app_token,
      'Content-Type': 'multipart/form-data'
    },
    method: 'POST',
    body: data
    }).then((response) => response.json())
    .then((responseJson) => {
      this.setState({ isUploading: false});
      // PRINT("Seems Success..!");
      // console.log("Response will be :" + JSON.stringify(responseJson));
      this.props.navigation.goBack();
      
    })
    .catch((error) => {
    this.setState({ isUploading: false});
    this.props.navigation.goBack();

      console.error(error);
    });
}

  // Flash and other features will go here
  statusBar = ()  => {

    return (
      <View style={styles.statusBar}>
        { this.state.isUploading ? (<View style={styles.uploadProgress}>
							<Bubbles size={10} color="#501094" />
              </View>) : <TouchableOpacity style={styles.statusBarItem}
          onPress={this.onTapBack}
         >
              <Image source={BackArrow} style={{width: 40, height: 40,}} />
        </TouchableOpacity>}
              
         
      </View>
    );
  }

  cameraToolbar = () => {

    const { uri } = this.state;

    return (
      <View style={styles.toolBar}>

        <View style={styles.toolbarItem}>
            {uri !== null ? 
            <Image source={{ uri }} style={{width: 40, height: 40}} /> : 
            <Image source={PlaceHolder} style={{width: 40, height: 40}} />
            }
            
        </View>
        <TouchableOpacity style={styles.toolbarItem}
          onPress={this.clickPhoto.bind(this)}
        >
              <Image source={ClickIcon} style={{width: 70, height: 70,}} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolbarItem}
          onPress={ this.switchCamera}
        >
              <Image source={SwitchIcon} style={{width: 42, height: 42,}} />
        </TouchableOpacity>
        
      </View>
    );
  }

  render() {
 

    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null || hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type}
              ref={camera => this.camera = camera}
              flashMode={Camera.Constants.FlashMode.on}
              autoFocus={Camera.Constants.AutoFocus.on}
          >              
          {this.statusBar()}

            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              {this.cameraToolbar()}
            </View>
          </Camera>
        </View>
      );
    }
  }
 

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
}


const mapStateToProps = (state) =>({
	image_uri: state.taskReducer.image_uri,
});

export default connect(mapStateToProps, { UpdateImageURI  })(CameraExample);


const styles = StyleSheet.create({
  toolBar: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 100,
    width: '100%',
    backgroundColor: '#000',
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingBottom: 15,
  },
  statusBar:{
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 43,
    height: 83,
    width: '100%',
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
  },
  toolbarItem: {
    backgroundColor: 'transparent',
    width: 70, 
    height: 70, 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: 10
  },
  statusBarItem: {
    display: 'flex',
    backgroundColor: 'transparent',
    width: 40, 
    height: 40, 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'flex-start',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    marginLeft: 20,
    marginBottom: 5,
  }

});