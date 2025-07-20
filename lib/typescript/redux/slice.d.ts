import { Feature } from '../entities/feature';
type FeatureConfigState = {
    features: Record<string, Feature>;
};
export declare const setFeatures: import("@reduxjs/toolkit").ActionCreatorWithPayload<Record<string, Feature>, "featureConfig/setFeatures">;
export declare const featureConfigReducer: import("redux").Reducer<FeatureConfigState>;
export {};
