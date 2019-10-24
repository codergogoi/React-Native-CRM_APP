import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native';
import { createAppContainer, createDrawerNavigator, createStackNavigator, DrawerItems } from 'react-navigation';

import Actions from '../../store/actions/Actions';
import { connect } from 'react-redux';
import { DoLogout } from '../../store/actions/UserActions';

import store from '../../store/Stores';

import HomeIcon from '../../images/home_icon.png';
import TaskIcon from '../../images/task_icon.png';
import ExpensesIcon from '../../images/expenses_icon.png';
import ReportIcon from '../../images/report_icon.png';
import ProfileIcon from '../../images/edit_profile_icon.png';
import SettingsIcon from '../../images/settings_icon.png';
import LogoutIcon from '../../images/logout_icon.png';

import SplashScreen from '../splash/SplashScreen';
import LoginScreen from '../login/LoginView'
import HomeScreen from '../homepage/HomeView';
import ProfileScreen from '../profile/ProfileView';
import TaskScreen from '../task/TaskView';
import ExpensesScreen from '../expenses/ExpensesView';
import ReportScreen from '../report/ReportView';
import SettingsScreen from '../settings/SetingsView';
import TaskDetailsScreen from '../task/TaskDetailsView';
import AddTaskScreen from '../task/AddTaskView';
import ReportDetailsScreen from '../report/ReportDetails';
import AddExpensesScreen from '../expenses/AddExpensesView';
import GroupTaskScreen from '../task/GroupTask';
import CameraExampleScreen from '../login/CameraExample';
import GroupTaskDetailsScreen from '../task/GroupTaskDetails';
import AttendanceScreen from '../attendance/AttendanceView';

import UserIcon from '../../images/default_user.png';

import { ScrollView, AsyncStorage } from 'react-native';
import { Icon, Button } from 'native-base';
import { EMP_NAME, EMP_ID, BASE_URL } from '../../store/actions/AppConst';


const hiddenItems = [ 'Splash', 'Login', 'TaskDetails','TaskReview', 'Report'];

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  paddingLeft: 20,
	  marginTop: 63
	},
	userIcon:{
		width: 80,
		height: 80,
		marginLeft:20,
	},
	welcomeTitle:{
		fontSize: 16,
		paddingLeft: 20,
		marginTop: 20,
		color: '#838281'
	},
	logoutIcon:{
		width: 24,
		height: 24,
		marginLeft: 20
	},
	logoutContent:{
		height: 40,
		flexDirection: 'row',
		paddingLeft: 15
	},
	menuTitle:{
		marginLeft: 30,
		fontSize: 13,
		fontWeight: 'bold'
	},
	icon: {
		width: 24,
		height: 24,
	  },
  });

const SideBar = (props) => {
	const propsClone = {
		...props,
		items: props.items.filter((item) => !hiddenItems.includes(item.key))
	};

	const emp_name = EMP_NAME();

	const emp_id = EMP_ID();

	const profilePicUrl = BASE_URL+'uploads/profile_pic_'+emp_id+'.jpg';

	return (
		<SafeAreaView style={styles.container}>
		  <View style={{height: 160}}>
			  
			<TouchableOpacity onPress={() => {
				store.dispatch({
					type: Actions.PROFILE
				});
				props.navigation.navigate('Profile');
			}}>
				
				<Image source={{ uri: profilePicUrl }}  defaultSource={UserIcon} style={[styles.userIcon, {borderRadius: 40}]}/>

			</TouchableOpacity>

			<Text style={styles.welcomeTitle}>Welcome {emp_name}</Text>
		  </View>
		<ScrollView>
		  <DrawerItems {...propsClone} />
			<TouchableOpacity onPress={() => {
					store.dispatch({
						type: Actions.LOGOUT
					});
 					props.navigation.navigate('Login');
			}}>
				<View style={styles.logoutContent}>
					<Image source={LogoutIcon} style={styles.icon}/>
					<Text style={styles.menuTitle}>Logout </Text>
				</View>
			</TouchableOpacity>
		</ScrollView>
		
	  </SafeAreaView>

	);
};



const MenuButton = ({ navigate }) => (
	<Button
		transparent
		light
		style={{
			marginTop: 0
		}}
		onPress={() => {
			navigate.openDrawer();
		}}
	>
		<Icon
			style={{
				Color: 'red'
			}}
			size={28}
			name="menu"
		/>
	</Button>
);


const Splash = {
	screen: SplashScreen,
	navigationOptions: {
		header: null,
		gesturesEnabled: false,
	
	}
	
};

