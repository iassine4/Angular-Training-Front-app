import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Training } from '../models/training.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingApiService {  

    private readonly apiUrl = '/api'; // via proxy => http://localhost:3000/api
    
    constructor(private readonly httpClient: HttpClient) { }

    public getTrainings(){
        return this.httpClient.get<Training[]>(`${this.apiUrl}/trainings`);
    }

    public getTrainingById(id: number){
        return this.httpClient.get<Training>(`${this.apiUrl}/${id}`);
    }
}