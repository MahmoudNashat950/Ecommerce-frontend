import { useEffect, useState } from "react";

function ProductImage({
  src,
  fallbackSrc,
  alt,
  className = "",
}) {
  const [imageSrc, setImageSrc] = useState(src || fallbackSrc || "");

  useEffect(() => {
    setImageSrc(src || fallbackSrc || "");
  }, [fallbackSrc, src]);

  if (!imageSrc) {
    return null;
  }

  return (
    <img
      alt={alt}
      className={className}
      onError={() => {
        if (fallbackSrc && imageSrc !== fallbackSrc) {
          setImageSrc(fallbackSrc);
        }
      }}
      src={imageSrc}
    />
  );
}

export default ProductImage;
