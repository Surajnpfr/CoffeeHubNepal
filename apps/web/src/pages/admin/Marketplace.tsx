import { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Search } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { marketplaceService, Listing } from '@/services/marketplace.service';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';

export const Marketplace = () => {
  const { user: currentUser, isAuthenticated } = useAuth();
  const { setCurrentPage, setSubPage } = useApp();
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [removeReason, setRemoveReason] = useState('');
  const [isRemoving, setIsRemoving] = useState(false);
  
  // Redirect if not authenticated or not admin/moderator
  useEffect(() => {
    if (!isAuthenticated || (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator'))) {
      setCurrentPage('home');
      setSubPage(null);
    }
  }, [isAuthenticated, currentUser, setCurrentPage, setSubPage]);
  
  // Don't render if user doesn't have access
  if (!isAuthenticated || !currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
    return null;
  }

  useEffect(() => {
    loadListings();
  }, [searchQuery]);

  const loadListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceService.getListings({
        search: searchQuery || undefined,
        limit: 100
      });
      // Show all listings including inactive ones for admin view
      setListings(response.products);
    } catch (err: any) {
      console.error('Failed to load listings:', err);
      setError(err.message || 'Failed to load listings');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveClick = (listing: Listing) => {
    setSelectedListing(listing);
    setRemoveReason('');
    setShowRemoveDialog(true);
  };

  const handleRemove = async () => {
    if (!selectedListing || !removeReason.trim()) {
      setError('Please provide a reason for removing the listing');
      return;
    }

    setIsRemoving(true);
    setError(null);
    try {
      await marketplaceService.adminRemoveListing(selectedListing._id || selectedListing.id!, removeReason.trim());
      setShowRemoveDialog(false);
      setSelectedListing(null);
      setRemoveReason('');
      await loadListings(); // Reload listings
    } catch (err: any) {
      console.error('Failed to remove listing:', err);
      setError(err.message || 'Failed to remove listing');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] pb-32">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#EBE3D5] px-6 py-4 flex items-center gap-4">
        <button 
          onClick={() => {
            setCurrentPage('admin');
            setSubPage(null);
          }} 
          className="p-2 hover:bg-gray-100 rounded-xl"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-black text-[#6F4E37]">Manage Marketplace</h2>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <Card className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </div>
              <Input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-[#6F4E37] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm">Loading listings...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No listings found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map(listing => (
                <Card key={listing._id || listing.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-black text-lg">{listing.title}</h3>
                        {!listing.active && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
                            Removed
                          </span>
                        )}
                        {listing.sold && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                            Sold
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{listing.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Seller: {listing.sellerName}</span>
                        <span>Price: ₹{listing.price}/{listing.unit}</span>
                        <span>Location: {listing.location}</span>
                        <span>Category: {listing.category}</span>
                      </div>
                    </div>
                    {listing.active && !listing.sold && (
                      <Button
                        variant="outline"
                        onClick={() => handleRemoveClick(listing)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>

      <ConfirmDialog
        isOpen={showRemoveDialog}
        onCancel={() => {
          setShowRemoveDialog(false);
          setSelectedListing(null);
          setRemoveReason('');
        }}
        onConfirm={handleRemove}
        title="Remove Listing"
        message={
          <div className="space-y-4">
            <p>Are you sure you want to remove "{selectedListing?.title}"? The seller will be notified with the reason you provide.</p>
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Reason for Removal <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={removeReason}
                onChange={(e) => setRemoveReason(e.target.value)}
                placeholder="Enter the reason for removing this listing (this will be sent to the seller)..."
                rows={4}
                maxLength={500}
                required
              />
              <p className="text-xs text-gray-500">
                This reason will be sent to the seller via notification.
              </p>
            </div>
          </div>
        }
        confirmText="Remove Listing"
        variant="danger"
        isLoading={isRemoving}
      />
    </div>
  );
};
