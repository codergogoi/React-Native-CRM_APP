import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import { EMP_ID, PRINT } from '../../store/actions/AppConst';
import { connect } from 'react-redux';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import Pie from 'react-native-pie'

import Constants from 'expo-constants';

import { Container, Header, Title, Content, Left, Right, Body } from 'native-base';
import {  StyleSheet, TouchableOpacity, Text, Image, View, Platform} from 'react-native';
import MenuIcon from '../../images/menu_icon.png';
import HomeIcon from '../../images/home_icon.png';
import TaskList from './TaskList';
import { GetTask, GetTaskRatio, UpdateLocation } from '../../store/actions/TaskActions';
import { BackHandler } from 'react-native';

class HomeView extends Component {
	
	static navigationOptions = {
		drawerLabel: 'My Home',
		drawerIcon: ({ tintColor }) => (
		  <Image
			source={HomeIcon}
			style={[styles.icon, {tintColor: tintColor}]}
		  />
		),
	};

	constructor(props) {
		super(props);
		this.state = {
			pendingTask: 0,
			completedTask: 0,
			emp_id: '',
			filterIndex: 2,
			location: ''
		};

		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
	}


	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	handleBackButtonClick() {
		this.props.navigation.goBack(null);
		return true;
	}

	componentDidMount(){

		if (Platform.OS === 'android' && !Constants.isDevice) {
			this.setState({
				errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
			});
		} else {
			this._getLocationAsync();
		}

		this._subscribe = this.props.navigation.addListener('didFocus', () => {
			this.setState({ emp_id: EMP_ID()})
			this.props.GetTaskRatio({emp_id: EMP_ID()});
			this.props.GetTask({emp_id: EMP_ID()});

			if(this.state.location.coords !== undefined){
				const { latitude, longitude } = this.state.location.coords;
				if(latitude !== "" && longitude !== ""){
					const emp_id = EMP_ID();
					this.props.UpdateLocation({emp_id, latitude, longitude});
				}
			}
			
			
		});

		
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
  

 
    componentWillReceiveProps(nextProps) {
		const {ratio} = nextProps;
		if(ratio !== undefined){
			// console.log('RATIO '+ JSON.stringify(ratio));
			this.setState({
				pendingTask: ratio.pending,
				completedTask: ratio.completed
		   });
		}
    }

	onTapLogout = () => {
		alert('working Logout');
	}

	onTapMenuButton = () => {
		this.props.navigation.openDrawer();
	}

	onTapInProgress = () => {
		this.setState({ filterIndex: 2});
	}

	onTapPending = () => {
		this.setState({ filterIndex: 1});
	}

	onTapCompleted  = () => {
		this.setState({ filterIndex: 3});
	}

	onViewTaskDetails = (task) => {

		if(task.grouped === true){
			this.props.navigation.navigate('GroupReview', {task: task})
		}else{
			this.props.navigation.navigate('TaskReview', {task: task})
		}
	}

	currentTask = (index) => {

		const {tasks } = this.props;

		if(tasks !== undefined){
			if(index === 3){
				return tasks.filter(function(item){
					return item.status === 3 
				})
			}else if (index === 2){
				return tasks.filter(function(item){
					return item.status === 2 
				})
			}else{
				return tasks.filter(function(item){
					return item.status < 2 || item.state === 4
				})
			}
 
		}else{
			return undefined;
		}
		
	}

	
	drawPie = (data) => {

		
		if(data !== undefined){

			let inProgress = data.inprogress !== undefined ? data.inprogress : 0;
			let pending = data.pending !== undefined ? data.pending : 0;
			let completed = data.completed !== undefined ? data.completed : 0;
			let followup = data.followup !== undefined ? data.followup : 0;

			const series = [Math.round(inProgress), Math.round(pending), Math.round(completed), Math.round(followup)]

			return (<View style={styles.chartContainer}>
						<View style={styles.pieView}>
							<Pie
							radius={90}
							series={series}
							colors={['#F8C471', '#C0392B', '#1E8449', '#4A235A']} />
						</View>
						
						<View style={styles.dataView}>

							<View style={[styles.legendView, {backgroundColor: '#F8C471'}]}>
								<Text style={styles.legendText}>{Math.round(inProgress)}% In Progress</Text>
							</View>
							<View style={[styles.legendView, {backgroundColor: '#C0392B'}]}>
								<Text style={styles.legendText}>{Math.round(pending)}% Pending</Text>
							</View>
							<View style={[styles.legendView, {backgroundColor: '#1E8449'}]}>
								<Text style={styles.legendText}>{Math.round(completed)}% Completed</Text>
							</View>
							<View style={[styles.legendView, {backgroundColor: '#4A235A'}]}>
								<Text style={styles.legendText}>{Math.round(followup)}% Later Folowup</Text>
							</View>

						</View>
				</View>)


		}

	}


	render() {

		const { filterIndex } = this.state;

		const { ratio } = this.props;

 
		return (
			<SafeAreaView style={ styles.container }>
				<Container style={{backgroundColor: '#C8C8C8'}}>
					<Header style={{backgroundColor: '#FFFF', elevation: 0, shadowOpacity: 0}}>
						<Left>
							<TouchableOpacity onPress={this.onTapMenuButton}>
								<Image source={MenuIcon} style={styles.menuIcon} />
							</TouchableOpacity>
						</Left>
						<Body>
							<Text style={styles.activityTitle}>Progress Activity</Text>
						</Body>
						<Right />
					</Header>
					{this.drawPie(ratio)}
					<View style={styles.assignedTask}>
							<View style={styles.sortView}>
								<TouchableOpacity onPress={this.onTapInProgress} 
									style={ filterIndex == 2 ? [styles.sortButtons, {borderTopRightRadius: 0, borderBottomRightRadius: 0, backgroundColor: '#313a59'}] : [styles.sortButtons, {borderTopRightRadius: 0, borderBottomRightRadius: 0}]}>
									<View>
										<Text style={styles.taskSortText}>In-Progress</Text>
									</View>
								</TouchableOpacity>

								<TouchableOpacity onPress={this.onTapPending} 
									style={ filterIndex == 1 ? [styles.sortButtons, {borderRadius: 0, backgroundColor: '#313a59'}] : [styles.sortButtons, {borderRadius: 0 }]}>
								<View >
									<Text style={styles.taskSortText}>Pending</Text>
								</View>
								</TouchableOpacity>
								
								<TouchableOpacity onPress={this.onTapCompleted} 
									style={ filterIndex == 3 ? [styles.sortButtons, {borderTopLeftRadius: 0, borderBottomLeftRadius: 0, backgroundColor: '#313a59'}] : [styles.sortButtons, {borderTopLeftRadius: 0, borderBottomLeftRadius: 0}]}>
									<View>
										<Text style={styles.taskSortText}>Completed</Text>
									</View>
								</TouchableOpacity>
								
							</View>
					</View>

					<Content bounce={true} >
						 		
							<View style={styles.assignedTaskList}>
								{this.currentTask(filterIndex) !== undefined && (<TaskList tasks={this.currentTask(filterIndex)} onViewTaskDetails={this.onViewTaskDetails} />)}
									
							</View>
					</Content>
				</Container>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = (state) => ({
	tasks: state.taskReducer.tasks,
	ratio: state.taskReducer.ratio
});

export default connect(mapStateToProps, {GetTask, GetTaskRatio, UpdateLocation })(HomeView);

const styles = StyleSheet.create({
	 
	container: {
		marginTop: Platform.OS === 'ios' ? 0 : 23,
		flex: 1,
		backgroundColor: '#fcfcfc'
	},
	header:{
		backgroundColor: '#212654',
		flex: 1,
		flexDirection: 'row',
	},
	menuIcon: {
		width: 40,
		height: 40
	},
	title: {
		fontSize: 16,
		alignItems: 'center',
	},
	assignedTaskList: {
		backgroundColor: '#C8C8C8',
	
		
	},
	assignedTask: {
		minHeight: 40,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	sortView:{
		height: 40,
		width: '100%',
		paddingLeft: 20,
		paddingRight: 20,
		justifyContent:'space-around',
		flexDirection:'row',
		alignContent: 'stretch'

	},
	sortButtons:{
		backgroundColor: '#566492',
		height: 40,
		width: '33%',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10

	},
	taskSortText:{
		color: '#FFF',
		fontSize: 16,
	},
	assignTitle:{
		fontSize: 20,
		color: '#4B5154',
		padding: 10,
		marginBottom: 10
	},
	activityTitle:{
		fontSize: 14,
		color: '#4B5154'
	},
	icon: {
		width: 24,
		height: 24,
	  },
	  chartContainer: {
		  flexDirection: 'row',
		  backgroundColor: '#FFF',
		  justifyContent: 'space-around',
		  width: '100%',
		  height: 210,
		  marginBottom: 10,
	  },
	  pieView: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
		width: '60%',
	},
	dataView: {
		flexDirection: 'column',
		justifyContent: 'space-around',
		width: '35%',
		padding: '2.5%',
	},
	legendView: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 10,
		borderRadius: 10
	},
	legendText: {
		color: '#FFFF',
		fontSize: 12
	}

});
