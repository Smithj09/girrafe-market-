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

  // Send notification
  try {
    await sendOrderNotification(data);
  } catch (err) {
    console.error('Notification failed:', err);
  }

  return data;
}

async function sendOrderNotification(order: Order) {
  const itemsList = order.items.map(item => 
    `${item.product_name} x${item.quantity} - ${item.product_price * item.quantity} FCFA`
  ).join('\n');

  const message = `🛒 NOUVELLE COMMANDE #${order.id.slice(0, 8)}\n\n👤 Client: ${order.customer_name}\n📧 Email: ${order.customer_email}\n📱 Téléphone: ${order.customer_phone}\n\n📦 Articles:\n${itemsList}\n\n💰 Total: ${order.total} FCFA`;

  // Send to your notification endpoint
  await fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order, message }),
  });
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
