import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { GenreComponent } from '../genre/genre.component';

import { DirectorComponent } from '../director/director.component';

import { SynopsisComponent } from '../synopsis/synopsis.component';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: any[] = [];
  favoriteMovies: any[] = [];
  // token: any = localStorage.getItem('token');

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog
  ) {}

  // Called when Angular is done creating the component
  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }

  /**
   * Gets all movies data from the API
   * @returns An array of movies objects
   * @function getAllMovies
   */
  getMovies(): void {
    // console.log('Token from getMovies: ', this.token);
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Gets favorite movies from API call and sets the favorite movies variable to return JSON file
   * @returns An array of favorite movies ids
   * @function getFavoriteMovies
   */
  getFavoriteMovies(): void {
    this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
      console.log("User's list of favorite movies: ", resp.FavoriteMovies);
      this.favoriteMovies = resp.FavoriteMovies;
      return this.favoriteMovies;
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

  /**
   * Check whether a Movie is in the user's list of favorite movies
   * @param id
   * @returns true in case the movie is included in the list of favorite movies otherwise it returns false
   */
  isFav(id: string): boolean {
    return this.favoriteMovies.includes(id);
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
}
