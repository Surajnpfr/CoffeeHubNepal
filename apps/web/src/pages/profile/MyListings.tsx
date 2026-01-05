import { useState } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import { MOCK_LISTINGS } from '@/utils/mockData';
import { ListingDetail } from '@/pages/marketplace/ListingDetail';

export const MyListings = () => {
  const { setCurrentPage, navigate } = useApp();
  const [selectedListing, setSelectedListing] = useState<typeof MOCK_LISTINGS[0] | null>(null);
  const myListings = MOCK_LISTINGS; // In real app, filter by current user

  return (
    <div className="min-h-screen bg-[#F8F5F2] pb-32">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#EBE3D5] px-6 py-4 flex items-center gap-4">
        <button onClick={() => setCurrentPage('profile')} className="p-2 hover:bg-gray-100 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-black text-[#6F4E37] flex-1">My Listings</h2>
        <Button 
          variant="primary" 
          className="text-xs px-3"
          onClick={() => navigate('create-listing')}
        >
          <Plus size={14} /> New
        </Button>
      </div>

      <div className="p-6 space-y-4">
        {myListings.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 mb-4">No listings yet</p>
            <Button variant="primary" onClick={() => navigate('create-listing')}>
              <Plus size={16} /> Create Your First Listing
            </Button>
          </Card>
        ) : (
          myListings.map(listing => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                  <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 py-2">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-black text-base mb-1">{listing.title}</h3>
                      <p className="text-sm text-[#3A7D44] font-black">रू {listing.price} / {listing.unit}</p>
                    </div>
                    <Badge variant={listing.verified ? 'success' : 'primary'}>
                      {listing.verified ? 'Active' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{listing.desc}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 text-xs py-2" onClick={() => setSelectedListing(listing)}>
                      <Eye size={14} /> View
                    </Button>
                    <Button variant="outline" className="px-3 py-2">
                      <Edit size={14} />
                    </Button>
                    <Button variant="outline" className="px-3 py-2 text-red-600">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {selectedListing && (
        <ListingDetail 
          listing={selectedListing} 
          onClose={() => setSelectedListing(null)} 
        />
      )}
    </div>
  );
};

