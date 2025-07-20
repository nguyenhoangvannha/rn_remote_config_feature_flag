var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import remoteConfig from '@react-native-firebase/remote-config';
import { setFeatures } from '../redux/slice';
export class FeatureConfig {
    constructor(initialFeatures, { fetchExpiration = 60 * 1000, fetchMaxInterval = 5 * 60 * 60 * 1000, } = {}) {
        this.features = Object.fromEntries(initialFeatures.map((f) => [f.key, f]));
        this.fetchExpiration = fetchExpiration;
        this.fetchMaxInterval = fetchMaxInterval;
    }
    static createInstance(initialFeatures, config) {
        if (!FeatureConfig._instance) {
            FeatureConfig._instance = new FeatureConfig(initialFeatures, config);
        }
        else {
            console.warn('[FeatureConfig] Instance already created.');
        }
        return FeatureConfig._instance;
    }
    static get instance() {
        if (!FeatureConfig._instance) {
            throw new Error('FeatureConfig not initialized. Call createInstance first.');
        }
        return FeatureConfig._instance;
    }
    init(dispatch) {
        return __awaiter(this, void 0, void 0, function* () {
            yield remoteConfig().setConfigSettings({
                minimumFetchIntervalMillis: this.fetchMaxInterval,
                fetchTimeMillis: this.fetchExpiration,
            });
            this.unsubscribe = remoteConfig().onConfigUpdated((event) => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.info('ME Remote config onConfigUpdated:', (event === null || event === void 0 ? void 0 : event.updatedKeys) || []);
                    yield remoteConfig().fetchAndActivate();
                    for (const key of (event === null || event === void 0 ? void 0 : event.updatedKeys) || []) {
                        if (this.features[key]) {
                            this.features = Object.assign(Object.assign({}, this.features), { [key]: {
                                    key,
                                    boolValue: remoteConfig().getBoolean(key),
                                    stringValue: remoteConfig().getString(key),
                                } });
                        }
                    }
                    dispatch(setFeatures(this.features));
                    console.info('ME Remote config updated:', this.features);
                }
                catch (error) {
                    console.error('Remote config error:', error);
                }
            }));
            yield this.syncRemote(dispatch);
        });
    }
    syncRemote(dispatch) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield remoteConfig().fetchAndActivate();
                for (const key in this.features) {
                    this.features[key] = Object.assign(Object.assign({}, this.features[key]), { boolValue: remoteConfig().getBoolean(key), stringValue: remoteConfig().getString(key) });
                }
                dispatch(setFeatures(this.features));
            }
            catch (err) {
                console.error('Fetch remote config failed:', err);
            }
        });
    }
    isEnabled(key) {
        var _a, _b;
        return (_b = (_a = this.features[key]) === null || _a === void 0 ? void 0 : _a.boolValue) !== null && _b !== void 0 ? _b : false;
    }
    destroy() {
        var _a;
        (_a = this.unsubscribe) === null || _a === void 0 ? void 0 : _a.call(this);
    }
}
FeatureConfig._instance = null;
