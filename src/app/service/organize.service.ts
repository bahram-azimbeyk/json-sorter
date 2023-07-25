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


  loadData() {
    this.http.get('assets/data.json').subscribe((data: any) => {
      this.jsonData = data.data.list0;
      this.jsonData.sort((a: any, b: any) => a.parentId - b.parentId);
      this.nestedView = this.organizeIntoNestedView(this.jsonData, 0);
      this.organizeData$.next([...this.nestedView]);
    });
  }

  searchOnData(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.organizeData$.next([...this.nestedView]);
    } else {
      this.organizeData$.next(this.filterNestedView(this.nestedView, searchTerm.trim().toLowerCase()));
    }
  }


  getOrganizeData$(): Observable<any[]> {
    return this.organizeData$.asObservable();
  }


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
