import { Injectable } from '@angular/core';
import { Drawing } from '@common/drawing.interface';
/*tslint:disable:prefer-for-of*/
const TAG_VALUE_INDEX = 0;

@Injectable({
    providedIn: 'root',
})
export class FilterService {
    input: string[] = [];
    tags: string;
    id: string;

    extractInput(event: KeyboardEvent): void {
        this.tags = (event.target as HTMLInputElement).value;
    }

    extractID(event: KeyboardEvent): void {
        this.id = (event.target as HTMLInputElement).value;
    }

    formatInput(): void {
        this.input = [];
        if (this.tags !== null && this.tags !== '') {
            let temp = '';
            for (let i = 0; i < this.tags.length; i++) {
                if (this.tags[i] === ',') {
                    this.input.push(temp);
                    temp = '';
                } else {
                    temp += this.tags[i];
                }
            }
            this.input.push(temp);
        }
    }

    filteringToGet(data: Drawing[], dataFiltered: Drawing[]): void {
        this.formatInput();
        if (this.input.length === 0) {
            for (let i = 0; i < data.length; i++) {
                dataFiltered.push(data[i]);
            }
        } else {
            for (let k = 0; k < this.input.length; k++) {
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < data[i].tags.length; j++) {
                        if (
                            this.input[k] === Object.values(data[i].tags[j])[TAG_VALUE_INDEX] &&
                            !this.isDuplicate(dataFiltered, data[i]._id.toString())
                        ) {
                            dataFiltered.push(data[i]);
                        }
                    }
                }
            }
        }
    }

    isDuplicate(filteredData: Drawing[], id: string): boolean {
        if (filteredData.length === 0) {
            return false;
        }

        for (let i = 0; i < filteredData.length; i++) {
            if (id === filteredData[i]._id.toString()) {
                return true;
            }
        }

        return false;
    }
}
