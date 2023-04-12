import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import myAxios from "./myAxios";

// Token Exists In Local Storage
export const tokenExists = async (stateToken, navigate, dispatch) => {
  if (stateToken == null) {
    const localStorageToken = localStorage.getItem("token");
    const localStorageUser = JSON.parse(localStorage.getItem("userInfo"));
    if (localStorageToken) {
      dispatch(setToken(localStorageToken));
      dispatch(setAvatar(localStorageUser.image));
      dispatch(setUserId(localStorageUser._id));
      dispatch(setUserRole(localStorageUser.role));
      return true;
    }
    return false;
  }
};
// Register User
export const signUp = createAsyncThunk(
  "user/register",
  async (body, { rejectWithValue }) => {
    try {
      const res = await myAxios.post("/user/register", body);
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);
// Login User
export const login = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const newData = JSON.stringify(data);
      const res = await myAxios.post("/user/login", newData, {
        headers: { "Content-type": "application/json" },
      });
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);
// Update User
export const update = createAsyncThunk(
  "user/update",
  async (body, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.put("/user/update", body, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedUser: null,
    token: null,
    avatar: "",
    data: [],
    role: null,
    error: null,
  },
  reducers: {
    setUserId: (state, action) => {
      state.loggedUser = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    setUserRole: (state, action) => {
      state.role = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Sign Up
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Login User
    builder.addCase(login.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Update User
    builder.addCase(update.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(update.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export const { setUserId, setToken, setAvatar, setUserRole } = userSlice.actions;

export default userSlice.reducer;