import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  isEditing: boolean = false;

  constructor(private fetchApiData: FetchApiDataService) {}

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(): void {
    const username = localStorage.getItem('user');
    this.fetchApiData.getUser(username!).subscribe((response: any) => {
      this.user = response;
    });
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.user.Username, this.user).subscribe(() => {
      // Do something after updating the user
    });
  }
}
