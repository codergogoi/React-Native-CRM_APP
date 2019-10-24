import Actions from '../actions/Actions';

const initialState = {
	expenses: [],
	tasks: [],
	isAdded: false,
 
};

export default function(state = initialState, action) {
	switch (action.type) {
		 
		case Actions.VIEW_MY_TASK:
			return {
				...state,
				tasks: action.payload
			};
		case Actions.VIEW_EXPENSES:
			return {
				...state,
				expenses: action.payload
			};
		case Actions.EDIT_EXPENSES:
			return {
				...state,
				expenses: action.payload,
				isAdded: true,
			}
		 
		case Actions.ADD_EXPENSES:
			return {
                ...state,
                expenses: action.payload,
				isAdded: true,
			}		
		case Actions.DISMISS:
			return {
				...state,
				isAdded: false,
			}
		case Actions.DELETE_EXPENSES:
			return {
				...state,
				expenses: action.payload
			}	

		case Actions.LOGOUT:
			return {
				initialState,
			}
	 
		default:
			return state;
	}
}