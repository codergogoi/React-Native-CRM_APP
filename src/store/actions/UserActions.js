import Actions from './Actions';
import { BASE_URL, APP_TOKEN, EMP_ID, PRINT } from './AppConst';

import axios from 'axios';

export const DoLogin = (postData) => (dispatch) => {

	const { email, password } = postData;

	axios.defaults.baseURL = BASE_URL;
	axios.defaults.headers.common['Authorization'] =  "";

	axios
		.post('/user/login', {
			action: 'login',
			email: email,
			password: password
		})
		.then((res) =>{

			PRINT(JSON.stringify(res));

				const status = parseInt(res.data.status);

				if (status === 200) {

					const responseString = JSON.parse(JSON.stringify(res.data));
					let user = responseString.data;

					// PRINT(JSON.stringify(responseString));

					// if (user.token !== undefined){
					// 	AsyncStorage.setItem("app_token", user.token);
					// 	AsyncStorage.setItem("emp_id", user.emp_id);
					// 	AsyncStorage.setItem("current_user", JSON.stringify(user));
					// }
					
					dispatch({
						type: Actions.LOGIN,
						payload: user
					})
			 
				}else{
					dispatch({
						type: Actions.LOGIN,
						payload: []
					})
				}

			}
		)
		.catch((error) => console.log(' Error Encountered'));
};



export const TrackUpdate = (postData) => (dispatch) => {

	const { emp_id, lat, lng } = postData;

	axios.defaults.baseURL = BASE_URL;
	axios.defaults.headers.common['Authorization'] =  "";

	axios
		.post('', {
			action: 'trackme',
			id: emp_id,
			lat: lat,
			lng: lng
		})
		.then((res) =>{

				const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					// PRINT(`Tracking Response ${JSON.stringify(responseString)}`);
				}
			}
		)
		.catch((error) => console.log(' Error Encountered'));
};


export const ViewUser = (postData) => (dispatch) => {
	
	const { emp_id } = postData;


	// console.log('Requested Employee'+ emp_id);

	axios.defaults.baseURL = BASE_URL;
	 
	// AsyncStorage.getItem("app_token").then((token) => {
		axios.defaults.headers.common['Authorization'] =  APP_TOKEN();
		axios
			.post('/user/view/'+emp_id, {
			})
			.then((res) =>{

				// PRINT('RESPONSE:'+ JSON.stringify(res));
				
				const status = parseInt(res.data.status);
					if (status === 200) {
						const responseString = JSON.parse(JSON.stringify(res.data));
						let users = responseString.data;

						dispatch({
							type: Actions.VIEW_USER,
							payload: users
						})
					}else{
						dispatch({
							type: Actions.VIEW_USER,
							payload: []
						})
					}
			}
			)
			.catch((error) => console.log(' Error Encountered'));
	// }).done();
};




export const ForgotPassword = (postData) => (dispatch) => {
	
	const { email } = postData;
	axios.defaults.baseURL = BASE_URL;
		axios.defaults.headers.common['Authorization'] =  APP_TOKEN();
		axios
			.post('/user/forgot', {
				action: 'forgot',
				email: email
			})
			.then((res) =>{

				// PRINT(JSON.stringify(res));

				const status = parseInt(res.data.status);
					if (status === 200) {
						const responseString = JSON.parse(JSON.stringify(res.data));
						let users = responseString.data;

						// PRINT(JSON.stringify(users));

						dispatch({
							type: Actions.FORGOT_PASSWORD,
							payload: users
						})
					}else{
						// PRINT('Failed to send email');

						dispatch({
							type: Actions.FORGOT_PASSWORD,
							payload: []
						})
					}
			}
			)
			.catch((error) => console.log(' Error Encountered'));
	// }).done();
};

export const DoLogout = () => (dispatch) => {

	dispatch({
		type: Actions.LOGOUT
	});
};


export const EditUser = (postData) => (dispatch) => {

	const  { emp_id,name,email,mobile } = postData;

	axios.defaults.baseURL = BASE_URL;
	 
	// AsyncStorage.getItem("app_token").then((token) => {
		axios.defaults.headers.common['Authorization'] =  APP_TOKEN();
		axios
			.post('/user/edit/'+emp_id, {
				name: name,
				email: email,
				mobile: mobile
			})
			.then((res) =>
				{
					// console.log('edit Response'+ JSON.stringify(res));
					
					const status = parseInt(res.data.status);
					if (status === 200) {
						dispatch({
							type: Actions.EDIT_USER,
						})
					}else{
						dispatch({
							type: Actions.VIEW,
							payload: []
						})
					}
				}
			)
			.catch((error) => console.log(' Error Encountered'));
	// }).done();
}
 


export const ChangePassword = (postData) => (dispatch) => {

	const  { emp_id, old_password, new_password } = postData;

	axios.defaults.baseURL = BASE_URL;
	 
	// AsyncStorage.getItem("app_token").then((token) => {
		axios.defaults.headers.common['Authorization'] =  APP_TOKEN();
		axios
			.post('/user/pwdchange/'+emp_id, {
				old_password: old_password,
				new_password: new_password
			})
			.then((res) =>
				{		
					// PRINT('Password Change'+ JSON.stringify(res));	
							
					const status = parseInt(res.data.status);
					if (status === 200) {
						dispatch({
							type: Actions.PASSWORD_CHANGE,
						})
					}else{
						dispatch({
							type: Actions.WRONG_PASSWORD,
						})
					}
				}
			)
			.catch((error) => console.log(' Error Encountered'));
	// }).done();
}

	export const DismissAlert = () => (dispatch) => {

		dispatch({
			type: Actions.DISMISS
		});
	}

	export const DidLoginPerformed = () => (dispatch) => {

		dispatch({
			type: Actions.DIDLOGIN
		});
	}