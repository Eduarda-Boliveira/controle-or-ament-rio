import { apiRequest } from './config';

export interface Category {
  id: number;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDTO {
  name: string;
}

export interface UpdateCategoryDTO {
  name: string;
}

export async function listCategories(): Promise<Category[]> {
  const response = await apiRequest<{ categories: Category[] }>('/categories');
  return response.categories;
}

export async function createCategory(data: CreateCategoryDTO): Promise<Category> {
  const response = await apiRequest<{ category: Category }>('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.category;
}

export async function updateCategory(id: number, data: UpdateCategoryDTO): Promise<Category> {
  const response = await apiRequest<{ category: Category }>(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.category;
}

export async function deleteCategory(id: number): Promise<void> {
  await apiRequest(`/categories/${id}`, {
    method: 'DELETE',
  });
}
