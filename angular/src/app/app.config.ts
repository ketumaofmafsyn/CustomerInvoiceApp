import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';

// ABP MODULES
import { CoreModule } from '@abp/ng.core';
import { ThemeSharedModule } from '@abp/ng.theme.shared';
import { AbpOAuthModule } from '@abp/ng.oauth';
import { AccountConfigModule } from '@abp/ng.account/config';
import { IdentityConfigModule } from '@abp/ng.identity/config';
import { TenantManagementConfigModule } from '@abp/ng.tenant-management/config';
import { SettingManagementConfigModule } from '@abp/ng.setting-management/config';
import { FeatureManagementModule } from '@abp/ng.feature-management';
import { ThemeLeptonXModule } from '@abp/ng.theme.lepton-x';
import { SideMenuLayoutModule } from '@abp/ng.theme.lepton-x/layouts';
// ✅ CRITICAL: Add this import


import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';
import { APP_ROUTE_PROVIDER } from './route.provider';

export function registerLocales(locale: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      if (locale === 'en') registerLocaleData(localeEn, 'en');
      if (locale === 'es') registerLocaleData(localeEs, 'es');
    } catch (e) {
      console.warn('Locale registration failed:', e);
    }
    resolve();
  });
}

export const appConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    
    importProvidersFrom(
      CoreModule.forRoot({
        environment,
        registerLocaleFn: registerLocales
      }),
      AbpOAuthModule.forRoot(),
      ThemeSharedModule.forRoot(),
      AccountConfigModule.forRoot(),
      IdentityConfigModule.forRoot(),
      TenantManagementConfigModule.forRoot(),
      SettingManagementConfigModule.forRoot(),
      FeatureManagementModule.forRoot(),
      ThemeLeptonXModule.forRoot(),
      SideMenuLayoutModule.forRoot()
    ),
    
    provideRouter(appRoutes),
    APP_ROUTE_PROVIDER // ✅ CRITICAL: MUST BE HERE (enforces auth guards)
  ]
};