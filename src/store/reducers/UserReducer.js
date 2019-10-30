import Actions from '../actions/Actions';
import Action from '../actions/Actions';

const initialState = {
	users: [],
	current_user: [],
	app_token: [],
	city_id: '',
	emp_id: [],
	emp_name: '',
	currency: [],
	isAdded: false,
	isLogedIn: false,
	isPasswordChanged: false,
	isWrongPassword: false,
	isSentPassword: false,
	attendance: [],
	login_status: '',
	marked_attendance: false
};

export default function(state = initialState, action) {
	switch (action.type) {
		case Actions.LOGIN:
			return {
				...state,
				users: action.payload,
				app_token: action.payload.token,
				emp_id: action.payload.emp_id,
				emp_name: action.payload.first_name,
				currency: action.payload.currency,
				city_id: action.payload.city_id,
				isLogedIn: true
			};

		case Actions.VIEW_USER:
			return {
				...state,
				current_user: action.payload
			};
		case Actions.VIEW_ATTENDANCE:
			return {
				...state,
				attendance: action.payload
			};
		case Actions.CHECK_STATUS:
				return {
					...state,
					login_status: action.payload
				};
		case Actions.CAPTURE:
			return {
				...state,
				marked_attendance: true,
				login_status: action.payload
			}				
		case Actions.EDIT_USER:
			return {
				...state,
				current_user: action.payload,
				isAdded: true,
			}
		case Actions.PASSWORD_CHANGE:
			return {
				...state,
				isPasswordChanged: true,
				
			}
		case Action.FORGOT_PASSWORD:
			return {
				...state,
				isSentPassword: true,
			}	
		case Actions.WRONG_PASSWORD:
			return {
				...state,
				isWrongPassword: true,
			}		
		case Actions.DISMISS:
			return {
				...state,
				isAdded: false,
				isWrongPassword: false,
				isSentPassword: false,
				isPasswordChanged: false,
				marked_attendance: false
			}
		case Actions.DELETE:
			return {
				...state,
				users: action.payload
			}	
		case Actions.FETCHING:
			return initialState;

		case Actions.LOGOUT:
			return {
				initialState,
			}
	 
		default:
			return state;
	}
}