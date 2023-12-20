import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavBarRoutingModule } from './nav-bar-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { NavBarComponent } from './nav-bar.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatMenuModule, NavBarRoutingModule, TranslateModule.forChild()],
})
export class NavBarModule {}
