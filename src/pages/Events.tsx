import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUpcomingEvents, usePastEvents } from '../hooks/useFirestore';
import Loading from '../components/common/Loading';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import FeaturedContentModal from '../components/FeaturedContentModal';

export const Events = () => {
  const { data: allUpcoming, loading: loadingUpcoming } = useUpcomingEvents();
  const { data: allPast, loading: loadingPast } = usePastEvents();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const openModal = (event: any) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  if (loadingUpcoming && loadingPast) {
    return <Loading fullScreen message="Loading events..." />;
  }

  // Filter events client-side
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = allUpcoming?.filter((event: any) => {
    if (!event.date) return false;
    const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date);
    return eventDate >= today;
  }) || [];

  const pastEvents = allPast?.filter((event: any) => {
    if (!event.date) return false;
    const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date);
    return eventDate < today;
  }) || [];

  const EventCard = ({ event, index }: { event: any; index: number }) => {
    // Handle date conversion safely
    const eventDate = event.date?.toDate ? event.date.toDate() : (event.date ? new Date(event.date) : null);

    return (
      <motion.button
        onClick={() => openModal(event)}
        className="card w-full text-left hover:shadow-xl transition-shadow cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Date Badge */}
          <div className="flex-shrink-0 w-20 h-20 bg-grey-dark text-white rounded-lg flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">
              {eventDate ? eventDate.getDate() : ''}
            </span>
            <span className="text-xs uppercase">
              {eventDate ? eventDate.toLocaleDateString('en-US', { month: 'short' }) : ''}
            </span>
          </div>

          {/* Event Details */}
          <div className="flex-grow">
            <h3 className="font-display text-2xl font-bold text-grey-dark mb-2">
              {event.title}
            </h3>

            <div className="flex flex-col gap-2 mb-4 text-sm text-grey">
              {eventDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(eventDate)}</span>
                </div>
              )}

            {event.time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {event.description && (
            <p className="text-grey mb-4 line-clamp-3">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </motion.button>
    );
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-beige">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-grey-dark mb-4">
            Events
          </h1>
          <p className="text-lg text-grey max-w-2xl mx-auto">
            Join me for upcoming performances and events
          </p>
        </motion.div>

        {/* Upcoming Events */}
        {upcomingEvents && upcomingEvents.length > 0 && (
          <div className="mb-16">
            <h2 className="font-display text-3xl font-bold text-grey-dark mb-8">
              Upcoming Events
            </h2>
            <div className="space-y-6">
              {upcomingEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents && pastEvents.length > 0 && (
          <div>
            <h2 className="font-display text-3xl font-bold text-grey-dark mb-8">
              Past Events
            </h2>
            <div className="space-y-6 opacity-75">
              {pastEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        )}

        {(!upcomingEvents || upcomingEvents.length === 0) &&
          (!pastEvents || pastEvents.length === 0) && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Calendar className="w-16 h-16 text-grey mx-auto mb-4" />
              <p className="text-grey">
                No events scheduled at this time. Check back soon!
              </p>
            </motion.div>
          )}
      </div>

      {/* Modal */}
      <FeaturedContentModal
        isOpen={modalOpen}
        onClose={closeModal}
        content={selectedEvent}
        type="event"
      />
    </div>
  );
};

export default Events;
