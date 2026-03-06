import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    const { order_id, customer_name, customer_email, customer_phone, total, items, admin_email } = await req.json()

    // Format order items for message
    const itemsList = items.map((item: any) => 
      `${item.product_name} x${item.quantity} - ${item.product_price * item.quantity} FCFA`
    ).join('\n')

    const message = `🛒 NOUVELLE COMMANDE #${order_id.slice(0, 8)}

👤 Client: ${customer_name}
📧 Email: ${customer_email}
📱 Téléphone: ${customer_phone}

📦 Articles:
${itemsList}

💰 Total: ${total} FCFA`

    // Send Email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'DorMark <orders@dormark.com>',
        to: admin_email || 'admin@dormark.com',
        subject: `Nouvelle commande #${order_id.slice(0, 8)}`,
        text: message,
      }),
    })

    // Send WhatsApp using Twilio
    const whatsappResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${Deno.env.get('TWILIO_ACCOUNT_SID')}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${Deno.env.get('TWILIO_ACCOUNT_SID')}:${Deno.env.get('TWILIO_AUTH_TOKEN')}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: `whatsapp:${Deno.env.get('TWILIO_WHATSAPP_NUMBER')}`,
          To: `whatsapp:${Deno.env.get('ADMIN_WHATSAPP_NUMBER')}`,
          Body: message,
        }),
      }
    )

    return new Response(
      JSON.stringify({ 
        success: true, 
        email: await emailResponse.json(),
        whatsapp: await whatsappResponse.json()
      }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})
