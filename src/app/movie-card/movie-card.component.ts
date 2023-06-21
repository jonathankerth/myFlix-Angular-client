import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favorites: string[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getUserFavorites();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
    });
  }

  getUserFavorites(): void {
    const username = localStorage.getItem('user');
    if (username) {
      this.fetchApiData.getUserFavorites(username).subscribe(
        (favorites: any[]) => {
          this.favorites = favorites;
        },
        (error: any) => {
          console.error('Error retrieving user favorites:', error);
        }
      );
    } else {
      console.error('Username not found in local storage');
    }
  }

  openGenre(name: string, description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: name,
        content: description,
      },
    });
  }

  openDirector(name: string, bio: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: name,
        content: bio,
      },
    });
  }

  openSynopsis(description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: 'Synopsis',
        content: description,
      },
    });
  }

  isMovieFavorite(movieId: string): boolean {
    return this.favorites.includes(movieId);
  }

  addFavorite(movieId: string): void {
    // Implement your add favorite logic here
    const username = localStorage.getItem('user');
    if (username) {
      this.fetchApiData.addFavoriteMovie(username, movieId).subscribe(
        (response: any) => {
          // Update the favorites list
          this.favorites.push(movieId);
          this.snackBar.open('Added to favorites', 'OK', {
            duration: 2000,
          });
        },
        (error: any) => {
          console.error('Error adding movie to favorites:', error);
          this.snackBar.open('Failed to add to favorites', 'OK', {
            duration: 2000,
          });
        }
      );
    } else {
      console.error('Username not found in local storage');
      this.snackBar.open('Failed to add to favorites', 'OK', {
        duration: 2000,
      });
    }
  }

  removeFavorite(movieId: string): void {
    // Implement your remove favorite logic here
    const username = localStorage.getItem('user');
    if (username) {
      this.fetchApiData.deleteFavoriteMovie(username, movieId).subscribe(
        (response: any) => {
          // Update the favorites list
          this.favorites = this.favorites.filter((id) => id !== movieId);
          this.snackBar.open('Removed from favorites', 'OK', {
            duration: 2000,
          });
        },
        (error: any) => {
          console.error('Error removing movie from favorites:', error);
          this.snackBar.open('Failed to remove from favorites', 'OK', {
            duration: 2000,
          });
        }
      );
    } else {
      console.error('Username not found in local storage');
      this.snackBar.open('Failed to remove from favorites', 'OK', {
        duration: 2000,
      });
    }
  }
}
