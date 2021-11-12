import { Component, OnInit } from '@angular/core';
import { AuthService, CommonService } from '../shared/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  treaty: boolean = false;
  claims: boolean = false;
  user: boolean = false;
  policy: boolean = false;
  userConfig: any;

  accessTiles: any = ['Reinsurance/Treaty Code Maintenance', 'User Profile', 'Claims Tagging', 'Policy Data']

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.setUserAccessDetails();
  }

  setUserAccessDetails() {
    this.userConfig = this.authService.getUserData();
    this.orderAccessTiles(this.userConfig);
  }

  orderAccessTiles(userConfig: any) {

    var orderedAccessTiles = [];

    if (userConfig.accessDetails['Claims Tagging'] == "Read-Only") {
      orderedAccessTiles.push('Claims Tagging');
    } else if (userConfig.accessDetails['Claims Tagging'] == "Edit") {
      orderedAccessTiles.unshift('Claims Tagging');
    }
    if (userConfig.accessDetails['User Profile'] == "Read-Only") {
      orderedAccessTiles.push('User Profile');
    } else if (userConfig.accessDetails['User Profile'] == "Edit") {
      orderedAccessTiles.unshift('User Profile');
    }
    if (userConfig.accessDetails['Reinsurance/Treaty Code Maintenance'] == "Read-Only") {
      orderedAccessTiles.push('Reinsurance/Treaty Code Maintenance');
    } else if (userConfig.accessDetails['Reinsurance/Treaty Code Maintenance'] == "Edit") {
      orderedAccessTiles.unshift('Reinsurance/Treaty Code Maintenance');
    }

    if (userConfig.accessDetails['Policy Data'] == "Read-Only") {
      orderedAccessTiles.push('Policy Data');
    } else if (userConfig.accessDetails['Policy Data'] == "Edit") {
      orderedAccessTiles.unshift('Policy Data');
    }

    this.accessTiles = orderedAccessTiles;

  }

}
