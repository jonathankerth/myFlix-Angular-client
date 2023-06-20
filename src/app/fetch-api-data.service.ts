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

  getAllMovies(): Observable<any> {
    return this.http.get<any>(apiUrl + 'movies').pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  getMovie(movieId: string): Observable<any> {
    return this.http.get<any>(apiUrl + 'movies/' + movieId).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  getUserFavorites(username: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http
      .get<any>(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map((response: any) => response.FavoriteMovies),
        catchError(this.handleError)
      );
  }

  getMoviesByIds(movieIds: string[]): Observable<any[]> {
    const token = localStorage.getItem('token');
    const queryParams = movieIds.map((id: string) => `ids=${id}`).join('&');
    return this.http
      .get<any[]>(apiUrl + 'movies?' + queryParams, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map((response: any) => response),
        catchError(this.handleError)
      );
  }

  addFavoriteMovie(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .post(apiUrl + 'users/' + username + '/movies/' + movieId, null, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  deleteFavoriteMovie(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + username + '/movies/' + movieId, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http
      .get<any>(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map((response: any) => response),
        catchError(this.handleError)
      );
  }

  editUser(username: string, userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .put(apiUrl + 'users/' + username, userDetails, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  login(userData: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userData).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userData).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Error status code ${error.status}, Error body: ${error.error}`
      );
    }
    return throwError('Something went wrong; please try again later.');
  }
}
