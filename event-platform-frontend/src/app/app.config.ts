import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig = {
  providers: [provideHttpClient(withInterceptors([AuthInterceptor]))],
};
