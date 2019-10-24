import Actions from './Actions';
import { BASE_URL, APP_TOKEN, PRINT } from './AppConst';

import axios from 'axios';

export const GetReports = (postData) => (dispatch) => {

    const { emp_id } = postData;

	axios.defaults.baseURL = BASE_URL;

	// AsyncStorage.getItem("app_token").then((token) => {
		axios.defaults.headers.common['Authorization'] = APP_TOKEN();
		axios
		.post('report/for/'+emp_id, {
			
		})
		.then((res) =>{
			
			const status = parseInt(res.data.status);
				if (status === 200) {
					const responseString = JSON.parse(JSON.stringify(res.data));
                    let reports = responseString.data;
					dispatch({
						type: Actions.VIEW_REPORTS,
						payload: reports
					})
				}else{
					dispatch({
						type: Actions.VIEW_REPORTS,
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



export const CompleteTask = (postData) => (dispatch) => {

	const { task_id, remarks } = postData;

	axios.defaults.baseURL = BASE_URL;

	// AsyncStorage.getItem("app_token").then((token) => {
		axios.defaults.headers.common['Authorization'] = APP_TOKEN();

		axios
		.post('task/complete/'+task_id, {
			remarks: remarks,
		})
		.then((res) =>{

			// PRINT('Task response '+ JSON.stringify(res));

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

