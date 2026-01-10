import { Card } from '../common/Card';
import { MapPin } from 'lucide-react';

interface Listing {
  _id?: string;
  id?: string | number;
  title: string;
  price: number;
  unit: string;
  location: string;
  user?: string;
  sellerName?: string;
  verified: boolean;
  category: string;
  image?: string;
  images?: string[];
  desc?: string;
  description?: string;
}

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
}

export const ListingCard = ({ listing, onClick }: ListingCardProps) => {
  // Get the first image or use a placeholder
  const imageUrl = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : listing.image || 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <Card onClick={onClick} className="group">
      <div className="relative h-44 overflow-hidden">
        <img 
          src={imageUrl} 
          className="w-full h-full object-cover transition-transform group-hover:scale-110" 
          alt={listing.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-xl text-[#3A7D44] font-black text-xs shadow-sm">
          रू {listing.price.toLocaleString()}
        </div>
      </div>
      <div className="p-4">
        <span className="text-[9px] font-black text-[#6F4E37] uppercase bg-[#F5EFE6] px-2 py-0.5 rounded-lg mb-2 inline-block tracking-widest">
          {listing.category}
        </span>
        <h4 className="font-black text-sm line-clamp-1">{listing.title}</h4>
        <div className="flex items-center gap-1 mt-2 text-gray-400">
          <MapPin size={10}/>
          <span className="text-[10px] font-bold">{listing.location}</span>
        </div>
      </div>
    </Card>
  );
};

