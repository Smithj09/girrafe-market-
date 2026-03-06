import { supabase } from './supabase';

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  image_url: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
}

export async function createOrder(orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  total: number;
}): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      customer_phone: orderData.customer_phone,
      items: orderData.items,
      total: orderData.total,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchOrders(): Promise<Order[]> {
  console.log('Fetching orders from Supabase...');
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  console.log('Fetch orders response:', { data, error });
  
  if (error) {
    console.error('Fetch orders error:', error);
    return [];
  }
  return data || [];
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) throw error;
}
