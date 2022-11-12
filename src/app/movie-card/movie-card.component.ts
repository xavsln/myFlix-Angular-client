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

  getMovies(): void {
    // console.log('Token from getMovies: ', this.token);
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
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

  // Check whether a Movie is in the user's list of favorite movies
  isFav(id: string): boolean {
    return this.favoriteMovies.includes(id);
  }

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
}
