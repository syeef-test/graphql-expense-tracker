// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: null,
//   isLoading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setAuthUser: (state, action) => {
//       state.user = action.payload;
//       state.isLoading = false;
//       state.error = null;
//     },
//     setLoading: (state) => {
//       state.isLoading = true;
//     },
//     setError: (state, action) => {
//       state.error = action.payload;
//       state.isLoading = false;
//     },
//     logoutSuccess: (state) => {
//       state.user = null;
//       state.isLoading = false;
//       state.error = null;
//     },
//   },
// });

// export const { setAuthUser, setLoading, setError, logoutSuccess } =
//   authSlice.actions;
// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      console.log(
        "[authSlice] setAuthUser action called with payload:",
        action.payload
      );
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
      console.log("[authSlice] New state after setAuthUser:", state);
    },
    setLoading: (state) => {
      console.log("[authSlice] setLoading action called");
      state.isLoading = true;
      console.log("[authSlice] New state after setLoading:", state);
    },
    setError: (state, action) => {
      console.log(
        "[authSlice] setError action called with payload:",
        action.payload
      );
      state.error = action.payload;
      state.isLoading = false;
      console.log("[authSlice] New state after setError:", state);
    },
    logoutSuccess: (state) => {
      console.log("[authSlice] logoutSuccess action called");
      state.user = null;
      state.isLoading = false;
      state.error = null;
      console.log("[authSlice] New state after logoutSuccess:", state);
    },
  },
});

export const { setAuthUser, setLoading, setError, logoutSuccess } =
  authSlice.actions;
export default authSlice.reducer;
