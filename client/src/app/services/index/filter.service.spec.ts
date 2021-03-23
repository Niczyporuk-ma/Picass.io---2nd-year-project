import { TestBed } from '@angular/core/testing';
import { FilterService } from '@app/services/index/filter.service';
import { Drawing } from '@common/drawing.interface';

describe('FilterService', () => {
    let service: FilterService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FilterService);
        /* tslint:disable */
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('formatInput shout set the input to a empty array first of all', () => {
        service.tags = '';
        service.formatInput();
        expect(service.input).toEqual([]);
     });

    it('formatInput should populate the input array when tags is valid', () => {
        service.tags = 'tagUN,tagDEUX,tagTROIS';
        let inputTab = service.tags.split(",");
        service.formatInput();
        expect(service.input.length).toEqual(inputTab.length);
        for(let i = 0; i < service.input.length; i++ )
        {
            expect(service.input[i]).toEqual(inputTab[i]);
        }
    });

    it(' extractInput should set the tags value written in textbox', () => {
        let event = {} as KeyboardEvent;
        Object.defineProperty(event, 'target', { value: { value: 'inputest' } });
        service.extractInput(event);
        expect(service.tags).toEqual('inputest');
    });

    it(' extractId should set the id value written in textbox', () => {
        let event = {} as KeyboardEvent;
        Object.defineProperty(event, 'target', { value: { value: 'inputest' } });
        service.extractID(event);
        expect(service.id).toEqual('inputest');
    });

    it("isDUplicate should return false when filteredData is empty", () => {
        let filteredData: Drawing[] = [];
        let returnValue: boolean = service.isDuplicate(filteredData,"");
        expect(returnValue).not.toBeTrue();

    });

    it("isDUplicate should return false when the id is not found", () => {
        let filteredData: Drawing[] = [{_id: "myID", name:"", tags : []}];
        let returnValue: boolean = service.isDuplicate(filteredData,"notMyId");
        expect(returnValue).not.toBeTrue();

    });

    it("isDUplicate should return true when the id is found", () => {
        let filteredData: Drawing[] = [{_id: "myID", name:"", tags : []}];
        let returnValue: boolean = service.isDuplicate(filteredData,"myID");
        expect(returnValue).toBeTrue();

    });

    it("filteringToGet should add every element of data in dataFiltered when there is no input", () => {
        let data: Drawing[] = [{_id: "myID", name:"", tags : []}, {_id: "myID2", name:"", tags : []}];
        let filteredData: Drawing[] = [];
        service.tags = '';
        service.filteringToGet(data,filteredData);
        expect(filteredData.length).toEqual(2);
        for(let i =0; i < filteredData.length; i++)
        {
            expect(data[i]).toEqual(filteredData[i]);
        }

    });

    it("filteringToGet should not add duplicates drawing to datafiltered", () => {
        let data: Drawing[] = [{_id: "myID", name:"", tags : ["1"]},{_id: "myID", name:"", tags : ["1"]}];
        let filteredData: Drawing[] = [];
        service.tags = '1';
        service.filteringToGet(data,filteredData);
        expect(filteredData.length).toEqual(1);

    });

    it("filteringToGet should add every drawings containing the wanted tags", () => {
        let data: Drawing[] = [{_id: "myID1", name:"", tags : ["1"]},
                                {_id: "myID2", name:"", tags : ["2"]},
                                {_id: "myID3", name:"", tags : ["2"]},
                                {_id: "myID4", name:"", tags : ["3"]}];
        let filteredData: Drawing[] = [];
        service.tags = '1,2';
        service.filteringToGet(data,filteredData);
        expect(filteredData.length).toEqual(3);

        for(let i =0; i < filteredData.length; i++)
        {
            expect(data[i]).toEqual(filteredData[i]);
        }

    });
});
