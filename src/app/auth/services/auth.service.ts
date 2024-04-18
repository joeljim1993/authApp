import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { enviroments } from 'src/app/environments/environments';
import { AuthStatus, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl:string = enviroments.baseUrl;

  private http= inject( HttpClient );
  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking)

  // ! exporner  al mundo exterior
  public currentUser = computed( ()=> this._currentUser );
  public authStatus = computed( ()=> this._authStatus );


  constructor() { }

  login(email:string, password:string):Observable<boolean>{

     const url = `${this.baseUrl}/auth/login`;
     const body = {email,password};
    console.log({url,body});


    return this.http.post<LoginResponse>( url,body )
      .pipe(
        tap(response=> console.log("pase por aqui",response)),
        tap( ({user, token})=>{
          this._currentUser.set( user);
          this._authStatus.set( AuthStatus.authenticated );
          localStorage.setItem('token',token);
        }),
        map( ()=> true),

        // todo: errores
        catchError( err => throwError( ()=>err.error.message ))
      )

  }


}
