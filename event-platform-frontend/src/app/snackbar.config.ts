import { MatSnackBarConfig } from '@angular/material/snack-bar';

export const defaultSnackBarConfig: MatSnackBarConfig = {
  duration: 3000, // Auto-close after 3s
  horizontalPosition: 'right', // left | center | right
  verticalPosition: 'top', // top | bottom
  panelClass: ['custom-snackbar'], // custom CSS class (optional)
};
