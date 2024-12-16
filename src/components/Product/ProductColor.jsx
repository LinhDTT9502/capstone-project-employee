import { useState, useEffect } from "react";
import { fetchProductColor } from "../../services/productService";
import { fetchProductByProductCode } from "../../../../capstone-project/Frontend/src/services/productService";

export function ProductColor({ productCode, selectedColor, setSelectedColor, onColorSelect }) {
  const [colors, setColors] = useState([]);
  const [colorImages, setColorImages] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  

  useEffect(() => {
    const loadColors = async () => {
      try {
        const data = await fetchProductColor(productCode);
        setColors(data);
        const imagePromises = data.map(async (color) => {
          const productData = await fetchProductByProductCode(productCode, color.color, "", "");
          return { color: color.color, image: productData[0]?.imgAvatarPath || "" };
        });

        const images = await Promise.all(imagePromises);
        const imagesMap = images.reduce((acc, { color, image }) => {
          acc[color] = image;
          return acc;
        }, {});

        setColorImages(imagesMap);

        if (!selectedColor && data.length > 0) {
          const firstColor = data[0].color;
          setSelectedColor(firstColor);
        }
      } catch (error) {
        console.error("Failed to load product colors or images:", error);
      }
    };

    if (productCode) {
      loadColors();
    }
  }, [productCode, selectedColor, setSelectedColor]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (onColorSelect) {
      onColorSelect( colorImages[color]); 
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-2 relative">
    
      <div
        className="border rounded-lg px-4 py-2 cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedColor && (
          <div className="flex items-center gap-2">
            <img
              src={colorImages[selectedColor]}
              alt={`Selected color: ${selectedColor}`}
              className="w-6 h-6 object-cover rounded-full"
            />
            <span>{selectedColor}</span>
          </div>
        )}
      </div>

      {isDropdownOpen && (
        <ul className="absolute mt-1 w-full border rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto z-10">
          {colors.map((color) => (
            <li
              key={color.color}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-orange-100 "
              onClick={() => handleColorSelect(color.color)}
            >
              {colorImages[color.color] && (
                <img
                  src={colorImages[color.color]}
                  alt={`Color option for ${color.color}`}
                  className="w-6 h-6 object-cover rounded-full"
                />
              )}
              <span>{color.color}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
