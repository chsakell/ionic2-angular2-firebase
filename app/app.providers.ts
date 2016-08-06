import { HTTP_PROVIDERS } from '@angular/http';

import { DataService } from './shared/services/data.service';

export const APP_PROVIDERS = [
    DataService,
    HTTP_PROVIDERS
];