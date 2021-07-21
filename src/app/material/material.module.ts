import { ModuleWithProviders, NgModule } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconRegistry} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';

const MaterialComponents = [
  MatMenuModule,
  MatIconModule,
  MatDialogModule
]
@NgModule({
  declarations: [],
  imports: [
    MaterialComponents
  ],
  exports: [
    MaterialComponents
  ]
})
export class MaterialModule {
  constructor(public matIconRegistry: MatIconRegistry) {
    // matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
}

static forRoot(): ModuleWithProviders<MaterialModule> {
    return {
        ngModule: MaterialModule,
        providers: [MatIconRegistry]
    };
}
 }
