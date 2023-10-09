import { Injectable } from '@angular/core';

import { EMPTY, Observable, of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Product } from './product.interface';

import { ApiService } from '../core/api.service';
import { APIEndpoints } from '../enums/endpoints.enum';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends ApiService {
  createNewProduct(product: Product): Observable<Product> {
    if (!this.endpointEnabled('bff')) {
      console.warn(
        'Endpoint "bff" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    const url = this.getUrl('bff', 'products');
    return this.http.post<Product>(url, product);
  }

  editProduct(id: number, changedProduct: Product): Observable<Product> {
    if (!this.endpointEnabled('bff')) {
      console.warn(
        'Endpoint "bff" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    const url = this.getUrl('bff', `products/${id}`);
    return this.http.put<Product>(url, changedProduct);
  }

  getProductById(id: number): Observable<Product | null> {
    if (!this.endpointEnabled('bff')) {
      console.warn(
        'Endpoint "bff" is disabled. To enable change your environment.ts config'
      );
      return this.http
        .get<Product[]>('/assets/products.json')
        .pipe(
          map(
            (products) => products.find((product) => product.id === id) || null
          )
        );
    }

    const url = this.getUrl('bff', `products/${id}`);
    return this.http
      .get<{ product: Product }>(url)
      .pipe(map((resp) => resp.product));
  }

  getProducts(): Observable<Product[]> {
    return this.http
      .get<{ books: Product[] }>(APIEndpoints.PRODUCT_SERVICE)
      .pipe(
        map((res) => {
          const books = res.books;
          return books.map((book) => ({ ...book, count: 5 }));
        })
      );
  }

  getProductsForCheckout(ids: string[]): Observable<Product[]> {
    if (!ids.length) {
      return of([]);
    }

    return this.getProducts().pipe(
      map((products) =>
        products.filter((product) => ids.includes(product.id.toString()))
      )
    );
  }
}
