# Real Data Implementation - Complete

## ✅ What Was Implemented

### 1. Database Models Created
- **Job** (`apps/api/src/models/Job.ts`) - Job listings
- **Application** (`apps/api/src/models/Application.ts`) - Job applications
- **Product** (`apps/api/src/models/Product.ts`) - Marketplace product listings
- **Price** (`apps/api/src/models/Price.ts`) - Coffee price board (moderator-managed)

### 2. API Services Created
- **Job Service** (`apps/api/src/services/jobService.ts`) - CRUD operations for jobs and applications
- **Product Service** (`apps/api/src/services/productService.ts`) - CRUD operations for products
- **Price Service** (`apps/api/src/services/priceService.ts`) - Price management (moderator-only)

### 3. API Routes Created
- **`/jobs`** - Job listings and applications
- **`/products`** - Marketplace products
- **`/prices`** - Coffee prices (public read, moderator-only write)

### 4. Frontend Services Updated
- **Job Service** (`apps/web/src/services/job.service.ts`) - Now uses real API
- **Marketplace Service** (`apps/web/src/services/marketplace.service.ts`) - Now uses real API
- **Price Service** (`apps/web/src/services/price.service.ts`) - New service for prices

### 5. Frontend Pages Updated
- **Jobs Page** - Now loads real jobs from API
- **Price Board** - Now loads real prices from API

## 🔧 What You Need to Do

### Step 1: Create Azure Collections

You need to create 4 new collections in Azure Cosmos DB:

1. **`jobs`** - Job listings
2. **`applications`** - Job applications  
3. **`products`** - Marketplace products
4. **`prices`** - Coffee prices

**See `apps/api/AZURE_COLLECTIONS_SETUP.md` for detailed instructions.**

### Step 2: Set Up Moderator Users

Prices can only be managed by moderators. You need to:

1. Set user role to `moderator` in the database (or use admin panel)
2. Moderators can create, update, and delete prices
3. Regular users can only view prices

**To set a user as moderator:**
```bash
cd apps/api
npm run set-admin <user-email>
# Then manually change role to 'moderator' in Azure Portal
```

Or use the admin panel to change user roles.

### Step 3: Remove Mock Data (Optional)

Mock data files are still in the codebase but no longer used in:
- Jobs page ✅
- Price Board ✅

You can safely delete `apps/web/src/utils/mockData.ts` after verifying everything works, or keep it for reference.

## 📋 API Endpoints

### Jobs
- `GET /jobs` - Get all jobs (with filters)
- `GET /jobs/:id` - Get single job
- `POST /jobs` - Create job (auth required)
- `PUT /jobs/:id` - Update job (auth + owner)
- `DELETE /jobs/:id` - Delete job (auth + owner)
- `POST /jobs/:id/apply` - Apply to job (auth required)
- `GET /jobs/:id/applications` - Get applications (auth + owner)
- `PUT /jobs/:id/applications/:applicationId` - Update application status (auth + owner)

### Products
- `GET /products` - Get all products (with filters)
- `GET /products/:id` - Get single product
- `POST /products` - Create product (auth required)
- `PUT /products/:id` - Update product (auth + owner)
- `DELETE /products/:id` - Delete product (auth + owner)
- `POST /products/:id/sold` - Mark as sold (auth + owner)

### Prices
- `GET /prices` - Get all prices (public)
- `GET /prices/:id` - Get single price (public)
- `POST /prices` - Create price (moderator only)
- `PUT /prices/:id` - Update price (moderator only)
- `PUT /prices/variety/:variety` - Update price by variety (moderator only)
- `DELETE /prices/:id` - Delete price (moderator only)

## 🔐 Access Control

### Jobs
- **Create**: Any authenticated user
- **Update/Delete**: Only job creator
- **View Applications**: Only job creator
- **Apply**: Any authenticated user

### Products
- **Create**: Any authenticated user
- **Update/Delete**: Only product seller
- **View**: Public (active products only)

### Prices
- **View**: Public
- **Create/Update/Delete**: Moderators and Admins only

## 📝 Notes

1. **Products vs Blog**: Products use a **separate collection** (`products`), not the blog collection. This keeps data organized and allows different features.

2. **Real Data Only**: All data is now stored in the database. No demo/mock data is used for:
   - Jobs ✅
   - Products ✅
   - Prices ✅

3. **Backward Compatibility**: Frontend services include `id` field for backward compatibility with existing components.

4. **Performance**: All queries use `.lean()` for better performance and include proper indexes.

## 🚀 Next Steps

1. ✅ Create Azure collections (see `AZURE_COLLECTIONS_SETUP.md`)
2. ✅ Deploy updated code
3. ✅ Test job creation and listing
4. ✅ Test product creation and listing
5. ✅ Set up moderator users for price management
6. ✅ Test price management (as moderator)
7. ⏳ Update remaining frontend pages that still use mock data (if any)

## 🐛 Troubleshooting

### "Collection not found" errors
- Make sure you created all 4 collections in Azure Portal
- Check collection names match exactly (lowercase)

### "Moderator access required" for prices
- Set user role to `moderator` or `admin` in database
- Use admin panel or Azure Portal to change role

### Jobs/Products not showing
- Check API is running and accessible
- Check browser console for errors
- Verify collections exist in Azure

