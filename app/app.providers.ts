import { HTTP_PROVIDERS } from '@angular/http';

import { DataService } from './shared/services/data.service';
import { MappingsService } from './shared/services/mappings.service';
import { ItemsService } from './shared/services/items.service';

export const APP_PROVIDERS = [
    DataService,
    ItemsService,
    MappingsService,
    HTTP_PROVIDERS
];