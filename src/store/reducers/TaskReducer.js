import Actions from '../actions/Actions';

const initialState = {
	tasks: [],
	picktask:[],
	isAdded: false,
	isAccepted: false,
	isFinished: false,
	isUpdated: false,
	ratio: [],
	clients: [],
	group_task_clients: [],
	image_uri: null,
};

export default function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_CLIENTS:
			return {
				...state,
				clients: action.payload
			};
		case Actions.VIEW_GROUP_TASK_CLIENTS:
			return {
				...state,
				group_task_clients: action.payload
			};	
		case Actions.VIEW_TASK:
			return {
				...state,
				tasks: action.payload
			};
		case Actions.ADD_TASK:
			return {
				...state,
				tasks: action.payload,
				isAdded: true
			};	
		case Actions.GET_TASK_RATIO:
			return {
				...state,
				ratio: action.payload
			};	
		case Actions.PICK_TASK:
			return {
				...state,
				picktask: action.payload
			};
		case Actions.ACCEPT_TASK:
			return {
				...state,
				isAccepted: true,
				tasks: action.payload
			};
		case Actions.UPDATE_TASK_STATUS:
				return {
					...state,
					isUpdated: true,
					tasks: action.payload
				};	
		case Actions.FINISHED_TASK:
			return {
				...state,
				isFinished: true,
				tasks: action.payload
			};	
		case Actions.UPDATE_IMAGE:
			return {
				...state,
				image_uri: action.payload
			}
		case Actions.RESET_IMAGE:
				return {
					...state,
					image_uri: null
				}		
		case Actions.DISMISS:
			return {
				...state,
				isAccepted: false,
				isFinished: false,
				isAdded: false,
				isUpdated: false
			};		
		case Actions.LOGOUT:
			return {
				initialState,
			}	

		default:
			return state;
	}
}