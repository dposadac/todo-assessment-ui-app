import { Injectable, signal } from '@angular/core';
import {
  fetchAndActivate,
  getRemoteConfig,
  getString,
  setLogLevel,
  RemoteConfig,
} from 'firebase/remote-config';
import { getFirebaseApp } from '../../data/firebase/firebase.config';

const DEFAULT_CATEGORIES = ['Personal', 'Trabajo', 'Compras', 'Salud', 'Estudio'];
const CATEGORIES_KEY = 'available_categories';

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  private readonly _categories = signal<string[]>(DEFAULT_CATEGORIES);
  private rc: RemoteConfig | null = null;

  readonly categories = this._categories.asReadonly();

  async initialize(): Promise<void> {
    try {
      this.rc = getRemoteConfig(getFirebaseApp());
      this.rc.settings.minimumFetchIntervalMillis = 3600000;
      this.rc.defaultConfig = {
        [CATEGORIES_KEY]: JSON.stringify(DEFAULT_CATEGORIES),
      };
      setLogLevel(this.rc, 'silent');
      await fetchAndActivate(this.rc);
      this._updateCategories();
    } catch {
      this._categories.set(DEFAULT_CATEGORIES);
    }
  }

  private _updateCategories(): void {
    if (!this.rc) return;
    try {
      const raw = getString(this.rc, CATEGORIES_KEY);
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        this._categories.set(parsed);
      }
    } catch {
      this._categories.set(DEFAULT_CATEGORIES);
    }
  }
}
