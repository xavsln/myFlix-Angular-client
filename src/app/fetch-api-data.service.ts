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
  // Making the api call for the user registration endpoint
  // ------------------------------------------------------
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  // -----------------------------------------------
  // Making the api call for the user login endpoint
  // -----------------------------------------------
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'login', userDetails)
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
  getSingleMovie(title: any): Observable<any> {
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
  getDirector(name: any): Observable<any> {
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
  getGenre(name: any): Observable<any> {
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
  getUser(): Observable<any> {
    console.log(`getUser was called, for user: ${user}`);
    return this.http
      .get(`${apiUrl}users/${user}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // ---------------------------------------------------------
  // Making the api call for add a Movie to Favorites endpoint
  // ---------------------------------------------------------
  addMovieToFav(movieId: any): Observable<any> {
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
  deleteMovieFromFav(movieId: any): Observable<any> {
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
  getFavoriteMovies(): Observable<any> {
    // No dedicated end point for Favorite Movies but FavoriteMovies is one of the User's properties therefore we fetch the data from the User and then access FavoriteMovies later on
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
