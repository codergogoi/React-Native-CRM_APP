import Actions from './Actions';
import { BASE_URL, APP_TOKEN, PRINT, CURRENCY, EMP_ID } from './AppConst';

import axios from 'axios';


export const GetClients = (postData) => (dispatch) => {

		axios.defaults.baseURL = BASE_URL;

		const emp_id = EMP_ID();

		axios.defaults.headers.common['Authorization'] = APP_TOKEN();
		const currency = CURRENCY();
		axios
		.post('task/clients-for-emp/'+emp_id, {
			currency: currency
		})
		.then((res) =>{
			
			// PRINT(JSON.stringify(res));

            const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
                    let clients = responseString.data;
					dispatch({
						type: Actions.GET_CLIENTS,
						payload: clients
					})
				}else{
					dispatch({
						type: Actions.GET_CLIENTS,
						payload: []
					})
				}
			}
		)
		.catch((error) => console.log(' Error Encountered'));

};

export const UpdateLocation = (postData) => (dispatch) => {

	const { emp_id, latitude, longitude } = postData;

		axios.defaults.baseURL = BASE_URL;

		axios.defaults.headers.common['Authorization'] = APP_TOKEN();
		axios
		.post('/user/locupdate/'+emp_id, {
			lat: latitude,
			lng: longitude
		})
		.then((res) =>{
            const status = parseInt(res.data.status);
				if (status === 200) {
					// const responseString = JSON.parse(JSON.stringify(res.data));
					// PRINT(`Current Location Update Output ${JSON.stringify(responseString)}`);
				}
			}
		)
		.catch((error) => console.log(' Error Encountered'));

};


export const AddNewClient = (postData) => (dispatch) => {

	const { client_name, client_address, email, phone_number,contact_person, appointment_date, emp_id} = postData;
	
	axios.defaults.baseURL = BASE_URL;

		axios.defaults.headers.common['Authorization'] = APP_TOKEN();
		axios
		.post('client/add', {
			emp_id: emp_id,
			end_date: appointment_date,
			name: client_name,
			address: client_address,
			phone_number: phone_number,
			email: email,
			contact_person: contact_person
		})
		.then((res) =>{
			
			const status = parseInt(res.data.status);
			
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
                    let tasks = responseString.data;
					dispatch({
						type: Actions.ADD_TASK,
						payload: tasks
					})
				}else{
					dispatch({
						type: Actions.ADD_TASK,
						payload: []
					})
				}
			}
		)
		.catch((error) => console.log(' Error Encountered'));
	// }).done();

};


export const AddTask = (postData) => (dispatch) => {

	const { client_id ,task_title, description, appointment_date, emp_id} = postData;
	
	axios.defaults.baseURL = BASE_URL;

		axios.defaults.headers.common['Authorization'] = APP_TOKEN();
		axios
		.post('task/add-self', {
			title: task_title,
			client_id: client_id,
			task_description: description,
			employee_id: emp_id,
			end_date: appointment_date
		})
		.then((res) =>{
			
			// PRINT('Add Self Task');
			// PRINT(JSON.stringify(res));

			const status = parseInt(res.data.status);
			
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
                    let tasks = responseString.data;
					dispatch({
						type: Actions.ADD_TASK,
						payload: tasks
					})
				}else{
					dispatch({
						type: Actions.ADD_TASK,
						payload: []
					})
				}
			}
		)
		.catch((error) => console.log(' Error Encountered'));
	// }).done();

};

export const UploadFile = (postData) => (dispatch) => {

    const { emp_id } = postData;

	axios.defaults.baseURL = BASE_URL;
	// AsyncStorage.getItem("app_token").then((token) => {
		axios.defaults.headers.common['Authorization'] = APP_TOKEN();
		axios
		.post('task/ratio/'+emp_id, {
			
		})
		.then((res) =>{
			
            const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
                    let tasks = responseString.data;
					dispatch({
						type: Actions.GET_TASK_RATIO,
						payload: tasks
					})
				}else{
					dispatch({
						type: Actions.GET_TASK_RATIO,
						payload: []
					})
				}

			}
		)
		.catch((error) => console.log(' Error Encountered'));

	// }).done();

};

export const GetTask = (postData) => (dispatch) => {

    const { emp_id } = postData;

	axios.defaults.baseURL = BASE_URL;

	// AsyncStorage.getItem("app_token").then((token) => {
		axios.defaults.headers.common['Authorization'] = APP_TOKEN();
		const currency = CURRENCY();
		axios
		.post('task/for/'+emp_id, {
			currency: currency
		})
		.then((res) =>{
			
            const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					
                    let tasks = responseString.data;
					dispatch({
						type: Actions.VIEW_TASK,
						payload: tasks
					})
				}else{
					dispatch({
						type: Actions.VIEW_TASK,
						payload: []
					})
				}

			}
		)
		.catch((error) => console.log(' Error Encountered'));

	// }).done();

};


