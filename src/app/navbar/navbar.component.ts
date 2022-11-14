import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit(): void {}

  /**
   * Navigates to all movies page
   */
  goToMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Navigates to user profile page
   */
  goToProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Logs out the user and clears data stored in local storage (username and token)
   */
  logOut(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
  }

  /**
   * Check whether a User is logged in, in order to display or not navbar buttons
   */
  isLoggedIn(): boolean {
    const connectedUser = localStorage.getItem('user') !== null;
    // console.log(connectedUser);
    return connectedUser;
  }
}
