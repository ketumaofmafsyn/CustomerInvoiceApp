import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';

import { CoreModule, ApiInterceptor } from '@abp/ng.core';
import { AbpOAuthModule } from '@abp/ng.oauth';
import { ThemeSharedModule } from '@abp/ng.theme.shared';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule.forRoot(),        // ✅ ABP Core
    AbpOAuthModule.forRoot(),    // ✅ OAuth login
    ThemeSharedModule            // ✅ LoaderBar, InternetStatus, etc
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true } // ✅ Attach tokens
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
