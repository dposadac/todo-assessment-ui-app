import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  MenuController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
  ],
  template: `
    <ion-app>
      <ion-menu contentId="main-content">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>MENU</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-item button (click)="onListaTareas()">
              <ion-label>- LISTA TAREAS</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>

      <ion-router-outlet id="main-content" />
    </ion-app>
  `,
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly menuCtrl = inject(MenuController);

  async onListaTareas(): Promise<void> {
    await this.menuCtrl.close();
    this.router.navigateByUrl('/todos');
  }
}
