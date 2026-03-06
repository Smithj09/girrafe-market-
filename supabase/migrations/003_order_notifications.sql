-- Create a function to notify admin on new order
create or replace function notify_admin_new_order()
returns trigger as $$
declare
  admin_email text;
  admin_phone text;
begin
  -- Get admin email and phone from profiles table
  select email into admin_email from auth.users 
  join profiles on auth.users.id = profiles.id 
  where profiles.is_admin = true limit 1;
  
  -- Call edge function to send notifications
  perform
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/notify-order',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_anon_key')
      ),
      body := jsonb_build_object(
        'order_id', new.id,
        'customer_name', new.customer_name,
        'customer_email', new.customer_email,
        'customer_phone', new.customer_phone,
        'total', new.total,
        'items', new.items,
        'admin_email', admin_email
      )
    );
  
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger on orders table
drop trigger if exists on_order_created on orders;
create trigger on_order_created
  after insert on orders
  for each row
  execute function notify_admin_new_order();
