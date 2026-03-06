import { supabase } from './supabase';
import { Product } from '../types';

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*');
  console.log('Supabase response:', { data, error, count: data?.length });
  if (error) {
    console.error('Supabase error:', error);
    return [];
  }
  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    image_url: row.image_url,
    stock: row.stock,
    rating: Number(row.rating || 0),
    reviewCount: row.review_count || 0,
  }));
}

export async function addProduct(product: Omit<Product, 'id' | 'rating' | 'reviewCount'>): Promise<Product> {
  const payload = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image_url: product.image_url,
    stock: product.stock,
  };
  const { data, error } = await supabase.from('products').insert(payload).select().single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: Number(data.price),
    category: data.category,
    image_url: data.image_url,
    stock: data.stock,
    rating: Number(data.rating || 0),
    reviewCount: data.review_count || 0,
  };
}

export async function updateProduct(product: Product): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image_url: product.image_url,
      stock: product.stock,
    })
    .eq('id', product.id)
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: Number(data.price),
    category: data.category,
    image_url: data.image_url,
    stock: data.stock,
    rating: Number(data.rating || 0),
    reviewCount: data.review_count || 0,
  };
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
