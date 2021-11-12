import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-generic-error',
  templateUrl: './generic-error.component.html',
  styleUrls: ['./generic-error.component.scss']
})
export class GenericErrorComponent implements OnInit {

  page:string = '';

  constructor(private route: Router, private activeRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.page = this.activeRoute.snapshot.data.page;
  }

  handleLogin(){
    this.route.navigate(['/']);
  }

}
