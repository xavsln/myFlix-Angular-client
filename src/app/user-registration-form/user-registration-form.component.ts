import { Component, OnInit, Input } from '@angular/core';
// To close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// Import brings in the API calls
import { FetchApiDataService } from '../fetch-api-data.service';

// Import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})
export class UserRegistrationFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  /**
   * Makes an API call to register the user.
   * @function userRegistration
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (result) => {
        // Logic for a successful user registration
        this.dialogRef.close(); // This will close the modal on success
        this.snackBar.open('Registration successful!', 'OK', {
          duration: 2000,
        });
      },
      (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
