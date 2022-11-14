import { Injectable } from '@angular/core';

// import { catchError } from 'rxjs/internal/operators'; // Proposed code from course shows an error
import { catchError } from 'rxjs/operators';

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

// Declaring the api url that will provide data for the client app
const apiUrl = 'https://themyflixapp.herokuapp.com/';

// Access authorization token from local storage
const token = localStorage.getItem('token');

// Access username from local storage
const user = localStorage.getItem('user');

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  // ------------------------------------------------------
  // Making the api call to the user registration endpoint
  // ------------------------------------------------------
  /**
   * Makes an api call to the user registration endpoint in order to register a new user
   * @returns a new user object in json format
   * @function userRegistration
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  // -----------------------------------------------
  // Making the api call for the user login endpoint
  // -----------------------------------------------
  /**
   * Makes an api call to the user login endpoint in order to login a user
   * @param {any} userDetails
   * @returns a user object in json format
   * @function userLogin
   */
  public userLogin(userDetails: any): Observable<any> {
    // console.log('User details should show here', userDetails);
    return this.http
      .post(`${apiUrl}login`, userDetails)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }

  // -----------------------------------------------
  // Making the api call for the All Movies endpoint
  // -----------------------------------------------
  /**
   * Gets all movies data from the API
   * @returns An array of movies objects
   * @function getAllMovies
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    // console.log('Token from getAllMovies', token);
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // -----------------------------------------------
  // Making the api call for a Single Movie endpoint
  // -----------------------------------------------
  /**
   * Gets a single movie data from the API
   * @params {string} title
   * @returns A movie object
   * @function getSingleMovie
   */
  getSingleMovie(title: string): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/${title}', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // -------------------------------------------------
  // Making the api call for a Movie Director endpoint
  // -------------------------------------------------
  /**
   * Makes a call to API endpoint to get information about a Movie Director
   * @param {string} name
   * @returns an object in json format
   * @function getDirector
   */
  getDirector(name: string): Observable<any> {
    return this.http
      .get(apiUrl + 'directors/${name}', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // ----------------------------------------------
  // Making the api call for a Movie Genre endpoint
  // ----------------------------------------------
  /**
   * Makes a call to API endpoint to get information about a Movie Genre
   * @param {string} name
   * @returns an object in json format
   * @function getGenre
   */
  getGenre(name: string): Observable<any> {
    return this.http
      .get(apiUrl + 'genres/${name}', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // ---------------------------------------
  // Making the api call for a User endpoint
  // ---------------------------------------
  /**
   * Makes a call to API endpoint to get information about a User
   * @returns an object in json format
   * @function getUser
   */
  getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    // console.log(`getUser was called, for user: ${user}`);
    return this.http
      .get(`${apiUrl}users/${user}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // ---------------------------------------------------------
  // Making the api call for add a Movie to Favorites endpoint
  // ---------------------------------------------------------
  /**
   * Makes a call to API endpoint to add a selected movie to the user's list of favorite movies
   * @returns an object in json format
   * @function addMovieToFav
   */
  addMovieToFav(movieId: any): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http
      .post(
        `${apiUrl}users/${user}/movies/${movieId}`,
        { FavoriteMovie: movieId },
        {
          headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // ------------------------------------------
  // Making the api call for edit User endpoint
  // ------------------------------------------
  /**
   * Makes a call to API endpoint to edit information about a User
   * @returns an object in json format
   * @function editUser
   */
  editUser(updateDetails: any): Observable<any> {
    const userId = localStorage.getItem('userId');

    return this.http
      .put(`${apiUrl}users/${userId}`, updateDetails, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // --------------------------------------------
  // Making the api call for delete User endpoint
  // --------------------------------------------
  /**
   * Makes a call to API endpoint to delete a User
   * @returns an object in json format
   * @function deleteUser
   */
  deleteUser(): Observable<any> {
    const userId = localStorage.getItem('userId');

    return this.http
      .delete(`${apiUrl}users/${userId}`, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // --------------------------------------------------------------
  // Making the api call for delete a Movie from Favorites endpoint
  // --------------------------------------------------------------
  /**
   * Makes a call to API endpoint to delete a selected movie from the user's list of favorite movies
   * @returns an object in json format
   * @function deleteMovieFromFav
   */
  deleteMovieFromFav(movieId: any): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http
      .delete(
        `${apiUrl}users/${user}/movies/${movieId}`,

        {
          headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // ----------------------------------------------------------
  // Making the api call for the Movies from Favorites endpoint
  // ----------------------------------------------------------
  /**
   * Makes a call to API endpoint to get the list of movies
   * @returns An array of objects in json format
   * @function getFavoriteMovies
   */
  getFavoriteMovies(): Observable<any> {
    // No dedicated end point for Favorite Movies but FavoriteMovies is one of the User's properties therefore we fetch the data from the User and then access FavoriteMovies later on
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http
      .get(`${apiUrl}users/${user}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }
}
