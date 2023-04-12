import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import myAxios from "./myAxios";

export const myDashboard = createAsyncThunk(
  "freelancer/myDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get("/freelancer/dashboard", {
        headers: {
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

export const myServices = createAsyncThunk(
  "freelancer/myServices",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get("/freelancer/myServices", {
        headers: {
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

export const showService = createAsyncThunk(
  "freelancer/showService",
  async (serviceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get(`/freelancer/service/${serviceId}`, {
        headers: {
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

export const createService = createAsyncThunk(
  "freelancer/createService",
  async (body, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.post(`/freelancer/service`, body, {
        headers: {
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

export const updateService = createAsyncThunk(
  "freelancer/updateService",
  async ({ serviceId, body }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.put(`/freelancer/service/${serviceId}`, body, {
        headers: {
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

export const deleteService = createAsyncThunk(
  "freelancer/deleteService",
  async (serviceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.delete(`/freelancer/service/${serviceId}`, {
        headers: {
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

const freelancerSlice = createSlice({
  name: "freelancer",
  initialState: {
    data: [],
    error: null,
  },
  extraReducers: (builder) => {
    // Get Freelancer Dashboard
    builder.addCase(myDashboard.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(myDashboard.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Get Freelancer Services
    builder.addCase(myServices.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(myServices.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Show Service Info
    builder.addCase(showService.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(showService.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Create Freelancer Service
    builder.addCase(createService.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(createService.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Edit Freelancer Service
    builder.addCase(updateService.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(updateService.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Delete Freelancer Service
    builder.addCase(deleteService.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(deleteService.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export default freelancerSlice.reducer;
