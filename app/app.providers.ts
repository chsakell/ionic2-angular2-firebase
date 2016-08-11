import { HTTP_PROVIDERS } from '@angular/http';

import { AuthService } from './shared/services/auth.service';
import { DataService } from './shared/services/data.service';
import { MappingsService } from './shared/services/mappings.service';
import { ItemsService } from './shared/services/items.service';

export const APP_PROVIDERS = [
    AuthService,
    DataService,
    ItemsService,
    MappingsService,
    HTTP_PROVIDERS
];