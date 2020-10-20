import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainContainerComponent } from './home/main-container/main-container.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { AppDetailsComponent } from './home/app-details/app-details.component';
import { AppSpecComponent } from './home/app-spec/app-spec.component';

export const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full'},
  { path: 'main', component: MainContainerComponent },
  { path: 'about', component: AppDetailsComponent  },
  { path: 'spec', component: AppSpecComponent  },
  { path: '**',   component: PageNotFoundComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
