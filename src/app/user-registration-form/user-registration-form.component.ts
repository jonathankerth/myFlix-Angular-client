import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})
export class UserRegistrationFormComponent implements OnInit {
  userData = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
  };

  constructor(private fetchApiData: FetchApiDataService) {}

  ngOnInit(): void {}

  registerUser(): void {
    this.fetchApiData.register(this.userData).subscribe(
      (result) => {
        console.log(result);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
