import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  isEditing: boolean = false;

  constructor(
    private fetchApiData: FetchApiDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(): void {
    const username = localStorage.getItem('user');
    this.fetchApiData.getUser(username!).subscribe(
      (response: any) => {
        this.user = response;
        this.getUserFavorites();
      },
      (error: any) => {
        console.error('Error retrieving user data:', error);
      }
    );
  }

  getUserFavorites(): void {
    const username = localStorage.getItem('user');
    if (username) {
      this.fetchApiData.getUserFavorites(username).subscribe(
        (favorites: any[]) => {
          this.user.favorites = favorites;
          console.log('Favorites:', this.user.favorites);
          this.getMovieTitles(); // Call method to fetch movie titles
        },
        (error: any) => {
          console.error('Error retrieving user favorites:', error);
        },
        () => {
          if (!this.user.favorites) {
            this.user.favorites = [];
          }
        }
      );
    } else {
      console.error('Username not found in local storage');
    }
  }
  getMovieTitles(): void {
    const movieIds = this.user.favorites.map((movie: any) => movie._id);
    this.fetchApiData.getMoviesByIds(movieIds).subscribe(
      (movies: any[]) => {
        this.user.favorites = movies.map((movie) => {
          const favorite = this.user.favorites.find(
            (fav: any) => fav._id === movie._id
          );
          return { ...favorite, title: movie?.title || 'Unknown' };
        });
      },
      (error: any) => {
        console.error('Error retrieving movie titles:', error);
      }
    );
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.user.Username, this.user).subscribe(() => {
      // Do something after updating the user
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
