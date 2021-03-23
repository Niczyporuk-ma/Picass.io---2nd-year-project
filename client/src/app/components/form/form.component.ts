import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndexService } from '@app/services/index/index.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { Drawing } from '@common/drawing.interface';
import { ObjectID } from 'bson';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
    drawingForm: FormGroup;
    MIN_NAME_LENGTH: number = 5;
    MAX_NAME_LENGTH: number = 10;
    MAX_TAGS_NUMBER: number = 3;

    constructor(private builder: FormBuilder, private toolManager: ToolManagerService, private indexService: IndexService) {}

    ngOnInit(): void {
        this.drawingForm = this.builder.group({
            name: ['', [Validators.required, Validators.minLength(this.MIN_NAME_LENGTH), Validators.maxLength(this.MAX_NAME_LENGTH)]],
            tags: this.builder.array([]),
        });
    }

    get tagsForms(): FormArray {
        return this.drawingForm.get('tags') as FormArray;
    }

    addTags(): void {
        if (this.tagsForms.length < this.MAX_TAGS_NUMBER) {
            const tag = this.builder.group({
                tag: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
            });

            this.tagsForms.push(tag);
        }
    }

    removeTags(): void {
        if (this.tagsForms.length > 0) {
            this.tagsForms.removeAt(this.tagsForms.length - 1);
        }
    }

    get name(): FormGroup {
        return this.drawingForm.get('name') as FormGroup;
    }

    save(): void {
        const generatedID = new ObjectID();
        const temp: Drawing = { _id: generatedID.toString(), name: this.drawingForm.get('name')?.value, tags: [] };

        console.log(this.tagsForms.length);
        for (let i = 0; i < this.tagsForms.length; i++) {
            temp.tags.push(this.tagsForms.at(i).value as string);
        }

        this.indexService.basicPost(temp).subscribe();
    }

    disableShortcut(): void {
        this.toolManager.allowKeyPressEvents = false;
    }

    enableShortcut(): void {
        this.toolManager.allowKeyPressEvents = true;
    }
}
