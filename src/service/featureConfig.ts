import remoteConfig from '@react-native-firebase/remote-config';
import { Dispatch } from 'redux';
import { Feature } from '../entities/feature';
import { setFeatures } from '../redux/slice';

export class FeatureConfig {
  private features: Record<string, Feature>;
  private fetchExpiration: number;
  private fetchMaxInterval: number;
  private unsubscribe?: () => void;

  private constructor(
    initialFeatures: Feature[],
    {
      fetchExpiration = 60 * 1000,
      fetchMaxInterval = 5 * 60 * 60 * 1000,
    }: { fetchExpiration?: number; fetchMaxInterval?: number } = {}
  ) {
    this.features = Object.fromEntries(
      initialFeatures.map((f) => [f.key, f])
    );
    this.fetchExpiration = fetchExpiration;
    this.fetchMaxInterval = fetchMaxInterval;
  }

  private static _instance: FeatureConfig | null = null;

  public static createInstance(
    initialFeatures: Feature[],
    config?: { fetchExpiration?: number; fetchMaxInterval?: number }
  ) {
    if (!FeatureConfig._instance) {
      FeatureConfig._instance = new FeatureConfig(initialFeatures, config);
    } else {
      console.warn('[FeatureConfig] Instance already created.');
    }
    return FeatureConfig._instance;
  }
  public static get instance(): FeatureConfig {
    if (!FeatureConfig._instance) {
      throw new Error('FeatureConfig not initialized. Call createInstance first.');
    }
    return FeatureConfig._instance;
  }

  async init(dispatch: Dispatch) {
    await remoteConfig().setConfigSettings({
      minimumFetchIntervalMillis: this.fetchMaxInterval,
      fetchTimeMillis: this.fetchExpiration,
    });

    this.unsubscribe = remoteConfig().onConfigUpdated(async (event) => {
      try {
        console.info('ME Remote config onConfigUpdated:', event?.updatedKeys || []);
        await remoteConfig().fetchAndActivate();
        for (const key of event?.updatedKeys || []) {
          if (this.features[key]) {
            this.features = {
              ...this.features,
              [key]: {
                key,
                boolValue: remoteConfig().getBoolean(key),
                stringValue: remoteConfig().getString(key),
              },
            };
          }
        }
        dispatch(setFeatures(this.features));
        console.info('ME Remote config updated:', this.features);
      } catch (error) {
        console.error('Remote config error:', error);
      }
    });

    await this.syncRemote(dispatch);
  }

  async syncRemote(dispatch: Dispatch) {
    try {
      await remoteConfig().fetchAndActivate();
      for (const key in this.features) {
        this.features[key] = {
          ...this.features[key],
          boolValue: remoteConfig().getBoolean(key),
          stringValue: remoteConfig().getString(key),
        };
      }
      dispatch(setFeatures(this.features));
    } catch (err) {
      console.error('Fetch remote config failed:', err);
    }
  }

  isEnabled(key: string): boolean {
    return this.features[key]?.boolValue ?? false;
  }

  destroy() {
    this.unsubscribe?.();
  }
}
