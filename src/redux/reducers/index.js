// src/redux/reducers/index.js

import { combineReducers } from 'redux';
import authReducer from './authReducer';  // Import the auth reducer

const rootReducer = combineReducers({
  auth: authReducer,  // Add your auth reducer
});

export default rootReducer;
