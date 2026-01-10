import { Price, PriceDocument, PriceTrend } from '../models/Price.js';
import mongoose from 'mongoose';

export interface CreatePriceData {
  variety: string;
  price: number;
}

export const createPrice = async (userId: string, userName: string, data: CreatePriceData): Promise<PriceDocument> => {
  // Check if variety already exists
  const existing = await Price.findOne({ variety: data.variety, active: true }).lean();
  
  if (existing) {
    throw new Error('VARIETY_EXISTS');
  }

  const price = new Price({
    variety: data.variety,
    price: data.price,
    previousPrice: data.price,
    change: '0.0%',
    trend: 'stable',
    updatedBy: new mongoose.Types.ObjectId(userId),
    updatedByName: userName,
    active: true
  });

  return await price.save();
};

export const getPrices = async (): Promise<any[]> => {
  return await Price.find({ active: true })
    .select('variety price change trend updatedAt')
    .sort({ variety: 1 })
    .lean();
};

export const getPriceById = async (id: string): Promise<any> => {
  return await Price.findById(id).lean();
};

export const updatePrice = async (id: string, userId: string, userName: string, newPrice: number): Promise<any> => {
  const price = await Price.findById(id).lean();
  
  if (!price) {
    throw new Error('PRICE_NOT_FOUND');
  }

  const previousPrice = price.price;
  const change = ((newPrice - previousPrice) / previousPrice) * 100;
  const changeStr = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  
  let trend: PriceTrend = 'stable';
  if (change > 0.1) trend = 'up';
  else if (change < -0.1) trend = 'down';

  const updated = await Price.findByIdAndUpdate(
    id,
    {
      price: newPrice,
      previousPrice: previousPrice,
      change: changeStr,
      trend,
      updatedBy: new mongoose.Types.ObjectId(userId),
      updatedByName: userName
    },
    { new: true, runValidators: true }
  ).lean();

  return updated;
};

export const updatePriceByVariety = async (variety: string, userId: string, userName: string, newPrice: number): Promise<any> => {
  const price = await Price.findOne({ variety, active: true }).lean();
  
  if (!price) {
    throw new Error('PRICE_NOT_FOUND');
  }

  return await updatePrice(price._id.toString(), userId, userName, newPrice);
};

export const deletePrice = async (id: string): Promise<boolean> => {
  await Price.findByIdAndUpdate(id, { active: false });
  return true;
};

