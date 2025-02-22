import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { City } from '../common/city';
import {Township} from'../common/township';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {
  private cityUrl = environment.myShopUrl + "/city";
  private townshipUrl = environment.myShopUrl + "/township";

constructor(private httpClient:HttpClient) { }

  getCity() : Observable<City[]> {
    return this.httpClient.get<City[]>(this.cityUrl).pipe(
          map(response => response)  // 這裡返回陣列
    );
  }
  getTownship(theCityId:number) : Observable<Township[]> {
    const searchTownshipUrl = `${this.townshipUrl}/findByCityId?id=${theCityId}`;
    return this.httpClient.get<Township[]>(searchTownshipUrl).pipe(
          map(response => response)  // 這裡返回陣列
    );
  }


  getCreditCardMonths(starMonth:number):Observable<number[]>{
    let data :number[]=[];
    // 創建一個陣列用於月份的下拉是選單
    // 從startMonth開始到12月
    for(let theMonth = starMonth; theMonth<=12; theMonth++){
      data.push(theMonth);
    }
    // of(data) 將 data（這裡是一個數字陣列）包裝成一個 Observable。
    // 當這個 Observable 被訂閱時，它會： 發送 data。

    return of(data);
  }
  getCreditCardYears():Observable<number[]>{
    let data:number[]=[];
    // 創建一個陣列用於年份的下拉是選單
    //從現在年分到往後10年

    // 獲取現在的年份
    const startYear = new Date().getFullYear();

    for(let theYear = startYear; theYear <= startYear+10; theYear++){
      data.push(theYear);
    }
    return of(data);
  }
  
}
interface GetResponseCity{
  _embedded :{
     city:City[];
  }
}
interface GetResponseTownship{
  _embedded :{
    township:Township[];
 }
}
