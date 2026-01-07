# Delete Account Edge Function

This Supabase Edge Function securely handles account deletion for users.

## What it does

When a user deletes their account, this function:

1. **Verifies authentication** - Ensures the request is from an authenticated user
2. **Deletes profile pictures** - Removes all files from the `profile-pictures` storage bucket
3. **Deletes user profile** - Removes the user record from the `users` table (cascades to `attendance`)
4. **Deletes auth user** - Uses Admin API to permanently delete the user from Supabase Auth

## Why an Edge Function?

The Supabase Admin API (required to delete auth users) can only be called with the service role key, which must never be exposed to the client. This Edge Function provides a secure way to delete accounts while maintaining security.

## Deployment

Deploy this function using the Supabase CLI:

```bash
supabase functions deploy delete-account
```

## Testing locally

```bash
# Start local Supabase
supabase start

# Serve the function locally
supabase functions serve delete-account --env-file supabase/.env.local

# Test the function
curl -X POST http://localhost:54321/functions/v1/delete-account \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

## Environment Variables

The function uses these environment variables (automatically available in Supabase):

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public anon key for client operations
- `SUPABASE_SECRET_KEY` - Service role key for admin operations

## Integration

The function is called from `src/contexts/AuthContext.tsx` in the `deleteAccount()` method:

```typescript
const { data, error } = await supabase.functions.invoke('delete-account', {
  headers: {
    Authorization: `Bearer ${session.access_token}`
  }
})
```

## Error Handling

The function returns:

- `200` with `{ success: true }` on successful deletion
- `401` if the user is not authenticated
- `500` if deletion fails with an error message

## Security

- Requires valid authentication token
- Verifies user identity before deletion
- Uses service role only for privileged operations
- All operations are logged for audit purposes
