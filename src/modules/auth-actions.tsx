import axios, { AxiosError } from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

interface AuthInterface {
  login: string,
  password: string,
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: AuthInterface, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      await axios.post(
        `/api/register`,
        credentials,
        config
      )
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        return;
      }

      if (error.response && error.response.data.message) {
        console.log("1", rejectWithValue(error.response.data.message))
        return rejectWithValue(error.response.data.message)
      } else {
        console.log("2", rejectWithValue(error.message))
        return rejectWithValue(error.message)
      }
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: AuthInterface, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const { data } = await axios.post(
        `/api/login`,
        credentials,
        config
      )
      localStorage.setItem('userName', data.login)
      localStorage.setItem('userToken', data.access_token)
      localStorage.setItem('userRole', data.role)
      localStorage.setItem("requestStatus", '')
      localStorage.setItem("orbitName", '')
      localStorage.setItem("OrbitIncl", '')
      localStorage.setItem("orbitIsCircle", '')
      return data
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        return;
      }

      if (error.response && error.response.data.message) {
        console.log("1", rejectWithValue(error.response.data.message))
        return rejectWithValue(error.response.data.message)
      } else {
        console.log("2", rejectWithValue(error.message))
        return rejectWithValue(error.message)
      }
    }
  });

export const logoutUser = createAsyncThunk(
  '/auth/logout',
  async (userToken: string, { rejectWithValue }) => {
    try {
      localStorage.setItem('userToken', '')
      localStorage.setItem('userName', '')
      localStorage.setItem('userRole', '0')
      localStorage.setItem('orbits', '')
      localStorage.setItem("requestStatus", '')
      localStorage.setItem("orbitName", '')
      localStorage.setItem("OrbitIncl", '')
      localStorage.setItem("orbitIsCircle", '')
      localStorage.setItem("reqID", '')


      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken,
        },
      }
      const { data } = await axios.post(
        `/api/logout`,
        {},
        config
      )

      window.location.reload()
      return data;
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        return;
      }

      if (error.response && error.response.data.message) {
        console.log("1", rejectWithValue(error.response.data.message))
        return rejectWithValue(error.response.data.message)
      } else {
        console.log("2", rejectWithValue(error.message))
        return rejectWithValue(error.message)
      }
    }
  }
);