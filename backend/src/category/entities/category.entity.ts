export class Category {
  id: string;
  name: string;
  parentCategoryId: string | null;
  parentCategory?: Category;
  childCategories?: Category[];
}
