import { Injectable } from '@angular/core';
import { IndexdbService } from './indexdb.service';
import { Observable, catchError, from, map, of } from 'rxjs';
import { Theme } from '../models/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  dixie : IndexdbService
  constructor() {
    this.dixie = new IndexdbService();
  }

  getThemes(){
    return from(this.dixie.theme.toArray());
  }
  getTheme(id: number) {
    return from(this.dixie.theme.get(id));
  }

  addTheme(theme: Theme) {
    return from(this.dixie.theme.add(theme));
  }

  updateTheme(theme: Theme) {
    return from(this.dixie.theme.update(theme.id, theme));
  }

  deleteTheme(id: number){
    return from(this.dixie.theme.delete(id));
  }

  verificarExistencia(themeId: number): Observable<boolean> {
    return from(this.dixie.theme.get(themeId)).pipe(
      // Si el temporizador existe, emite true; de lo contrario, emite false
      map(theme => theme !== undefined),
      catchError(() => of(false))
    );
  }
  
}
