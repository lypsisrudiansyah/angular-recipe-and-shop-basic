import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe-list/recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
    recipeSelected  = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
    new Recipe(
        'Ayam Penyet Tetangga',
        'This is simply recipe',
        'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
        [
            new Ingredient('Meat', 1),
            new Ingredient('French Fries', 20)
        ]),
    new Recipe(
        'Bebek Bujang',
        'This is simply recipe',
        'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
        [
            new Ingredient('Egg', 5),
            new Ingredient('French Fries', 15)
        ]),
    new Recipe(
        'Es Doger Pak RT',
        'This is simply recipe',
        'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
        [
            new Ingredient('Cheese', 2),
            new Ingredient('French Fries', 35)
        ]),
    new Recipe(
        'Nasi Goreng Muantep',
        'This is simply recipe',
        'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
        [
            new Ingredient('Palm Oil', 1),
            new Ingredient('French Fries', 12)
        ]),
    // new Recipe('Bebek Bujang', 'Lorem ipsum dolor sit ah', 'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg'),
    // new Recipe('Es Doger Pak RT', 'This is simply recipe', 'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg'),
// new Recipe('Nasi Goreng Muantep', 'This is simply recipe', 'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg'),
    ];

    constructor(private slService: ShoppingListService) {}

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }
}
