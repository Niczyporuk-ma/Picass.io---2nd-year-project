import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '@common/drawing.interface';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class IndexService {
    private readonly BASE_URL: string = 'http://localhost:3000/api/index';

    constructor(private http: HttpClient) {}

    basicGet(): Observable<Drawing[]> {
        return this.http.get<Drawing[]>(this.BASE_URL + '/drawing').pipe(catchError(this.handleError<Drawing[]>('basicGet')));
    }

    basicPost(drawing: Drawing): Observable<void> {
        return this.http.post<void>(this.BASE_URL + '/send', drawing).pipe(catchError(this.handleError<void>('basicPost')));
    }

    basicDelete(id: string): Observable<void> {
        return this.http.delete(this.BASE_URL + '/drawing/' + id).pipe(catchError(this.handleError<void>('basicDelete'))) as Observable<void>;
    }

    basicPatch(drawing: Drawing): Observable<void> {
        return this.http.patch(this.BASE_URL + '/modify', drawing).pipe(catchError(this.handleError<void>('basicPost'))) as Observable<void>;
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
