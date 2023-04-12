import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./UserSlice";
import freelancerSlice from "./FreelancerSlice";
import clientSlice from "./ClientSlice";
import chatSlice from "./ChatSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    freelancer: freelancerSlice,
    client: clientSlice,
    chat: chatSlice,
  },
});
