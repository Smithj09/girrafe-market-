# Order Notification Setup

This setup sends email and WhatsApp notifications to admin when a new order is created.

## Prerequisites

1. **Resend Account** (for email)
   - Sign up at https://resend.com
   - Get your API key
   - Verify your domain or use test mode

2. **Twilio Account** (for WhatsApp)
   - Sign up at https://www.twilio.com
   - Enable WhatsApp sandbox or get approved sender
   - Get Account SID and Auth Token

## Setup Steps

### 1. Deploy Edge Function

```bash
# Login to Supabase
npx supabase login

# Link your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Set environment variables
npx supabase secrets set RESEND_API_KEY=your_resend_api_key
npx supabase secrets set TWILIO_ACCOUNT_SID=your_twilio_account_sid
npx supabase secrets set TWILIO_AUTH_TOKEN=your_twilio_auth_token
npx supabase secrets set TWILIO_WHATSAPP_NUMBER=+14155238886
npx supabase secrets set ADMIN_WHATSAPP_NUMBER=+8618801581033

# Deploy function
npx supabase functions deploy notify-order
```

### 2. Run Migration

Run the SQL in `supabase/migrations/003_order_notifications.sql` in your Supabase SQL Editor.

### 3. Alternative: Simple Webhook (No Edge Function)

If you prefer a simpler approach without Edge Functions, update `orders.ts`:

```typescript
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

  // Send notification to your backend
  try {
    await fetch('YOUR_BACKEND_URL/notify-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error('Notification failed:', err);
  }

  return data;
}
```

## Testing

1. Create a test order in your app
2. Check admin email inbox
3. Check admin WhatsApp for message

## Free Alternatives

- **Email**: Use SendGrid (100 emails/day free) or Mailgun
- **WhatsApp**: Use WhatsApp Business API or services like Vonage, MessageBird
- **Simple**: Use Zapier/Make.com to connect Supabase webhooks to email/WhatsApp
