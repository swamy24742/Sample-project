import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../../services';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  show = false;

  private subscription!: Subscription;

  constructor(private dataService:DataService) { }

  ngOnInit() {
      this.subscription = this.dataService.loaderState$.subscribe((data: any) =>{
        this.show = data.message;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
