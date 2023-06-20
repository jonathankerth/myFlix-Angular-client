import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favourites: any[] = []; // Store the user's favorite movies here

  constructor(public fetchApiData: FetchApiDataService) {}

  ngOnInit(): void {
    this.getMovies();
    this.getUserFavourites();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
    });
  }

  getUserFavourites(): void {
    const username = localStorage.getItem('user');
    if (username) {
      this.fetchApiData.getFavouriteMovies(username).subscribe(
        (resp: any) => {
          this.favourites = resp || []; // Assign the response or an empty array
        },
        (error: any) => {
          console.error('Error retrieving user favorites:', error);
        }
      );
    } else {
      console.error('Username not found in local storage');
    }
  }

  isMovieFavorite(movieId: string): boolean {
    return this.favourites.some((movie) => movie._id === movieId);
  }

  toggleFavoriteMovie(movieId: string): void {
    const username = localStorage.getItem('user');
    if (this.isMovieFavorite(movieId)) {
      this.fetchApiData
        .deleteMovieFromFavourites(username!, movieId)
        .subscribe(() => {
          // Movie removed from favorites list
          this.favourites = this.favourites.filter(
            (movie) => movie._id !== movieId
          );
        });
    } else {
      this.fetchApiData
        .addMovieToFavourites(username!, movieId)
        .subscribe(() => {
          // Movie added to favorites list
          this.favourites.push(
            this.movies.find((movie) => movie._id === movieId)
          );
        });
    }
  }
}
