import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Training } from '../models/training.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingApiService {  

    private readonly apiUrl = '/api/trainings';
    
    constructor(private readonly http: HttpClient) { }

    public getTrainings(){
        return this.http.get<Training[]>(`${this.apiUrl}/trainings`);
    }

    public getTrainingById(id: number){
        return this.http.get<Training>(`${this.apiUrl}/${id}`);
    }
}