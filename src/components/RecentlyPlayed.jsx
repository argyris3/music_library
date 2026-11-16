import { Swiper, SwiperSlide } from 'swiper/react';
import useMusicLibrary from '../contexts/useMusicLibrary';

import '../index.css';
import { Autoplay, EffectCube } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/autoplay';

const RecentlyPlayed = () => {
  const { albums } = useMusicLibrary();

  return (
    <aside className="mb-10 mt-5 w-full min-w-0 px-4 text-slate-200 lg:w-[40%]">
      <h2 className="mb-3 py-4 text-end text-2xl italic">Recently Added</h2>

      <Swiper
        effect="cube"
        grabCursor
        loop
        slidesPerView={1}
        speed={700}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        }}
        modules={[Autoplay, EffectCube]}
        className="playlist-swiper2 mx-auto"
      >
        {albums.slice(-4).map((album) => (
          <SwiperSlide key={album.id}>
            <img className="h-full w-full object-cover" src={album.cover} alt={`${album.album} album cover`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </aside>
  );
};
export default RecentlyPlayed;
