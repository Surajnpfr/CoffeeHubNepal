import { Router } from 'express';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { requireModerator } from '../middleware/adminAuth.js';
import { validate } from '../middleware/validate.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import {
  createPrice,
  getPrices,
  getPriceById,
  updatePrice,
  updatePriceByVariety,
  deletePrice
} from '../services/priceService.js';

const router = Router();

const createPriceSchema = z.object({
  variety: z.string().min(1),
  price: z.number().min(0),
  image: z.string().optional()
});

const updatePriceSchema = z.object({
  price: z.number().min(0).optional(),
  image: z.string().optional()
}).refine(data => data.price !== undefined || data.image !== undefined, {
  message: 'At least price or image must be provided'
});

// Get all prices (public)
router.get('/', async (req, res) => {
  try {
    const prices = await getPrices();
    return res.json(prices);
  } catch (error) {
    console.error('Get prices error:', error);
    return res.status(500).json({ error: 'FAILED_TO_FETCH_PRICES' });
  }
});

// Get single price (public)
router.get('/:id', validateObjectId(), async (req, res) => {
  try {
    const price = await getPriceById(req.params.id);
    
    if (!price) {
      return res.status(404).json({ error: 'PRICE_NOT_FOUND' });
    }
    
    return res.json(price);
  } catch (error) {
    console.error('Get price error:', error);
    return res.status(500).json({ error: 'FAILED_TO_FETCH_PRICE' });
  }
});

// Create price (moderator only)
router.post('/', authenticate, requireModerator, validate(createPriceSchema), async (req: AuthRequest, res) => {
  try {
    const { User } = await import('../models/User.js');
    const user = await User.findById(req.userId).lean();
    
    if (!user) {
      return res.status(401).json({ error: 'USER_NOT_FOUND' });
    }

    const price = await createPrice(req.userId!, user.name || 'Moderator', req.body);
    return res.status(201).json(price);
  } catch (error: any) {
    if (error.message === 'VARIETY_EXISTS') {
      return res.status(409).json({ error: 'VARIETY_EXISTS', message: 'This variety already exists' });
    }
    console.error('Create price error:', error);
    return res.status(500).json({ 
      error: 'FAILED_TO_CREATE_PRICE',
      message: error.message || 'Failed to create price'
    });
  }
});

// Update price by ID (moderator only)
router.put('/:id', validateObjectId(), authenticate, requireModerator, validate(updatePriceSchema), async (req: AuthRequest, res) => {
  try {
    const { User } = await import('../models/User.js');
    const user = await User.findById(req.userId).lean();
    
    if (!user) {
      return res.status(401).json({ error: 'USER_NOT_FOUND' });
    }

    const price = await updatePrice(req.params.id, req.userId!, user.name || 'Moderator', req.body.price, req.body.image);
    
    if (!price) {
      return res.status(404).json({ error: 'PRICE_NOT_FOUND' });
    }
    
    return res.json(price);
  } catch (error: any) {
    if (error.message === 'PRICE_NOT_FOUND') {
      return res.status(404).json({ error: 'PRICE_NOT_FOUND' });
    }
    console.error('Update price error:', error);
    return res.status(500).json({ error: 'FAILED_TO_UPDATE_PRICE' });
  }
});

// Update price by variety (moderator only)
router.put('/variety/:variety', authenticate, requireModerator, validate(updatePriceSchema), async (req: AuthRequest, res) => {
  try {
    const { User } = await import('../models/User.js');
    const user = await User.findById(req.userId).lean();
    
    if (!user) {
      return res.status(401).json({ error: 'USER_NOT_FOUND' });
    }

    const price = await updatePriceByVariety(
      req.params.variety,
      req.userId!,
      user.name || 'Moderator',
      req.body.price,
      req.body.image
    );
    
    if (!price) {
      return res.status(404).json({ error: 'PRICE_NOT_FOUND' });
    }
    
    return res.json(price);
  } catch (error: any) {
    if (error.message === 'PRICE_NOT_FOUND') {
      return res.status(404).json({ error: 'PRICE_NOT_FOUND' });
    }
    console.error('Update price by variety error:', error);
    return res.status(500).json({ error: 'FAILED_TO_UPDATE_PRICE' });
  }
});

// Delete price (moderator only)
router.delete('/:id', validateObjectId(), authenticate, requireModerator, async (req: AuthRequest, res) => {
  try {
    await deletePrice(req.params.id);
    return res.json({ message: 'Price deleted successfully' });
  } catch (error) {
    console.error('Delete price error:', error);
    return res.status(500).json({ error: 'FAILED_TO_DELETE_PRICE' });
  }
});

export default router;

