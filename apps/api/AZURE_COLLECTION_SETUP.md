# Azure Cosmos DB Collection Setup

## Problem
Azure Cosmos DB is rejecting collection creation because it would exceed the throughput limit (1000 RU/s total).

## Solution: Create Collections Manually

You need to create the `blogposts` collection manually in Azure Portal before using it.

### Steps:

1. **Go to Azure Portal**
   - Navigate to your Cosmos DB account: `coffeehub-mongo-dev`
   - Click on **"Data Explorer"** in the left menu

2. **Select Database**
   - Expand your database: `coffeehubnepal`
   - If it doesn't exist, create it first (with shared throughput or autoscale)

3. **Create Collection**
   - Click **"New Collection"** or the **"+"** button next to Collections
   - Fill in:
     - **Collection Id**: `blogposts` (must match exactly, lowercase)
     - **Shard Key**: `_id` (or leave default)
     - **Throughput**: 
       - Option 1: **Manual** - Set to `400` RU/s (or lower if you have other collections)
       - Option 2: **Autoscale** - Set max to `400` RU/s
   - Click **"OK"** to create

4. **Verify Existing Collections**
   - Make sure you also have a `users` collection (for authentication)
   - If not, create it with the same settings

### Alternative: Use Azure CLI

```bash
az cosmosdb mongodb collection create \
  --account-name coffeehub-mongo-dev \
  --database-name coffeehubnepal \
  --name blogposts \
  --shard _id \
  --throughput 400
```

### Throughput Calculation

Your account has **1000 RU/s total**. If you have:
- `users` collection: 400 RU/s
- `blogposts` collection: 400 RU/s
- Total: 800 RU/s (within limit)

You can adjust these values based on your needs, but the total must not exceed 1000 RU/s.

### After Creating Collections

Once collections are created, restart your API server and try creating a blog post again. The collections will already exist, so Azure won't try to create them with default throughput.

