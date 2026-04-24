import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  employer: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      if (action.payload.isEmployer) {
        state.employer = action.payload.user;
        state.user = null; // An employer is not a regular user
      } else {
        state.user = action.payload.user; // Correctly extract the user object
        state.employer = null;
      }
    },

    logout: (state) => {
      state.user = null;
      state.employer = null;
    },

    updateProfile: (state, action) => {
      if (action.payload.employer) {
        state.employer = { ...state.employer, ...action.payload.employer };
      } else if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});


export const { login, logout, updateProfile } = authSlice.actions;

export default authSlice.reducer;