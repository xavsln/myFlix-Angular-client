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
    this.getFavoriteMovies();
    this.getFavoriteMoviesData();
    this.getUser();
  }

  getUser(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      // console.log('Data fetched from the API using getUser: ', resp);
      return this.user;
    });
  }

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

  openEditProfileDialog(): void {
    this.dialog.open(EditProfileComponent, {
      width: '500px',
    });
  }

  // Get favorite movies from api call and sets the favorite movies variable to return JSON file
  getFavoriteMovies(): void {
    this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
      console.log("User's list of favorite movies: ", resp.FavoriteMovies);
      this.favoriteMovies = resp.FavoriteMovies;
      return this.favoriteMovies;
    });
  }

  // Check whether a Movie is in the user's list of favorite movies
  isFav(id: string): boolean {
    return this.favoriteMovies.includes(id);
  }

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

  // checkFav(): void {
  //   console.log('Map the favorite movies: ', this.movies);
  // }

  // testFunction(m: any): void {
  //   return m;
  // }

  addToFavoriteMovies(id: string): void {
    console.log(id);
    this.fetchApiData.addMovieToFav(id).subscribe((result) => {
      console.log(result);
      this.ngOnInit();
    });
  }

  removeFromFavoriteMovies(id: string): void {
    console.log(id);
    this.fetchApiData.deleteMovieFromFav(id).subscribe((result) => {
      console.log(result);
      this.ngOnInit();
    });
  }

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

  openDirectorDialog(name: string, bio: string): void {
    this.dialog.open(DirectorComponent, {
      data: {
        Name: name,
        Bio: bio,
      },
      width: '500px',
    });
  }

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
