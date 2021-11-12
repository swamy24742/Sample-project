import { InjectionToken } from '@angular/core';

export class AppConfig {
    appCredentials: any;
    enums:any;
    appConstants:any;
}

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config')