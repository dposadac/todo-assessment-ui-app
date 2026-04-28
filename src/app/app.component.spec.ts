import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, IonicModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have ion-menu in the template', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const menu = fixture.nativeElement.querySelector('ion-menu');
    expect(menu).toBeTruthy();
  });
});
