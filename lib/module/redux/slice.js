import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    features: {},
};
const featureConfigSlice = createSlice({
    name: 'featureConfig',
    initialState,
    reducers: {
        setFeatures(state, action) {
            state.features = action.payload;
        },
    },
});
export const { setFeatures } = featureConfigSlice.actions;
export const featureConfigReducer = featureConfigSlice.reducer;
