import { Price, PriceDocument, PriceTrend } from '../models/Price.js';
import mongoose from 'mongoose';

export interface CreatePriceData {
  variety: string;
  price: number;
  image?: string;
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
    image: data.image,
    updatedBy: new mongoose.Types.ObjectId(userId),
    updatedByName: userName,
    active: true
  });

  return await price.save();
};

export const getPrices = async (): Promise<any[]> => {
  return await Price.find({ active: true })
    .select('variety price change trend image updatedAt')
    .sort({ variety: 1 })
    .lean();
};

export const getPriceById = async (id: string): Promise<any> => {
  return await Price.findById(id).lean();
};

export const updatePrice = async (id: string, userId: string, userName: string, newPrice?: number, image?: string): Promise<any> => {
  const price = await Price.findById(id).lean();
  
  if (!price) {
    throw new Error('PRICE_NOT_FOUND');
  }

  const updateData: any = {
    updatedBy: new mongoose.Types.ObjectId(userId),
    updatedByName: userName
  };

  // Update price if provided
  if (newPrice !== undefined) {
    const previousPrice = price.price;
    const change = ((newPrice - previousPrice) / previousPrice) * 100;
    const changeStr = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    
    let trend: PriceTrend = 'stable';
    if (change > 0.1) trend = 'up';
    else if (change < -0.1) trend = 'down';

    updateData.price = newPrice;
    updateData.previousPrice = previousPrice;
    updateData.change = changeStr;
    updateData.trend = trend;
  }

  // Update image if provided
  if (image !== undefined) {
    updateData.image = image;
  }

  const updated = await Price.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).lean();

  return updated;
};

export const updatePriceByVariety = async (variety: string, userId: string, userName: string, newPrice?: number, image?: string): Promise<any> => {
  const price = await Price.findOne({ variety, active: true }).lean();
  
  if (!price) {
    throw new Error('PRICE_NOT_FOUND');
  }

  return await updatePrice(price._id.toString(), userId, userName, newPrice, image);
};

export const deletePrice = async (id: string): Promise<boolean> => {
  await Price.findByIdAndUpdate(id, { active: false });
  return true;
};

