import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Coffee Harvest Festival 2024",
    date: "March 15, 2024",
    time: "9:00 AM",
    location: "Pokhara, Kaski",
    attendees: 150,
    type: "Festival",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400"
  },
  {
    id: 2,
    title: "Organic Farming Workshop",
    date: "March 22, 2024",
    time: "10:00 AM",
    location: "Kathmandu",
    attendees: 45,
    type: "Workshop",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400"
  },
  {
    id: 3,
    title: "Coffee Cupping Session",
    date: "March 28, 2024",
    time: "2:00 PM",
    location: "Lalitpur",
    attendees: 30,
    type: "Training",
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=400"
  }
];

export const Events = () => {
  const { navigate } = useApp();
  
  return (
    <div className="p-6 space-y-6 animate-in fade-in pb-32">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black">Events</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Upcoming Events</p>
        </div>
        <Button variant="primary" className="text-xs">
          + Create Event
        </Button>
      </div>

      <div className="space-y-6">
        {MOCK_EVENTS.map(event => (
          <Card key={event.id} className="overflow-hidden">
            <div className="relative h-48">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4">
                <Badge variant="primary">{event.type}</Badge>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-black mb-4">{event.title}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-[#6F4E37]" />
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase">Date</p>
                    <p className="font-black">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-[#6F4E37]" />
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase">Time</p>
                    <p className="font-black">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-[#6F4E37]" />
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase">Location</p>
                    <p className="font-black">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-[#6F4E37]" />
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase">Attendees</p>
                    <p className="font-black">{event.attendees} registered</p>
                  </div>
                </div>
              </div>

              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => navigate('event-detail', event.id)}
              >
                View Details <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

