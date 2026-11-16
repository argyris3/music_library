import { Swiper, SwiperSlide } from 'swiper/react';

import jazzLounge from '../assets2/jazzPlaylist.jpg';

import post from '../assets2/postRock.jpg';
import easy from '../assets2/easyListening.jpg';
import rock from '../assets2/rock.jpg';
import '../index.css';
import { EffectCoverflow } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const Playlist = () => {
  return (
    <div className="mt-5 w-full min-w-0 overflow-hidden lg:w-[60%]">
      <h1 className="text-slate-200 px-4 py-4 text-2xl italic text-end mb-3">Playlists</h1>
      <Swiper
        effect="coverflow"
        grabCursor
        loop
        centeredSlides
        slideToClickedSlide
        initialSlide={0}
        speed={600}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 50,
          stretch: 20,
          depth: 0,
          modifier: 1,
          slideShadows: true,
        }}
        modules={[EffectCoverflow]}
        className="playlist-swiper h-[30vh]"
      >
        <SwiperSlide>
          <div className="group relative h-full w-full overflow-hidden rounded-3xl">
            <img src={jazzLounge} className="h-full w-full object-cover" alt="Jazz Lounge playlist" />
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center bg-black/50 text-4xl text-slate-200 opacity-0 transition-opacity group-hover:opacity-100"
            >
              Jazz
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="group relative h-full w-full overflow-hidden rounded-3xl">
            <img src={post} className="h-full w-full rounded-3xl object-cover" alt="Post-Rock playlist" />
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center bg-black/50 text-4xl text-slate-200 opacity-0 transition-opacity group-hover:opacity-100"
            >
              Post-Rock
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="group relative h-full w-full overflow-hidden rounded-3xl">
            <img src={easy} className="h-full w-full rounded-3xl object-cover" alt="Easy Listening playlist" />
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center bg-black/50 text-4xl text-slate-200 opacity-0 transition-opacity group-hover:opacity-100"
            >
              Easy-Listening
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="group relative h-full w-full overflow-hidden rounded-3xl">
            <img src={rock} className="h-full w-full rounded-3xl object-cover" alt="Rock playlist" />
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center bg-black/50 text-4xl text-slate-200 opacity-0 transition-opacity group-hover:opacity-100"
            >
              Rock
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
export default Playlist;
