import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMusic } from '../hooks/useFirestore';
import Loading from '../components/common/Loading';
import { Music as MusicIcon } from 'lucide-react';
import FeaturedContentModal from '../components/FeaturedContentModal';

export const Music = () => {
  const { data: music, loading } = useMusic();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<any>(null);

  if (loading) {
    return <Loading fullScreen message="Loading music..." />;
  }

  const openModal = (musicItem: any) => {
    setSelectedMusic(musicItem);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMusic(null);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-beige">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-grey-dark mb-4">
            Music
          </h1>
          <p className="text-lg text-grey max-w-2xl mx-auto">
            Explore my musical recordings and performances
          </p>
        </motion.div>

        {music && music.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {music.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => openModal(item)}
                className="card group cursor-pointer text-left hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                {/* Cover Image */}
                <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-800">
                  {item.coverImageURL ? (
                    <img
                      src={item.coverImageURL}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MusicIcon className="w-16 h-16 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="font-display text-xl font-bold text-grey-dark mb-2">
                  {item.title}
                </h3>
                {item.artist && (
                  <p className="text-sm text-grey mb-2">
                    {item.artist}
                  </p>
                )}
                {item.description && (
                  <p className="text-sm text-grey mb-4 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Platform indicators */}
                <div className="flex flex-wrap gap-2">
                  {item.spotifyURL && (
                    <span className="text-xs px-2 py-1 bg-beige-dark text-grey-dark rounded-full">
                      Spotify
                    </span>
                  )}
                  {item.appleMusicURL && (
                    <span className="text-xs px-2 py-1 bg-beige-dark text-grey-dark rounded-full">
                      Apple Music
                    </span>
                  )}
                  {item.youtubeURL && (
                    <span className="text-xs px-2 py-1 bg-beige-dark text-grey-dark rounded-full">
                      YouTube
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <MusicIcon className="w-16 h-16 text-grey mx-auto mb-4" />
            <p className="text-grey">
              No music has been added yet. Check back soon!
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <FeaturedContentModal
        isOpen={modalOpen}
        onClose={closeModal}
        content={selectedMusic}
        type="music"
      />
    </div>
  );
};

export default Music;
