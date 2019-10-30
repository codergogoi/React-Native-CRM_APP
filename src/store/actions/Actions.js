const Action  = { 
    LOGIN: 'DO_LOGIN',
	DIDLOGIN: 'DID_LOGIN',
	LOGOUT: 'LOGOUT',
	PROFILE: 'PROFILE',
	GETOFFER: 'GET_OFFER',
	GETBANKS: 'GET_BANKS',
	GETROUTING: 'GET_ROUTING',
	GETSDK: 'GET_SDK',
	GETPROMO: 'GET_PROMO',
	FETCHING: 'FETCHING',
	DEFAULT: 'No_CHANGE',
	VIEW_BY_COUNTRY: 'VIEW_BY_COUNTRY',
	VIEW_BY_AIRLINES: 'VIEW_BY_AIRLINES',

	//Common Mdata
	VIEW: 'fetch_data',
	ADD: 'add_data',
	EDIT: 'view_data',
	DELETE: 'delete_data',
	DISMISS: 'dismiss_alert',

	//USER
	VIEW_USER: 'view_user',
	EDIT_USER: 'edit_user',
	PASSWORD_CHANGE: 'password_change',
	WRONG_PASSWORD: 'wrong_password',
	FORGOT_PASSWORD: 'forgot_password',
	VIEW_ATTENDANCE: 'attendance',
	CHECK_STATUS: 'attendance_status',
	CAPTURE: 'attendance_capture',


	//TASK
	VIEW_TASK: 'view_task',
	VIEW_GROUP_TASK_CLIENTS: 'view_group_task_clients',
	PICK_TASK: 'pick_task',
	ACCEPT_TASK: 'accept_task',
	REJECT_TASK: 'reject_task',
	FINISHED_TASK: 'finished_task',
	GET_TASK_RATIO: 'get_task_ratio',
	ADD_TASK: 'add_task',
	GET_CLIENTS: 'get_clients',
	UPDATE_TASK_STATUS: 'update_task_status',
	UPDATE_IMAGE: 'update_image',
	RESET_IMAGE: 'reset_image',

	//Reports
	VIEW_REPORTS: 'view_reports',

	//Expenses
	VIEW_EXPENSES: 'view_expenses',
	EDIT_EXPENSES: 'edit_expenses',
	ADD_EXPENSES: 'add_expenses',
	DELETE_EXPENSES: 'delete_expenses',
	VIEW_MY_TASK: 'view_my_task'

};

export default Action;