export const GetGroupTaskClients = (postData) => (dispatch) => {

    const { group_id } = postData;

	axios.defaults.baseURL = BASE_URL;

	// AsyncStorage.getItem("app_token").then((token) => {
		axios.defaults.headers.common['Authorization'] = APP_TOKEN();
		const currency = CURRENCY();
		axios
		.post('task/group-task-for/'+group_id, {
			currency: currency
		})
		.then((res) =>{

            const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
					 
					let group_task_clients = responseString.data;
					
					// PRINT(` Group task Client ${JSON.stringify(group_task_clients)}`);

					dispatch({
						type: Actions.VIEW_GROUP_TASK_CLIENTS,
						payload: group_task_clients
					})
				}else{
					dispatch({
						type: Actions.VIEW_GROUP_TASK_CLIENTS,
						payload: []
					})
				}

			}
		)
		.catch((error) => console.log(' Error Encountered'));

	// }).done();

};



export const GetTaskRatio = (postData) => (dispatch) => {

    const { emp_id } = postData;

	axios.defaults.baseURL = BASE_URL;

	// AsyncStorage.getItem("app_token").then((token) => {
		axios.defaults.headers.common['Authorization'] = APP_TOKEN();
		axios
		.post('task/ratio/'+emp_id, {
			
		})
		.then((res) =>{
						
            const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
                    let tasks = responseString.data;
					dispatch({
						type: Actions.GET_TASK_RATIO,
						payload: tasks
					})
				}else{
					dispatch({
						type: Actions.GET_TASK_RATIO,
						payload: []
					})
				}

			}
		)
		.catch((error) => console.log(' Error Encountered'));

	// }).done();

};

export const GetPickTask = () => (dispatch) => {

	axios.defaults.baseURL = BASE_URL;

	// AsyncStorage.getItem("app_token").then((token) => {
		axios.defaults.headers.common['Authorization'] = APP_TOKEN();

		axios
		.post('task/pick-task', {
			
		})
		.then((res) =>{

            const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
                    let tasks = responseString.data;
					dispatch({
						type: Actions.PICK_TASK,
						payload: tasks
					})
				}else{
					dispatch({
						type: Actions.PICK_TASK,
						payload: []
					})
				}

			}
		)
		.catch((error) => console.log(' Error Encountered'));

	// }).done();
	
};



export const AcceptTask = (postData) => (dispatch) => {


	const { emp_id, task_id, client_id } = postData;

	axios.defaults.baseURL = BASE_URL;

	// AsyncStorage.getItem("app_token").then((token) => {
		axios.defaults.headers.common['Authorization'] = APP_TOKEN();

		axios
		.post('task/accept/'+task_id, {
			emp_id: emp_id,
			client_id: client_id
		})
		.then((res) =>{

			// PRINT('Task response '+ JSON.stringify(res));

            const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
                    let tasks = responseString.data;
					dispatch({
						type: Actions.ACCEPT_TASK,
						payload: tasks
					})
				}else{
					dispatch({
						type: Actions.ACCEPT_TASK,
						payload: []
					})
				}

			}
		)
		.catch((error) => console.log(' Error Encountered'));

	// }).done();
	
};




export const UpdateTaskStatus = (postData) => (dispatch) => {


	const { emp_id, task_id,status } = postData;

	axios.defaults.baseURL = BASE_URL;

		axios.defaults.headers.common['Authorization'] = APP_TOKEN();

		axios
		.post('task/update-status/'+task_id, {
			emp_id: emp_id,
			status: status
		})
		.then((res) =>{

			// PRINT("Update Task");
			// PRINT(JSON.stringify(res));

            const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
                    let tasks = responseString.data;
					dispatch({
						type: Actions.UPDATE_TASK_STATUS,
						payload: tasks
					})
				}else{
					dispatch({
						type: Actions.UPDATE_TASK_STATUS,
						payload: []
					})
				}

			}
		)
		.catch((error) => console.log(' Error Encountered'));

	// }).done();
	
};


export const CompleteTask = (postData) => (dispatch) => {

	const { task_id, remarks, latitude, longitude, update, client_id } = postData;

	axios.defaults.baseURL = BASE_URL;

	// AsyncStorage.getItem("app_token").then((token) => {
		axios.defaults.headers.common['Authorization'] = APP_TOKEN();

		axios
		.post('task/complete/'+task_id, {
			remarks: remarks,
			lat: latitude,
			lng: longitude,
			update: update,
			client_id: client_id
		})
		.then((res) =>{

			// PRINT('Task  COmpletion response '+ JSON.stringify(res));

            const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
                    let tasks = responseString.data;
					dispatch({
						type: Actions.FINISHED_TASK,
						payload: tasks
					})
				}else{
					dispatch({
						type: Actions.FINISHED_TASK,
						payload: []
					})
				}

			}
		)
		.catch((error) => console.log(' Error Encountered'));

	// }).done();
	
};

export const DismissAlert = () => (dispatch) => {

	dispatch({
		type: Actions.DISMISS
	});
}

export const UpdateImageURI = (uri) => (dispatch) => {

	dispatch({
		type: Actions.UPDATE_IMAGE,
		payload: uri
	});
}


export const ResetImageURI = () => (dispatch) => {

	dispatch({
		type: Actions.RESET_IMAGE,
	});
}

