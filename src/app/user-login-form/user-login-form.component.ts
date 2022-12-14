import { Component, OnInit, Input } from '@angular/core';

// Use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// Use this import to bring in the API calls
import { FetchApiDataService } from '../fetch-api-data.service';

// Use this import to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  /**
   * Makes an API call to log in the user. If successful, user will receive a token and store it in local storage as well as username and userId information. If not successful, a message will be displayed.
   * @function userLogin
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        // In case login is successful, below code will be executed
        this.dialogRef.close(); // This will close the modal on success!
        // Add username and token to localStorage
        console.log(result);
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', result.user.Username);
        localStorage.setItem('userId', result.user._id);

        this.snackBar.open('User Login successful!', 'OK', {
          duration: 2000,
        });
        this.router.navigate(['movies']);
      },
      (result) => {
        this.snackBar.open('User Login failed', 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
