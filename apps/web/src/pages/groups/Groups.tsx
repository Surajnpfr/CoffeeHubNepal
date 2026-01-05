import { Users, MessageSquare, Lock, Globe, ArrowRight } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';

const MOCK_GROUPS = [
  {
    id: 1,
    name: "Kaski Coffee Farmers",
    members: 245,
    posts: 89,
    type: "public",
    description: "A community for coffee farmers in Kaski district",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400"
  },
  {
    id: 2,
    name: "Organic Coffee Nepal",
    members: 180,
    posts: 56,
    type: "public",
    description: "Discussing organic farming practices",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400"
  },
  {
    id: 3,
    name: "Coffee Exporters Network",
    members: 95,
    posts: 34,
    type: "private",
    description: "Private group for verified exporters",
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=400"
  }
];

export const Groups = () => {
  const { navigate } = useApp();
  
  return (
    <div className="p-6 space-y-6 animate-in fade-in pb-32">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black">Groups</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Community Groups</p>
        </div>
        <Button variant="primary" className="text-xs">
          + Create Group
        </Button>
      </div>

      <div className="space-y-4">
        {MOCK_GROUPS.map(group => (
          <Card key={group.id} className="overflow-hidden">
            <div className="relative h-32">
              <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                {group.type === 'private' ? (
                  <Badge variant="alert" className="text-[8px]">
                    <Lock size={10} className="inline mr-1" /> Private
                  </Badge>
                ) : (
                  <Badge variant="success" className="text-[8px]">
                    <Globe size={10} className="inline mr-1" /> Public
                  </Badge>
                )}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-black mb-2">{group.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{group.description}</p>
              
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-xs font-black text-gray-600">{group.members} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-gray-400" />
                  <span className="text-xs font-black text-gray-600">{group.posts} posts</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('group-detail', group.id)}
              >
                View Group <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

