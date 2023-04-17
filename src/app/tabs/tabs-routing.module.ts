import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'account',
        loadChildren: () =>
          import('../pages/secure/account/account.module').then(
            (m) => m.AccountPageModule
          ),
      },
      {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full',
      },
      {
        path: 'weather',
        loadChildren: () =>
          import('../pages/secure/weather/weather.module').then(
            (m) => m.WeatherPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
