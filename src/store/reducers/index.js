import { combineReducers } from 'redux';

import UserReducer from './UserReducer';
import TaskReducer from './TaskReducer';
import ReportReducer from './ReportReducer';
import ExpensesReducer from './ExpensesReducer';

export default combineReducers({
    userReducer: UserReducer,
    taskReducer: TaskReducer,
    reportsReducer: ReportReducer,
    expensesReducer: ExpensesReducer
});
