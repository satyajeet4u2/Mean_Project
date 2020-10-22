import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatCardModule, MatDialogModule,
  MatExpansionModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ]
})
export class AngularMaterialModule {

}
