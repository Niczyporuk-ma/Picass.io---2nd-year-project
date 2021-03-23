import { HttpException } from '@app/http.exception';
import { DatabaseService } from '@app/services/database.service';
import { TYPES } from '@app/types';
import { Drawing } from '@common/drawing.interface';
import { ObjectID } from 'bson';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
const ERROR_CODE = 500;
@injectable()
export class IndexService {
    constructor(@inject(TYPES.DatabaseService) private db: DatabaseService) {}

    // TODO : ceci est à titre d'exemple. À enlever pour la remise
    async saveDrawing(drawing: Drawing): Promise<void> {
        const id = new ObjectID(drawing._id);
        await this.db.db
            .collection('drawing')
            .insertOne({ _id: id, name: drawing.name, tags: drawing.tags })
            .catch((error: Error) => {
                throw new HttpException(ERROR_CODE, 'Failed to insert drawing');
            });
    }

    async deleteDoc(id: string): Promise<void> {
        await this.db.db
            .collection('drawing')
            .deleteOne({ _id: new ObjectID(id) })
            .catch((error: Error) => {
                throw new HttpException(ERROR_CODE, 'Failed to delete drawing');
            });
    }

    // Peut etre utile ailleur

    // async modifyDoc(drawing: Drawing): Promise<void> {
    //     let filterQuery: FilterQuery<Drawing> = { name: drawing.name };
    //     let updateQuery: UpdateQuery<Drawing> = {
    //         $set: {
    //             name: drawing.name,
    //             tags: ['abc', 'aer'],
    //         },
    //     };

    //     await this.db.db
    //         .collection('drawing')
    //         .updateMany(filterQuery, updateQuery)
    //         .catch((error: Error) => {
    //             throw new HttpException(500, 'Failed to modify drawing');
    //         });
    // }

    async getDrawings(): Promise<Drawing[]> {
        const drawings = await this.db.db.collection('drawing').find({}).toArray();
        return drawings;
    }
}
