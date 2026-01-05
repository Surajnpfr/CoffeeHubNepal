import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { MapPin, MessageCircle, Phone } from 'lucide-react';

interface Listing {
  id: number;
  title: string;
  price: number;
  unit: string;
  location: string;
  user: string;
  verified: boolean;
  category: string;
  image: string;
  desc: string;
}

interface ListingDetailProps {
  listing: Listing;
  onClose: () => void;
}

export const ListingDetail = ({ listing, onClose }: ListingDetailProps) => (
  <Modal onClose={onClose}>
    <img src={listing.image} className="w-full h-80 object-cover" alt={listing.title} />
    <div className="p-8 pb-12">
      <div className="flex justify-between items-start mb-6">
        <div>
          <Badge variant="success">Available Now</Badge>
          <h3 className="text-2xl font-black mt-2">{listing.title}</h3>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-[#3A7D44]">रू {listing.price.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">per {listing.unit}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl mb-8 flex items-center gap-4 border border-[#EBE3D5]">
        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center font-black text-amber-600">
          SF
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-gray-400 uppercase">Seller Info</p>
          <p className="font-black text-sm">{listing.user}</p>
          <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
            <MapPin size={10}/> {listing.location}
          </p>
        </div>
        <Button variant="outline" className="px-3 rounded-xl">
          <MessageCircle size={18}/>
        </Button>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-10">{listing.desc}</p>

      <div className="flex gap-4">
        <Button 
          variant="secondary" 
          className="flex-1 py-4 text-base" 
          onClick={() => window.location.href = `tel:+9779800000000`}
        >
          <Phone size={20}/> Call Seller
        </Button>
        <Button variant="primary" className="flex-1 py-4 text-base">
          Negotiate
        </Button>
      </div>
    </div>
  </Modal>
);

