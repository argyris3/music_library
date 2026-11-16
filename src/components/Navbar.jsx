import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import front from '../assets2/front.jpg';
const Navbar = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  return (
    <div className="w-full shrink-0 text-3xl mt-10 text-white">
      <div className="flex items-center justify-start gap-4 cursor-pointer">
        <div className="flex items-center gap-1 px-6 py-2">
          <ChevronLeft onClick={() => navigate(-1)} className="w-8 h-8 " />
          <ChevronRight onClick={() => navigate(1)} className="w-8 h-8 " />
        </div>
        <div className="flex w-60 items-center gap-2 rounded-3xl border border-slate-400 px-3 py-1 text-mist-200">
          {!searchValue && <Search className="h-5 w-5 shrink-0" />}
          <input
            type="search"
            aria-label="Search"
            placeholder="Search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-mist-200"
          />
        </div>
        <div className="ml-auto px-4 flex items-center gap-2">
        <img src={front} className="w-10 h-10 rounded-full " alt="" />
        <p className="text-xl italic">Argyrios</p>
      </div>
      </div>

      
    </div>
  );
};
export default Navbar;
