import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrganizeService } from './organize.service';

describe('OrganizeService', () => {
  let injector: TestBed;
  let service: OrganizeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrganizeService]
    });

    injector = getTestBed();
    service = injector.inject(OrganizeService);
    httpMock = injector.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('loadData', () => {
    it('should fetch and organize data on load', () => {
      const mockData = {
        data: {
          list0: [
            { id: 1, parentId: 0, name: 'Root' },
            { id: 2, parentId: 1, name: 'Child 1' },
            { id: 3, parentId: 1, name: 'Child 2' },
          ]
        }
      };

      service.loadData();

      const req = httpMock.expectOne('assets/data.json');
      req.flush(mockData);

      expect(service['jsonData']).toEqual(mockData.data.list0);
      expect(service['nestedView']).toBeTruthy();
    });
  });

  describe('searchOnData', () => {
    it('should return the original data when search term is empty', () => {
      const originalData = [
        { id: 1, parentId: 0, name: 'Root' },
        { id: 2, parentId: 1, name: 'Child 1' },
        { id: 3, parentId: 1, name: 'Child 2' },
      ];
      service['jsonData'] = originalData;
      service['nestedView'] = originalData;

      service.searchOnData('');

      service.getOrganizeData$().subscribe(data => {
        expect(data).toEqual(originalData);
      });
    });

    it('should return filtered data when search term is not empty', () => {
      const originalData = [
        { id: 1, parentId: 0, name: 'Root' },
        { id: 2, parentId: 1, name: 'Child 1' },
        { id: 3, parentId: 1, name: 'Child 2' },
      ];
      const searchTerm = 'Child 1';

      service['jsonData'] = originalData;
      service['nestedView'] = originalData;

      service.searchOnData(searchTerm);

      service.getOrganizeData$().subscribe(data => {
        expect(data).toEqual([{ id: 2, parentId: 1, name: 'Child 1' }]);
      });
    });
  });
});
