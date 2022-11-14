import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { MatDialog } from '@angular/material/dialog';

import { EditProfileComponent } from '../edit-profile/edit-profile.component';

import { GenreComponent } from '../genre/genre.component';

import { DirectorComponent } from '../director/director.component';

import { SynopsisComponent } from '../synopsis/synopsis.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  movies: any[] = [];
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getFavoriteMovies();
    this.getFavoriteMoviesData();
  }

  /**
   * Gets user data from api call and sets the user variable to returned JSON file
   * @returns object holding user information
   * @function getUser
   */
  getUser(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      // console.log('Data fetched from the API using getUser: ', resp);
      return this.user;
    });
  }

  /**
   * Deletes user data from api call and removes data from local storage
   * @function deleteUser
   */
  deleteProfile(): void {
    if (confirm('Are you sure you want to delete your account?')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open('Account successfully deleted!', 'OK', {
          duration: 2000,
        });
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
        localStorage.clear();
      });
    }
  }
  /**
   * Opens the selected user dialog from EditProfileComponent to edit user's details
   */
  openEditProfileDialog(): void {
    this.dialog.open(EditProfileComponent, {
      width: '500px',
    });
  }

  /**
   * Gets favorite movies from api call and sets the favorite movies variable to return JSON file
   * @function getFavoriteMovies
   */
  getFavoriteMovies(): void {
    this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
      console.log("User's list of favorite movies: ", resp.FavoriteMovies);
      this.favoriteMovies = resp.FavoriteMovies;
      this.getFavoriteMoviesData();
      return this.favoriteMovies;
    });
  }

  /**
   * Check whether a Movie is in the user's list of favorite movies
   * @param id
   * @returns true in case the movie is included in the list of favorite movies otherwise it returns false
   */
  isFav(id: string): boolean {
    return this.favoriteMovies.includes(id);
  }

  /**
   * Gets complete data (title, director, etc...) for the favorite movies listed in the user's list of favorite movies
   * @returns an array of movies objects
   */
  getFavoriteMoviesData(): void {
    // This function filters the movies from the movies' list that correspond to the movieId of favorites
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp.filter((m: any) =>
        this.favoriteMovies.includes(m._id)
      );
      console.log('From getFavoriteMoviesData', this.movies);
      return this.movies;
    });
  }

  /**
   * Adds the selected movie to the user's list of favorite movies using an API call
   * @param id
   * @function addMovieToFav
   */
  addToFavoriteMovies(id: string): void {
    console.log(id);
    this.fetchApiData.addMovieToFav(id).subscribe((result) => {
      console.log(result);
      this.ngOnInit();
    });
  }

  /**
   * Removes the selected movie from the user's list of favorite movies using an API call
   * @param id
   * @function deleteMovieFromFav
   */
  removeFromFavoriteMovies(id: string): void {
    console.log(id);
    this.fetchApiData.deleteMovieFromFav(id).subscribe((result) => {
      console.log(result);
      this.ngOnInit();
    });
  }

  /**
   * Opens the selected movie genre dialog from GenreComponent to display movie's genre details
   * @param name
   * @param description
   */
  openGenreDialog(name: string, description: string): void {
    // console.log('This should open the genre dialog');
    this.dialog.open(GenreComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '500px',
    });
  }

  /**
   * Opens the selected movie director dialog from DirectorComponent to display movie's director details
   * @param name
   * @param bio
   */
  openDirectorDialog(name: string, bio: string): void {
    this.dialog.open(DirectorComponent, {
      data: {
        Name: name,
        Bio: bio,
      },
      width: '500px',
    });
  }

  /**
   * Opens the selected movie synopsis dialog from SynopsisComponent to display movie's synopsis details
   * @param title
   * @param description
   */
  openSynopsisDialog(title: string, description: string): void {
    this.dialog.open(SynopsisComponent, {
      data: {
        Title: title,
        Description: description,
      },
      width: '500px',
    });
  }
}
