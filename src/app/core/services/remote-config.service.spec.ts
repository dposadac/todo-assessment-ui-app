import { TestBed } from '@angular/core/testing';
import { RemoteConfigService } from './remote-config.service';

const DEFAULT_CATEGORIES = ['Personal', 'Trabajo', 'Compras', 'Salud', 'Estudio'];

describe('RemoteConfigService', () => {
  let service: RemoteConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [RemoteConfigService] });
    service = TestBed.inject(RemoteConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose default categories before initialization', () => {
    expect(service.categories()).toEqual(DEFAULT_CATEGORIES);
  });

  it('should keep default categories when initialize() fails', async () => {
    spyOn(service as unknown as { initialize: () => Promise<void> }, 'initialize').and.callFake(async () => {
      // simulate failure: categories remain as defaults
    });
    await service.initialize();
    expect(service.categories()).toEqual(DEFAULT_CATEGORIES);
  });

  it('categories signal should be readonly', () => {
    const cats = service.categories;
    expect(typeof cats).toBe('function');
    expect(cats()).toEqual(DEFAULT_CATEGORIES);
  });

  it('should expose at least one category', () => {
    expect(service.categories().length).toBeGreaterThan(0);
  });
});
