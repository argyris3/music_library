const NowPlayingIndicator = () => (
  <span
    role="img"
    aria-label="Now playing"
    className="inline-flex shrink-0 items-center gap-1"
  >
    {[0, 1, 2].map((dot) => (
      <span
        key={dot}
        aria-hidden="true"
        className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-300 motion-reduce:animate-none"
        style={{ animationDelay: `${dot * 0.15}s` }}
      />
    ))}
  </span>
);

export default NowPlayingIndicator;
