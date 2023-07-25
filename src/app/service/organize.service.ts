import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizeService {
  jsonData: any;
  nestedView: any[];

  private organizeData$ = new BehaviorSubject<any[]>(null);

  constructor(private http: HttpClient) { }

  /**
    * Fetches data from 'assets/data.json', organizes it into a nested tree structure, and emits the data to subscribers.
    * This method is typically called to initialize the service with the data.
    */
  loadData() {
    this.http.get('assets/data.json').subscribe((data: any) => {
      this.jsonData = data.data.list0;
      this.jsonData.sort((a: any, b: any) => a.parentId - b.parentId);
      this.nestedView = this.organizeIntoNestedView(this.jsonData, 0);
      this.organizeData$.next([...this.nestedView]);
    });
  }

  /**
  * Filters the nested tree view based on the provided search term and emits the filtered data to subscribers.
  * If the search term is empty, the original nested tree view is emitted.
  * @param searchTerm The search term to filter the tree view.
  */
  searchOnData(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.organizeData$.next([...this.nestedView]);
    } else {
      this.organizeData$.next(this.filterNestedView(this.nestedView, searchTerm.trim().toLowerCase()));
    }
  }

  /**
    * Returns an observable that emits the organized nested tree data.
    * Subscribers can receive updates whenever the tree data changes.
    * @returns An observable of the organized nested tree data.
    */
  getOrganizeData$(): Observable<any[]> {
    return this.organizeData$.asObservable();
  }

  /**
     * Organizes the data into a nested tree structure based on the parentId.
     * @param data The array of data to organize into the nested tree structure.
     * @param parentId The parentId to organize the data under.
     * @returns The nested tree structure as an array.
     * @private
     */
  private organizeIntoNestedView(data: any[], parentId: number): any[] {
    return data
      .filter(item => item.parentId === parentId)
      .map(item => {
        const children = this.organizeIntoNestedView(data, item.id);
        if (children.length > 0) {
          children.sort((a: any, b: any) => a.name.localeCompare(b.name));
          return { ...item, children };
        }
        return item;
      });
  }

  /**
   * Filters the nested tree data based on the provided search term.
   * @param data The array of data to filter.
   * @param searchTerm The search term to filter the data with.
   * @returns The filtered nested tree data as an array.
   * @private
   */
  private filterNestedView(data: any[], searchTerm: string): any[] {
    return data.reduce((acc, item) => {
      if (item.name.toLowerCase().includes(searchTerm)) {
        acc.push(item);
      } else if (item.children && item.children.length > 0) {
        const filteredChildren = this.filterNestedView(item.children, searchTerm);
        if (filteredChildren.length > 0) {
          acc.push({ ...item, children: filteredChildren });
        }
      }
      return acc;
    }, []);
  }
}
