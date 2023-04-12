import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import myAxios from "./myAxios";

export const myDashboard = createAsyncThunk(
  "client/myDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get("/client/dashboard", {
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

export const freelancersServices = createAsyncThunk(
  "client/allServices",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get("/client/allServices", {
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

export const serviceInfo = createAsyncThunk(
  "client/serviceInfo",
  async (serviceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get(`/client/service/${serviceId}`, {
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

export const getOrders = createAsyncThunk(
  "client/getOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get(`/client/orders`, {
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

export const orderInfo = createAsyncThunk(
  "client/orderInfo",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get(`/client/order/${orderId}`, {
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

export const makeOrder = createAsyncThunk(
  "client/makeOrder",
  async (serviceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.post(
        `/client/order`,
        { serviceId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "client/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.put(
        `/client/order/${orderId}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const makeTestimonial = createAsyncThunk(
  "client/makeTestimonial",
  async ({ orderId, text, rating }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.post(
        `/client/testimonial/${orderId}`,
        { text, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);
const clientSlice = createSlice({
  name: "client",
  initialState: {
    data: [],
    error: null,
  },
  extraReducers: (builder) => {
    // Get Client Dashboard
    builder.addCase(myDashboard.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(myDashboard.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Get Freelancers Services
    builder.addCase(freelancersServices.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(freelancersServices.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Get Service Info
    builder.addCase(serviceInfo.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(serviceInfo.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Get Orders Info
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(getOrders.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Get Order Info
    builder.addCase(orderInfo.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(orderInfo.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Make Order
    builder.addCase(makeOrder.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(makeOrder.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Update Order Status
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(updateOrderStatus.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Make Testimonial
    builder.addCase(makeTestimonial.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(makeTestimonial.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export default clientSlice.reducer;
