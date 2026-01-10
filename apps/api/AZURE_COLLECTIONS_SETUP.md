# Azure Cosmos DB Collections Setup

## Required Collections

Your CoffeeHub Nepal application requires the following collections in Azure Cosmos DB:

### Existing Collections
1. **`users`** - User accounts and authentication
2. **`blogposts`** - Blog posts and articles
3. **`reports`** - User reports and moderation

### New Collections (Required)
4. **`jobs`** - Job listings
5. **`applications`** - Job applications
6. **`products`** - Marketplace product listings
7. **`prices`** - Coffee price board (managed by moderators)

## Setup Instructions

### Step 1: Go to Azure Portal
1. Navigate to your Cosmos DB account: `coffeehub-mongo-dev`
2. Click on **"Data Explorer"** in the left menu

### Step 2: Select Database
- Expand your database: `coffeehubnepal`
- If it doesn't exist, create it first (with shared throughput or autoscale)

### Step 3: Create Each Collection

For each collection below, click **"New Collection"** or the **"+"** button:

#### Collection: `jobs`
- **Collection Id**: `jobs` (must match exactly, lowercase)
- **Shard Key**: `_id` (or leave default)
- **Throughput**: `200` RU/s (or use autoscale with max 200)

#### Collection: `applications`
- **Collection Id**: `applications` (must match exactly, lowercase)
- **Shard Key**: `_id` (or leave default)
- **Throughput**: `200` RU/s (or use autoscale with max 200)

#### Collection: `products`
- **Collection Id**: `products` (must match exactly, lowercase)
- **Shard Key**: `_id` (or leave default)
- **Throughput**: `200` RU/s (or use autoscale with max 200)

#### Collection: `prices`
- **Collection Id**: `prices` (must match exactly, lowercase)
- **Shard Key**: `_id` (or leave default)
- **Throughput**: `100` RU/s (or use autoscale with max 100)

### Step 4: Verify Throughput

Your account has **1000 RU/s total**. Recommended distribution:
- `users`: 200 RU/s
- `blogposts`: 300 RU/s
- `reports`: 100 RU/s
- `jobs`: 200 RU/s
- `applications`: 100 RU/s
- `products`: 200 RU/s
- `prices`: 100 RU/s
- **Total**: 1200 RU/s (you may need to increase account throughput or adjust)

**Alternative**: Use **shared throughput** at the database level (autoscale) to automatically distribute RU/s across collections.

### Step 5: Restart Application

After creating all collections, restart your API server. The collections will already exist, so Azure won't try to create them with default throughput.

## Using Azure CLI (Alternative)

If you prefer using Azure CLI:

```bash
# Jobs collection
az cosmosdb mongodb collection create \
  --account-name coffeehub-mongo-dev \
  --database-name coffeehubnepal \
  --name jobs \
  --shard _id \
  --throughput 200

# Applications collection
az cosmosdb mongodb collection create \
  --account-name coffeehub-mongo-dev \
  --database-name coffeehubnepal \
  --name applications \
  --shard _id \
  --throughput 200

# Products collection
az cosmosdb mongodb collection create \
  --account-name coffeehub-mongo-dev \
  --database-name coffeehubnepal \
  --name products \
  --shard _id \
  --throughput 200

# Prices collection
az cosmosdb mongodb collection create \
  --account-name coffeehub-mongo-dev \
  --database-name coffeehubnepal \
  --name prices \
  --shard _id \
  --throughput 100
```

## Notes

- All collections use `_id` as the shard key (default)
- Throughput can be adjusted later based on usage
- Collections are created automatically on first write, but it's better to create them manually to control throughput
- Prices collection is managed by moderators only (create/update/delete requires moderator role)

