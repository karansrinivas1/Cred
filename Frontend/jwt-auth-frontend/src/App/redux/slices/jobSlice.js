import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../../services/api';

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async () => {
    const response = await axios.get('/job/jobs');
    return response.data;
});

export const addJob = createAsyncThunk('jobs/addJob', async (jobData) => {
    const response = await api.post('/job/create/job', jobData); // Adjust endpoint based on your backend
    return response.data.job; // Ensure response format matches your backend's output
});

const jobSlice = createSlice({
    name: 'jobs',
    initialState: {
        jobs: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobs.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload;
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addJob.fulfilled, (state, action) => {
                state.jobs.push(action.payload);
            });
    },
});

export default jobSlice.reducer;
