import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const apiUrl = 'https://niccage.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  // User registration
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  // User login
  public userLogin(credentials: any): Observable<any> {
    return this.http
      .post(apiUrl + 'login', credentials)
      .pipe(catchError(this.handleError));
  }

  // Get all movies
  public getAllMovies(): Observable<any> {
    return this.http.get(apiUrl + 'movies').pipe(catchError(this.handleError));
  }

  // Get one movie
  public getMovie(movieId: string): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/' + movieId)
      .pipe(catchError(this.handleError));
  }

  // Get director
  public getDirector(directorId: string): Observable<any> {
    return this.http
      .get(apiUrl + 'directors/' + directorId)
      .pipe(catchError(this.handleError));
  }

  // Get genre
  public getGenre(genreName: string): Observable<any> {
    return this.http
      .get(apiUrl + 'genres/' + genreName)
      .pipe(catchError(this.handleError));
  }

  // Get user
  public getUser(username: string): Observable<any> {
    return this.http
      .get(apiUrl + 'users/' + username)
      .pipe(catchError(this.handleError));
  }

  // Get favourite movies for a user
  public getFavouriteMovies(username: string): Observable<any> {
    return this.http
      .get(apiUrl + 'users/' + username + '/movies')
      .pipe(catchError(this.handleError));
  }

  // Add a movie to favourite Movies
  public addMovieToFavourites(
    username: string,
    movieId: string
  ): Observable<any> {
    return this.http
      .post(apiUrl + 'users/' + username + '/movies/' + movieId, {})
      .pipe(catchError(this.handleError));
  }

  // Edit user
  public editUser(username: string, userData: any): Observable<any> {
    return this.http
      .put(apiUrl + 'users/' + username, userData)
      .pipe(catchError(this.handleError));
  }

  // Delete user
  public deleteUser(username: string): Observable<any> {
    return this.http
      .delete(apiUrl + 'users/' + username)
      .pipe(catchError(this.handleError));
  }

  // Delete a movie from the favorite movies
  public deleteMovieFromFavourites(
    username: string,
    movieId: string
  ): Observable<any> {
    return this.http
      .delete(apiUrl + 'users/' + username + '/movies/' + movieId)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
