import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    this.fetchUserFavorites(); // Call the method to fetch user favorites
  }

  fetchUserFavorites(): void {
    const username = localStorage.getItem('user');
    if (username) {
      this.fetchApiData.getUserFavorites(username).subscribe(
        (favorites: any[]) => {
          this.favorites = favorites.map((movie) => movie._id);
        },
        (error: any) => {
          console.error('Error retrieving user favorites:', error);
        },
        () => {
          this.checkFavorites(); // Call the method to check favorites once fetched
        }
      );
    } else {
      console.error('Username not found in local storage');
    }
  }

  checkFavorites(): void {
    // Loop through the movies and set the favorite status
    this.movies.forEach((movie) => {
      movie.isFavorite = this.isMovieFavorite(movie._id);
    });
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
          this.favorites = favorites.map((movie) => movie._id);
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

  toggleFavoriteMovie(movieId: string): void {
    const username = localStorage.getItem('user');
    if (this.isMovieFavorite(movieId)) {
      this.fetchApiData
        .deleteFavoriteMovie(username!, movieId)
        .subscribe(() => {
          // Movie removed from favorites list
          this.favorites = this.favorites.filter((id) => id !== movieId);
          this.snackBar.open('Removed from favorites', 'OK', {
            duration: 2000,
          });
        });
    } else {
      this.fetchApiData.addFavoriteMovie(username!, movieId).subscribe(() => {
        // Movie added to favorites list
        this.favorites.push(movieId);
        this.snackBar.open('Added to favorites', 'OK', {
          duration: 2000,
        });
      });
    }
  }
}
