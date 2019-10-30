
import store from '../Stores';

// [Production Server ]
export const BASE_URL = 'http://salesapp.benzyinfotech.com/sales_engine/api/'; // live Server

// [Development Server]
// export const BASE_URL = 'http://13.233.124.16/beta/sales/sales_engine/api/'; 

// [Local Server]
// export const BASE_URL = 'http://localhost:8888/sales_engine/api/'

//APP Access
export const COUNTRY = "IN";

export const APP_TOKEN = () => {
    const current_state = store.getState();
    const { app_token } = current_state.userReducer;
    return app_token;
};

export const EMP_ID = () => {
    const current_state = store.getState();
    const { emp_id } = current_state.userReducer;
    return emp_id;
};

export const EMP_NAME = () => {
    const current_state = store.getState();
    const { emp_name } = current_state.userReducer;
    return emp_name;    
};

export const CURRENCY = () => {
    const current_state = store.getState();
    const { currency } = current_state.userReducer;
    return currency;
};

export const CITY_ID = () => {
    const current_state = store.getState();
    const { city_id } = current_state.userReducer;
    return city_id;
};

export const PRINT = (obj) => {
    console.log("====================================================\n");
    console.log(obj);
    console.log("====================================================\n");
}

