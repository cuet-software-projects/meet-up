import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slice/AuthSlice";
import { meetingsSlice } from "./slice/MeetingSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    meetings: meetingsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
