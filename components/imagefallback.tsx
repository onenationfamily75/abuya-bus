import { useEffect, useMemo, useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  sources: string[];
};

export default function ImageWithFallback({
  sources,
  alt,
  className,
  ...props
}: Props) {
  const validSources = useMemo(
    () => Array.from(new Set(sources.filter(Boolean))),
    [sources]
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [validSources]);

  const currentSrc = validSources[currentIndex] ?? "";

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        setCurrentIndex((prev) =>
          prev < validSources.length - 1 ? prev + 1 : prev
        );
      }}
    />
  );
}
