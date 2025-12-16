'use client';

import { useState, useEffect } from 'react';

export interface Restaurant {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  website?: string;
  description?: string;
  rating: number;
  reviews: number;
}

export interface Burger {
  id: number;
  name: string;
  restaurantId: number;
  type: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  tags: string[];
}

export interface AdminData {
  restaurants: Restaurant[];
  burgers: Burger[];
  activityLog: any[];
}

export function useAdminData() {
  const [data, setData] = useState<AdminData>({
    restaurants: [],
    burgers: [],
    activityLog: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('burgerankAdminData');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setData({
            restaurants: parsed.restaurants || [],
            burgers: parsed.burgers || [],
            activityLog: parsed.activityLog || []
          });
        } catch (error) {
          console.error('Error loading admin data:', error);
        }
      }
      setLoading(false);
    }
  };

  const saveData = (newData: AdminData) => {
    if (typeof window !== 'undefined') {
      const currentData = localStorage.getItem('burgerankAdminData');
      const full = currentData ? JSON.parse(currentData) : {};
      const updated = {
        ...full,
        ...newData
      };
      localStorage.setItem('burgerankAdminData', JSON.stringify(updated));
      setData(newData);
    }
  };

  const updateRestaurant = (restaurant: Restaurant) => {
    const newData = {
      ...data,
      restaurants: data.restaurants.map(r => r.id === restaurant.id ? restaurant : r)
    };
    saveData(newData);
  };

  const updateBurger = (burger: Burger) => {
    const newData = {
      ...data,
      burgers: data.burgers.map(b => b.id === burger.id ? burger : b)
    };
    saveData(newData);
  };

  const getRestaurantById = (id: number) => {
    return data.restaurants.find(r => r.id === id);
  };

  const getBurgersByRestaurant = (restaurantId: number) => {
    return data.burgers.filter(b => b.restaurantId === restaurantId);
  };

  return {
    data,
    loading,
    updateRestaurant,
    updateBurger,
    getRestaurantById,
    getBurgersByRestaurant,
    loadData
  };
}
