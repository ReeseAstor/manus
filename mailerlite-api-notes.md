# MailerLite API Integration Notes

## API Endpoint
- Base URL: `https://connect.mailerlite.com/api`
- Create/Upsert Subscriber: `POST https://connect.mailerlite.com/api/subscribers`

## Authentication
- Method: Bearer token
- Header: `Authorization: Bearer {API_KEY}`

## Required Headers
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {API_KEY}
```

## Create Subscriber Request

### Required Parameters
- `email` (string): Valid email address

### Optional Parameters
- `fields` (object): Custom fields like name, last_name
- `groups` (array): Array of group IDs to add subscriber to
- `status` (string): active, unsubscribed, unconfirmed, bounced, junk
- `subscribed_at` (string): Date in format yyyy-MM-dd HH:mm:ss
- `resubscribe` (bool): Set to true to resubscribe previously unsubscribed

### Example Request Body
```json
{
  "email": "user@example.com",
  "fields": {
    "name": "John",
    "last_name": "Doe"
  },
  "groups": ["4243829086487936"]
}
```

### Response Codes
- 201 Created: Subscriber was created
- 200 OK: Subscriber already exists and was updated
- 401 Unauthorized: Invalid API token
- 422 Unprocessable Entity: Validation error

## Rate Limits
- 120 requests per minute
- Use batch endpoint if hitting limits

## Getting API Key
1. Open MailerLite dashboard
2. Navigate to Integrations
3. Choose "MailerLite API"
4. Click "Generate new token"
5. Copy and store immediately (cannot be shown again)
