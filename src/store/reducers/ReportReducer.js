import Actions from '../actions/Actions';

const initialState = {
	reports: [],
};

export default function(state = initialState, action) {
	switch (action.type) {
		case Actions.VIEW_REPORTS:
			return {
				...state,
				reports: action.payload
			};
			
		case Actions.LOGOUT:
			return {
				initialState,
			}	

		default:
			return state;
	}
}