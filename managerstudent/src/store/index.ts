import { combineReducers, configureStore,  } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import {
    createStateSyncMiddleware,
    initMessageListener
} from "redux-state-sync";
import authReducer from "./reduces/auth";
import  thunk  from "redux-thunk";
const authPersistConfig = { key: "auth", storage };
const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer)
});

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
});
initMessageListener(store);

export type RootState = ReturnType<typeof store.getState>;
export default store;
export const persistor = persistStore(store);
