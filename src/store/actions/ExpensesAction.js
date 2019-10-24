import Actions from './Actions';
import { BASE_URL, APP_TOKEN, EMP_ID, PRINT } from './AppConst';

import axios from 'axios';

export const ViewExpenses = (postData) => (dispatch) => {
	
	const { emp_id } = postData;

	axios.defaults.baseURL = BASE_URL;
	 
	// AsyncStorage.getItem("app_token").then((token) => {
		axios.defaults.headers.common['Authorization'] =  APP_TOKEN();
		axios
			.post('/expenses/for/'+emp_id, {
			})
			.then((res) =>{

				// PRINT('RESPONSE:'+ JSON.stringify(res));
				
				const status = parseInt(res.data.status);
					if (status === 200) {
						const responseString = JSON.parse(JSON.stringify(res.data));
						let expenses = responseString.data;

						dispatch({
							type: Actions.VIEW_EXPENSES,
							payload: expenses
						})
					}else{
						dispatch({
							type: Actions.VIEW_EXPENSES,
							payload: []
						})
					}
			}
			)
			.catch((error) => console.log(' Error Encountered'));
	// }).done();
};



export const ViewMyTask = (postData) => (dispatch) => {
	
	const { emp_id } = postData;

	axios.defaults.baseURL = BASE_URL;
	 
	// AsyncStorage.getItem("app_token").then((token) => {
		axios.defaults.headers.common['Authorization'] =  APP_TOKEN();
		axios
			.post('/expenses/view-my-task/'+emp_id, {
			})
			.then((res) =>{
				
					// PRINT("MY TASK"+ JSON.stringify(res));

					const status = parseInt(res.data.status);
					if (status === 200) {
						const responseString = JSON.parse(JSON.stringify(res.data));
						let task = responseString.data;

						dispatch({
							type: Actions.VIEW_MY_TASK,
							payload: task
						})
					}else{
						dispatch({
							type: Actions.VIEW_MY_TASK,
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


export const AddExpenses = (postData) => (dispatch) => {

	const  { emp_id,
		headline,
		descriptions,
		completion_date,
		total_expenses,
		task_id,
		client_id } = postData;

	axios.defaults.baseURL = BASE_URL;
		
		axios.defaults.headers.common['Authorization'] =  APP_TOKEN();
		axios
			.post('/expenses/add/', {
				emp_id: emp_id,
				headline: headline,
				descriptions: descriptions,
				total_expenses: total_expenses,
				task_id: task_id,
				client_id: client_id
			})
			.then((res) =>
				{		
					
					// PRINT("Expenses Response "+ JSON.stringify(res));
					
					const status = parseInt(res.data.status);
					
					if (status === 200) {
						const responseString = JSON.parse(JSON.stringify(res.data));
						let expenses = responseString.data;

						dispatch({
							type: Actions.ADD_EXPENSES,
							payload: expenses
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