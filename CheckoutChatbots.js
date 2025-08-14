import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ImageModal from './ImageModal';

const CheckoutChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [pastedCode, setPastedCode] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight / 2 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef(null);
  const [panelStyle, setPanelStyle] = useState({ left: 0, top: 0 });

  const sizes = ['Small', 'Medium', 'Large', 'Extra Large'];
  const quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handlePasteCode = (e) => {
    const pastedText = e.target.value;
    setPastedCode(pastedText);
    
    // Show options when a valid code is pasted
    if (pastedText.trim().length > 0) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  };

  const handleAddToCart = () => {
    if (!pastedCode.trim()) {
      toast.error('Please paste an item code first');
      return;
    }
    
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    const newItem = {
      id: Date.now(),
      code: pastedCode.trim(),
      size: selectedSize,
      quantity: selectedQuantity
    };

    setCartItems(prev => [newItem, ...prev]);
    
    // Reset form
    setPastedCode('');
    setSelectedSize('');
    setSelectedQuantity(1);
    setShowOptions(false);
    
    toast.success('Item added to cart!');
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    // Here you would typically redirect to a checkout page
    toast.success('Proceeding to checkout...');
    console.log('Cart items:', cartItems);
  };

  const handlePreviewItem = (itemCode) => {
    // Find the image based on the item code
    const findImageByCode = (code) => {
      // Map category IDs to their actual directory names
             const categoryDirMap = {
         'AMONG-US': 'Among Us',
         'DC-HEROES': 'DC Heroes',
         'LEAGUE-OF-LEGENDS': 'League of Legends',
         'MORTAL-KOMBAT': 'Mortal Kombat',
         'PAINTINGS': 'Paintings',
         'MOTIVATIONAL': 'Motavational',
         'COLLAGE': 'Collage',
         'DIGITAL-ILLUSTRATION': 'Digital Illustration',
         'DOODLE-ART': 'Doodle Art',
         'ESOTERIC': 'Esoteric',
         'SPACE': 'Space',
         'RELIGION': 'Religion'
       };

      // Extract category and item number from code
      // Works for both single-part categories (e.g., "COLLAGE-004") and multi-part ones
      // like "MORTAL-KOMBAT-014", "LEAGUE-OF-LEGENDS-001", etc.
      const parts = code.split('-');
      if (parts.length >= 2) {
        const itemNumber = parts[parts.length - 1];
        const category = parts.slice(0, parts.length - 1).join('-');
        
        // Find the category directory
        const categoryDir = categoryDirMap[category] || category;
        
        // Map item codes to actual filenames
        let filename = '';
        
        if (category === 'COLLAGE') {
          // Convert COLLAGE-004 to COLAGEM_04.avif
          const num = parseInt(itemNumber);
          filename = `COLAGEM_${String(num).padStart(2, '0')}.avif`;

        } else if (category === 'AMONG-US') {
          // Convert AMONG-US-001 to AMONG_01.avif
          const num = parseInt(itemNumber);
          filename = `AMONG_${String(num).padStart(2, '0')}.avif`;
        } else if (category === 'DC-HEROES') {
          // Convert DC-HEROES-001 to HEROIS_001.avif
          const num = parseInt(itemNumber);
          filename = `HEROIS_${String(num).padStart(3, '0')}.avif`;
        } else if (category === 'LEAGUE-OF-LEGENDS') {
          // Convert LEAGUE-OF-LEGENDS-001 to LOL_01.avif
          const num = parseInt(itemNumber);
          filename = `LOL_${String(num).padStart(2, '0')}.avif`;
        } else if (category === 'MORTAL-KOMBAT') {
          // Convert MORTAL-KOMBAT-001 to MORTAL_01.avif
          const num = parseInt(itemNumber);
          filename = `MORTAL_${String(num).padStart(2, '0')}.avif`;
        } else if (category === 'DIGITAL-ILLUSTRATION') {
          // Convert DIGITAL-ILLUSTRATION-001 to ID_001.avif
          const num = parseInt(itemNumber);
          filename = `ID_${String(num).padStart(3, '0')}.avif`;
        } else if (category === 'DOODLE-ART') {
          // Convert DOODLE-ART-001 to DOODLE_01.avif
          const num = parseInt(itemNumber);
          filename = `DOODLE_${String(num).padStart(2, '0')}.avif`;
        } else if (category === 'ESOTERIC') {
          // Convert ESOTERIC-001 to ESOTERICAS_001.avif
          const num = parseInt(itemNumber);
          filename = `ESOTERICAS_${String(num).padStart(3, '0')}.avif`;
        } else if (category === 'MOTIVATIONAL') {
          // Convert MOTIVATIONAL-001 to MOTIVATIONAL_001.avif
          const num = parseInt(itemNumber);
          filename = `MOTIVATIONAL_${String(num).padStart(3, '0')}.avif`;
        } else if (category === 'PAINTINGS') {
          // Convert PAINTINGS-001 to 01. Mona Lisa by Leonardo Da Vinci.avif
          const num = parseInt(itemNumber);
          // Map painting numbers to their actual filenames
          const paintingMap = {
            1: '01._Mona_Lisa_by_Leonardo_Da_Vinci.avif',
            2: '02._Lady_with_an_Ermine_by_Leonardo_da_Vinci.avif',
            3: '03._Girl_with_a_Pearl_Earring_by_Johannes_Vermeer.avif',
            4: '04._Las_Meninas_by_Diego_Velázquez.avif',
            5: '05._The_Storm_on_the_Sea_of_Galilee_by_Rembrandt.avif',
            6: '06._The_Woman_with_a_Parasol_by_Claude_Oscar_Monet.avif',
            7: '07._Dante_And_Virgil_In_Hell_by_William-Adolphe_Bouguereau.avif',
            8: '08._Napoleon_Crossing_the_Alps_by_Jacques-Louis_David.avif',
            9: '09._St._George_and_the_Dragon_by_Raphael_Raffaello.avif',
            10: '10._The_Swing_by_Jean-Honoré_Fragonard.avif',
            11: '11._When_Will_You_Marry_by_Paul_Gauguin.avif',
            12: '12._View_of_Toledo_by_El_Greco.avif',
            13: '13._Wanderer_above_the_Sea_of_Fog_by_Caspar_David_Friedrich.avif',
            14: '14._The_Scream_by_Edvard_Munch.avif',
            15: '15._The_Kiss_by_Gustav_Klimt.avif',
            16: '16._The_Arnolfini_Portrait_by_Jan_van_Eyck.avif',
            17: '17._American_Gothic_by_Grant_Wood.avif',
            18: '18._Battle_Of_Issus_by_Albrecht_Altdorfer.avif',
            19: '19._Bacchus_by_Caravaggio.avif',
            20: '20._La_Virgen_de_los_Lirios_by_Willian-Adolphe_Bouguereau.avif',
            21: '21._The_Starry_Night_By_Vincent_Van_Gogh.avif',
            22: '22._The_Gulf_Stream_by_Winslow_Homer.avif',
            23: '23._The_Birth_of_Venus_by_Sandro_Botticelli.avif',
            24: '24._Stag_Night_At_Sharkeys_by_George_Bellows.avif',
            25: '25._The_Raft_of_the_Medusa_by_Théodore_Géricault.avif',
            26: '26._The_Triumph_of_Venus_by_Francois_Boucher.avif',
            27: '27._A_Bar_at_the_Folies-Bergère_by_Édouard_Manet.avif',
            28: '28._A_Cotton_Office_In_New_Orleans_by_Edgar_Degas.avif',
            29: '29._Bal_du_moulin_de_la_Galette_by_Pierre-Auguste_Renoir.avif',
            30: '30._A_Sunday_Afternoon_on_the_Island_of_La_Grande_Jatte_by_Georges_Seurat.avif',
            31: '31._Luncheon_of_the_Boating_Party_by_Pierre-Auguste_Renoir.avif',
            32: '32._Le_Déjeuner_sur_l_herbe_by_Édouard_Manet.avif',
            33: '33._Liberty_Leading_the_People_by_Eugène_Delacroix.avif',
            34: '34._The_Card_Players_by_Paul_Cézanne.avif',
            35: '35._Wheat_Field_with_Cypresses_at_the_Haude_Galline_near_Eygalieres_by_Vincent_van_Gogh.avif',
            36: '36._The_Third_of_May_1808_by_Francisco_Goya.avif',
            37: '37._The_Sleeping_Gypsy_by_Henri_Rousseau.avif',
            38: '38._The_Night_Watch_by_Rembrandt.avif',
            39: '39._The_Lady_Of_Shalott_by_John_William_Waterhouse.avif',
            40: '40._The_Harvesters_by_Pieter_Bruegel_the_Elder.avif',
            41: '41._Boulevard_Montmartre_Spring_by_Camille_Pissarro.avif',
            42: '42._Impression_Sunrise_by_Claude_Monet.avif',
            43: '43._Paris_Street_In_Rainy_Weather_by_Gustave_Caillebotte.avif',
            44: '44._Saint_Jerome_Writing_by_Caravaggio.avif',
            45: '45._Breezing_Up_also_known_as_A_Fair_Wind_by_Winslow_Homer.avif',
            46: '46._The_Last_Supper_by_Leonardo_da_Vinci.avif',
            47: '47._Nighthawks_by_Edward_Hopper.avif',
            48: '48._Grande_Odalisque_by_Jean_Auguste_Dominique_Ingres.avif',
            49: '49._The_Naked_Maja_by_Francisco_de_Goya_y_Lucientes.avif',
            50: '50._The_Creation_Of_Adam_by_Michelangelo.avif'
          };
          filename = paintingMap[num] || `${String(num).padStart(2, '0')}.avif`;
        } else if (category === 'SPACE') {
          // Convert SPACE-001 to SPACE_001.avif
          const num = parseInt(itemNumber);
          filename = `SPACE_${String(num).padStart(3, '0')}.avif`;
        } else if (category === 'RELIGION') {
          // Convert RELIGION-001 to FTH_001.avif
          const num = parseInt(itemNumber);
          filename = `FTH_${String(num).padStart(3, '0')}.avif`;
        } else {
          // For other categories, use the original format
          filename = `${itemNumber}.avif`;
        }
        
        const imagePath = `/Images/${categoryDir}/${filename}`;
        
        return {
          src: imagePath,
          alt: `${code} - Preview`,
          itemCode: code
        };
      }
      
      return null;
    };

    const image = findImageByCode(itemCode);
    console.log('Preview attempt for itemCode:', itemCode);
    console.log('Found image:', image);
    if (image) {
      setPreviewImage(image);
      setPreviewModalOpen(true);
      console.log('Modal should be opening with image:', image);
    } else {
      toast.error('Image not found for this item code');
      console.log('Image not found for itemCode:', itemCode);
    }
  };

  const handleClosePreview = () => {
    setPreviewModalOpen(false);
    setPreviewImage(null);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setSelectedSize(item.size);
    setSelectedQuantity(item.quantity);
  };

  const handleSaveEdit = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    setCartItems(prev => prev.map(item => 
      item.id === editingItem.id 
        ? { ...item, size: selectedSize, quantity: selectedQuantity }
        : item
    ));

    setEditingItem(null);
    setSelectedSize('');
    setSelectedQuantity(1);
    toast.success('Item updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setSelectedSize('');
    setSelectedQuantity(1);
  };

  const handleMouseDown = (e) => {
    if (isOpen) return; // Only allow dragging when closed
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Constrain to screen bounds
    const maxX = window.innerWidth - 64; // 64px is the button width
    const maxY = window.innerHeight - 64; // 64px is the button height
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // On release, snap strictly to middle-left or middle-right
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const buttonSize = 64;
    const margin = 24;

    const isRightSide = position.x + buttonSize / 2 >= viewportWidth / 2;
    const x = isRightSide ? viewportWidth - buttonSize - margin : margin;
    const y = Math.max(margin, Math.min((viewportHeight - buttonSize) / 2, viewportHeight - buttonSize - margin));

    setPosition({ x, y });
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, position]);

  // Ensure the panel stays fully visible and chooses the best side (left/right of button)
  useEffect(() => {
    if (!isOpen) return;

    const computePanelPosition = () => {
      const rect = panelRef.current?.getBoundingClientRect();
      const panelWidth = rect?.width || 320; // Tailwind w-80 = 320px
      const panelHeight = rect?.height || 480; // Fallback estimate; will update after mount
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = 16;
      const buttonSize = 64;

      const openToLeft = position.x + buttonSize + margin + panelWidth > viewportWidth - margin;
      const left = openToLeft
        ? Math.max(margin, position.x - panelWidth - margin)
        : Math.min(viewportWidth - margin - panelWidth, position.x + buttonSize + margin);

      const desiredTop = position.y - panelHeight / 2;
      const top = Math.max(margin, Math.min(desiredTop, viewportHeight - panelHeight - margin));

      setPanelStyle({ left, top });
    };

    // Compute immediately and on resize
    computePanelPosition();
    window.addEventListener('resize', computePanelPosition);
    const id = setTimeout(computePanelPosition, 0); // Recompute after first render for correct height
    return () => {
      window.removeEventListener('resize', computePanelPosition);
      clearTimeout(id);
    };
  }, [isOpen, position]);

  return (
    <>
                    {/* Floating Chatbot Button */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            zIndex: 50,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          className={isDragging ? 'select-none' : ''}
        >
         <motion.button
           whileHover={{ scale: isDragging ? 1 : 1.1 }}
           whileTap={{ scale: 0.9 }}
           onClick={() => !isDragging && setIsOpen(!isOpen)}
           onMouseDown={handleMouseDown}
           className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 ${
             isDragging ? 'shadow-2xl' : ''
           }`}
           style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
         >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          )}
        </motion.button>
      </motion.div>

             {/* Chatbot Interface */}
       <AnimatePresence>
         {isOpen && (
            <motion.div
             initial={false}
             animate={{ opacity: 1, x: 0, scale: 1 }}
             exit={{ opacity: 0, x: 300, scale: 0.95 }}
              style={{ position: 'fixed', left: panelStyle.left, top: panelStyle.top, zIndex: 40, maxHeight: '80vh' }}
              className="w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
              ref={panelRef}
           >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Checkout Assistant</h3>
                    <p className="text-xs text-white/80">Paste your item codes here</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    // Minimize should behave like close so the floating button always remains visible
                    setIsOpen(false);
                    setIsMinimized(false);
                  }}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={false}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-4 space-y-4"
                >
                                     {/* Item Code Input */}
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       {editingItem ? 'Editing Item' : 'Paste Item Code'}
                     </label>
                     <textarea
                       value={editingItem ? editingItem.code : pastedCode}
                       onChange={editingItem ? undefined : handlePasteCode}
                       placeholder={editingItem ? 'Item code (read-only)' : "Paste your item code here..."}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-gray-50"
                       rows="2"
                       readOnly={editingItem ? true : false}
                     />
                   </div>

                                           {/* Size and Quantity Options */}
                         <AnimatePresence>
                           {(showOptions || editingItem) && (
                      <motion.div
                        initial={false}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        {/* Size Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Size
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {sizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                                  selectedSize === size
                                    ? 'bg-purple-600 text-white border-purple-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quantity Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity
                          </label>
                          <select
                            value={selectedQuantity}
                            onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            {quantities.map((qty) => (
                              <option key={qty} value={qty}>
                                {qty}
                              </option>
                            ))}
                          </select>
                        </div>

                                                 {/* Add to Cart / Save Edit Button */}
                         <div className="flex gap-2">
                           {editingItem ? (
                             <>
                               <button
                                 onClick={handleSaveEdit}
                                 className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-all duration-200"
                               >
                                 Save Changes
                               </button>
                               <button
                                 onClick={handleCancelEdit}
                                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                               >
                                 Cancel
                               </button>
                             </>
                           ) : (
                             <button
                               onClick={handleAddToCart}
                               className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                             >
                               Add to Cart
                             </button>
                           )}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Cart Items */}
                  {cartItems.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-700 mb-3">Cart Items</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                                                 {cartItems.map((item) => (
                           <div
                             key={item.id}
                             className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                           >
                                                           <div 
                                className="flex-1 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                                onClick={() => handlePreviewItem(item.code)}
                              >
                                <p className="text-sm font-medium text-gray-700">{item.code}</p>
                                <p className="text-xs text-gray-500">
                                  {item.size} • Qty: {item.quantity}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleEditItem(item)}
                                  className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                                  title="Edit item"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                                  title="Remove item"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                           </div>
                         ))}
                      </div>
                      
                      {/* Checkout Button */}
                      <button
                        onClick={handleCheckout}
                        className="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Proceed to Checkout ({cartItems.length} items)
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
                 )}
       </AnimatePresence>

       {/* Preview Modal */}
        <ImageModal
         isOpen={previewModalOpen}
         onClose={handleClosePreview}
         image={previewImage}
         onPrevious={() => {}}
         onNext={() => {}}
         hasPrevious={false}
         hasNext={false}
          showInfo={false}
          showInstructions={false}
       />
     </>
   );
 };

export default CheckoutChatbot;