const Home = {
	screen: HomeScreen,
	navigationOptions: {
		header: null,
	}
};

const Login = {
	screen: LoginScreen,
	navigationOptions: {
		header: null,
		drawerLockMode: 'locked-closed'
	}
};
 
const Camera = {
	screen: CameraExampleScreen,
	navigationOptions: {
		header: null,
		gesturesEnabled: false,
	}
};

const Profile = {
	screen: ProfileScreen,
	navigationOptions: {
		header: null,
		drawerLabel: 'Profile',
		drawerIcon: ({ tintColor }) => (
		  <Image
			source={ProfileIcon}
			style={[styles.icon, {tintColor: tintColor}]}
		  />
		),
	}
};
 
const Task = {
	screen: TaskScreen,
	navigationOptions: {
		header: null,
	}
};

const GroupTask = {
	screen: GroupTaskScreen,
	navigationOptions: {
		header: null
	}
}


const ReportDetails = {
	screen: ReportDetailsScreen,
	navigationOptions: {
		header: null,
	}
};


const Attendance = {
	screen: AttendanceScreen,
	navigationOptions: {
		header: null
	}
};



const Expenses = {
	screen: ExpensesScreen,
	navigationOptions: {
		header: null,
	}
};

const Settings = {
	screen: SettingsScreen,
	navigationOptions: {
		header: null,
		drawerLabel: 'Settings',
		drawerIcon: ({ tintColor }) => (
		  <Image
			source={SettingsIcon}
			style={[styles.icon, {tintColor: tintColor}]}
		  />
		),
	}
};

const AddExpenses = {
	screen: AddExpensesScreen,
	navigationOptions: {
		header: null
	}
};


const Report = {
	screen: ReportScreen,
	navigationOptions: {
		header: null
	}
};

const TaskDetails = {
	screen: TaskDetailsScreen,
	navigationOptions: {
		header: null,
	}
};

const GroupTaskDetails = {
	screen: GroupTaskDetailsScreen,
	navigationOptions: {
		header: null,
	}
};


const AddTask = {
	screen: AddTaskScreen,
	navigationOptions: {
		header: null
	}
};
 
const TaskStack = createStackNavigator(
	{
		Task: Task,
		GroupTask: GroupTask,
		TaskDetails: TaskDetails,
		GroupTaskDetails: GroupTaskDetails,
		AddTask: AddTask,
		Camera: Camera
	},
	{
		navigationOptions: {
			header: null,
			drawerLabel: 'Task',
			drawerIcon: ({ tintColor }) => (
			  <Image
				source={TaskIcon}
				style={[styles.icon, {tintColor: tintColor}]}
			  />
			),
		}

	}
);


const ReportStack = createStackNavigator(
	{
		Report: Report,
		ReportDetails: ReportDetails,
	},
	{
		navigationOptions: {
			header: null,
			drawerLabel: 'Report',
			drawerIcon: ({ tintColor }) => (
			  <Image
				source={ReportIcon}
				style={[styles.icon, {tintColor: tintColor}]}
			  />
			),
		}

	}
);

const HomeStack = createStackNavigator(
	{
		Home: Home,
		TaskReview: TaskDetails,
		GroupReview: GroupTask,
	},
	{
		navigationOptions: {
			header: null,
			drawerLabel: 'Home',
			drawerIcon: ({ tintColor }) => (
			  <Image
				source={HomeIcon}
				style={[styles.icon, {tintColor: tintColor}]}
			  />
			),
		}

	},
);

const ExpensesStack = createStackNavigator(
	{
		Expenses: Expenses,
		AddExpenses: AddExpenses,
		Camera: Camera
	},{
		navigationOptions: {
			header: null,
			drawerLabel: 'Expenses',
			drawerIcon: ({ tintColor }) => (
			  <Image
				source={ExpensesIcon}
				style={[styles.icon, {tintColor: tintColor}]}
			  />
			),
		}
	}

);



const LoginStack = createStackNavigator(
	{
		Login: Login,
	},{
		navigationOptions: {
			header: null,			 
		},
		
	}

);




const RouteConfig = {
	initialRoute: 'Splash',
	contentComponent: SideBar,
	navigationOptions: {
		gesturesEnabled: false
	}
};

const AppNavigator = createDrawerNavigator(
	{
		Splash: Splash,
		Login: Login,
		Home: HomeStack,
		Attendance: Attendance,
		Task: TaskStack,
		Expenses: ExpensesStack,
		Report: ReportStack,
		Profile: Profile,
		Settings: Settings,
	},
	RouteConfig
);

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { DoLogout })(createAppContainer(AppNavigator));