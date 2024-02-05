import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlyNumberInputDirective } from './only-number-input.directive';

@NgModule({
  declarations: [OnlyNumberInputDirective],
  imports: [CommonModule],
  exports: [OnlyNumberInputDirective],
})
export class DirectivesModule {}
