import { Dispatch } from 'redux';
import { Feature } from '../entities/feature';
export declare class FeatureConfig {
    private features;
    private fetchExpiration;
    private fetchMaxInterval;
    private unsubscribe?;
    private constructor();
    private static _instance;
    static createInstance(initialFeatures: Feature[], config?: {
        fetchExpiration?: number;
        fetchMaxInterval?: number;
    }): FeatureConfig;
    static get instance(): FeatureConfig;
    init(dispatch: Dispatch): Promise<void>;
    syncRemote(dispatch: Dispatch): Promise<void>;
    isEnabled(key: string): boolean;
    destroy(): void;
}
