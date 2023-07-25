import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrganizeService } from './service/organize.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  organizeData: any[];
  subscriptions: Subscription[] = [];

  constructor(private organizeService: OrganizeService) { }

  ngOnInit(): void {
    this.organizeService.loadData();
    this.setSubscriptions();
  }

  setSubscriptions(): void {
    this.subscriptions.push(
      this.organizeService.getOrganizeData$().subscribe((data: any[]) => {
        this.organizeData = data;
      })
    );
  }

  onSearch(event: any): void {
    const searchTerm = event.target.value
    this.organizeService.searchOnData(searchTerm);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
