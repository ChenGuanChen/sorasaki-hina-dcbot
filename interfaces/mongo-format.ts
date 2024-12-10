import { WithId, ObjectId } from 'mongodb';
export interface format extends WithId<Document> {
    dataId: ObjectId,
    userid: string,
    value: number,
}