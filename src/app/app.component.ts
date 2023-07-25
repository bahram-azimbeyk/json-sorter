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

  /**
  * Array to store subscriptions to observables.
  */
  subscriptions: Subscription[] = [];

  constructor(private organizeService: OrganizeService) { }

  ngOnInit(): void {
    this.organizeService.loadData();
    this.setSubscriptions();
  }

  /**
   * Sets up subscriptions to observables to receive updates when the organized data changes.
   */
  setSubscriptions(): void {
    this.subscriptions.push(
      this.organizeService.getOrganizeData$().subscribe((data: any[]) => {
        this.organizeData = data;
      })
    );
  }

  /**
   * Event handler for the search input field.
   * Triggers a search on the OrganizeService based on the provided search term.
   * @param event The event object containing the search term entered by the user.
   */
  onSearch(event: any): void {
    const searchTerm = event.target.value
    this.organizeService.searchOnData(searchTerm);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
