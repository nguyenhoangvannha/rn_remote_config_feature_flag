import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Feature } from '../entities/feature';

type FeatureConfigState = {
  features: Record<string, Feature>;
};

const initialState: FeatureConfigState = {
  features: {},
};

const featureConfigSlice = createSlice({
  name: 'featureConfig',
  initialState,
  reducers: {
    setFeatures(state, action: PayloadAction<Record<string, Feature>>) {
      state.features = action.payload;
    },
  },
});

export const { setFeatures } = featureConfigSlice.actions;
export const featureConfigReducer = featureConfigSlice.reducer;
