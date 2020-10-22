import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './header/header.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModules} from './app-routing.modules';
import {HoverHighlightDirective} from './directives/hover-highlight.directive';
import {HighlightDirective} from './directives/highlight.directive';
import {AuthInterceptor} from './auth/auth-interceptor';
import {CommonDialogConfirmationComponent} from './common component/common-dialog-confirmation/common-dialog-confirmation.component';
import {ErrorInterceptor} from './error-interceptor';
import {ErrorComponent} from './error/error.component';
import {AngularMaterialModule} from './angular-material.module';
import {PostModule} from './posts/post.module';
import {AuthModule} from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HighlightDirective,
    HoverHighlightDirective,
    CommonDialogConfirmationComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModules,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}],
  bootstrap: [AppComponent],
  entryComponents: [CommonDialogConfirmationComponent, ErrorComponent]
})
export class AppModule {
}
