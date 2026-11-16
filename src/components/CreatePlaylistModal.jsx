import { Plus } from 'lucide-react';
import { useRef, useState } from 'react';

const CreatePlaylistModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [cover, setCover] = useState('');
  const [error, setError] = useState('');
  const [isReading, setIsReading] = useState(false);
  const fileInputRef = useRef(null);
  const readerRef = useRef(null);
  const readToken = useRef(0);

  if (!isOpen) return null;

  const resetForm = () => {
    readToken.current += 1;
    readerRef.current?.abort();
    readerRef.current = null;
    setName('');
    setCover('');
    setError('');
    setIsReading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageChange = (event) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    if (file.type && !file.type.startsWith('image/')) {
      setError('Choose an image file for the playlist cover.');
      return;
    }

    readToken.current += 1;
    const token = readToken.current;
    readerRef.current?.abort();
    const reader = new FileReader();
    readerRef.current = reader;
    setIsReading(true);
    setError('');
    reader.onload = () => {
      if (token !== readToken.current) return;
      if (typeof reader.result !== 'string') {
        setError('Could not read the selected image.');
      } else {
        setCover(reader.result);
      }
      setIsReading(false);
      readerRef.current = null;
    };
    reader.onerror = () => {
      if (token !== readToken.current) return;
      setError('Could not read the selected image.');
      setIsReading(false);
      readerRef.current = null;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Enter a playlist name.');
      return;
    }
    if (isReading) return;

    onCreate({ name: trimmedName, cover });
    resetForm();
    onClose();
  };

  return (
    <div className="fixed font-display text-3xl inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <section
        aria-labelledby="create-playlist-title"
        aria-modal="true"
        className="w-full max-w-md rounded-3xl bg-gray-800 p-6 text-slate-200 shadow-xl"
        role="dialog"
      >
        <h2 id="create-playlist-title" className="mb-5 text-2xl font-semibold">
          Create Playlist
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5 flex items-center gap-4">
            <button
              type="button"
              aria-label="Choose playlist cover image"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-sky-300 text-slate-800"
            >
              {cover ? <img src={cover} alt="" className="h-full w-full object-cover" /> : <Plus className="h-8 w-8" />}
            </button>
            <div>
              <p className="font-medium">Playlist cover</p>
              <p className="text-sm text-slate-400">Select an image from your device</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              aria-label="Playlist cover image"
              className="sr-only"
              onChange={handleImageChange}
            />
          </div>
          <label htmlFor="playlist-name" className="mb-2 block text-sm font-medium">
            Playlist name
          </label>
          <input
            id="playlist-name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError('');
            }}
            placeholder="Playlist name"
            className="w-full rounded-xl border border-sky-200 bg-gray-900 px-4 py-3 text-white outline-none focus:border-sky-400"
          />
          {error && (
            <p className="mt-2 text-sm text-red-300" role="alert">
              {error}
            </p>
          )}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer rounded-3xl bg-slate-600 px-4 py-2 text-slate-100 hover:bg-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isReading}
              className="cursor-pointer rounded-3xl bg-sky-300 px-4 py-2 text-slate-800 hover:bg-sky-200 disabled:cursor-wait disabled:opacity-60"
            >
              {isReading ? 'Loading image…' : 'Create'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CreatePlaylistModal;
