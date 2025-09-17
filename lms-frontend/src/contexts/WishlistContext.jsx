import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('courseWishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  const addToWishlist = (course) => {
    setWishlist(prev => {
      const newWishlist = [...prev, course];
      localStorage.setItem('courseWishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const removeFromWishlist = (courseId) => {
    setWishlist(prev => {
      const newWishlist = prev.filter(course => course.id !== courseId);
      localStorage.setItem('courseWishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const isInWishlist = (courseId) => {
    return wishlist.some(course => course.id === courseId);
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
