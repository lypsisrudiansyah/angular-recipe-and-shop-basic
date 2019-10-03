import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';

import { map, tap } from 'rxjs/operators';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe-list/recipe.model';

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(private http: HttpClient, private recipesService: RecipeService) {}

    storeRecipes() {
        const recipes = this.recipesService.getRecipes();
        return this.http
        .put('https://recipe-app-a6bf2.firebaseio.com/recipes.json', recipes)
        .subscribe(response => {
                console.log(response);
        });
    }

    fetchRecipes() {
        return this.http
        .get<Recipe[]>('https://recipe-app-a6bf2.firebaseio.com/recipes.json')
        .pipe(
            map(recipes => {
                return recipes.map(recipe => {
                    return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
                });
            }),
            tap(recipes => {
                this.recipesService.setRecipes(recipes);
            })
        )
    }
}