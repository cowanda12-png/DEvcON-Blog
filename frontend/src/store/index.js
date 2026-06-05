import { configureStore } from "@reduxjs/toolkit";
import prodSlice from "./prodRoute.js";
import authSlice from "./auth.js";
import userSlice from "./user.js"

const store = configureStore({
    reducer: {
        prod: prodSlice,
        auth: authSlice,
        user: userSlice,
    }
});

export default store;