# How to Set a User to Admin Role

There are several ways to set a user to admin role in the database:

## Method 1: Using the Script (Recommended)

The easiest way is to use the provided script:

```bash
cd apps/api
npm run set-admin <user-email>
```

**Example:**
```bash
npm run set-admin admin@coffeehubnepal.com
```

This will:
- Connect to your database
- Find the user by email
- Set their role to `admin`
- Display confirmation

## Method 2: Azure Portal Data Explorer

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Cosmos DB account
3. Click **"Data Explorer"** in the left menu
4. Expand your database (`coffeehubnepal`)
5. Click on the **`users`** collection
6. Find the user document (you can filter by email)
7. Click **"Edit"** on the document
8. Find the `role` field and change it to `"admin"`
9. Click **"Update"**

**Note:** Make sure the `role` field value is exactly `"admin"` (with quotes in JSON).

## Method 3: MongoDB Compass or Shell

If you have MongoDB Compass or MongoDB shell connected:

**Using MongoDB Shell:**
```javascript
use coffeehubnepal
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

**Using MongoDB Compass:**
1. Connect to your Azure Cosmos DB using the connection string
2. Navigate to `coffeehubnepal` database → `users` collection
3. Find the user document
4. Edit the document and change `role` to `"admin"`
5. Save

## Method 4: Using the Admin API (After First Admin is Created)

Once you have at least one admin user, you can use the admin panel in the web app to change user roles:

1. Log in as an admin user
2. Go to Profile → Admin Panel
3. Navigate to Users
4. Select the user and change their role using the dropdown

## Important Notes

- The `role` field must be one of: `'farmer'`, `'roaster'`, `'trader'`, `'exporter'`, `'expert'`, `'admin'`, or `'moderator'`
- Make sure the user exists in the database before trying to update
- After changing the role, the user may need to log out and log back in for the changes to take effect
- The JWT token contains the role, so users will need a new token (via login) to get the updated role

## Troubleshooting

**Script fails to connect:**
- Make sure your `.env` file has the correct `MONGO_URI`
- Check that your Azure Cosmos DB firewall allows your IP address
- Verify the connection string is correct

**User not found:**
- Make sure the email is correct (case-insensitive)
- Check that the user has registered and exists in the `users` collection

**Role not updating:**
- Clear browser cache and localStorage
- Log out and log back in to get a new JWT token with the updated role

