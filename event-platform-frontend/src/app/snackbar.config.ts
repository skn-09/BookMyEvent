import { MatSnackBarConfig } from '@angular/material/snack-bar';

export const defaultSnackBarConfig: MatSnackBarConfig = {
  duration: 3000,
  horizontalPosition: 'right',
  verticalPosition: 'top',
  panelClass: ['custom-snackbar'],
};
