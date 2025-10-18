import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GridDimension {
  rows: number;
  cols: number;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class GridDimensionService {
  private dimensionSubject = new BehaviorSubject<GridDimension>({
    rows: 3,
    cols: 3,
    label: '3:3'
  });

  public dimension$ = this.dimensionSubject.asObservable();

  constructor() {}

  changeDimension(dimension: GridDimension) {
    console.log('GridDimensionService: Changing dimension to', dimension);
    this.dimensionSubject.next(dimension);
  }

  getCurrentDimension(): GridDimension {
    return this.dimensionSubject.value;
  }
}