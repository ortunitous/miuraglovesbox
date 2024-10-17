// Hook para manejo del carrito
import { useState, useEffect, useMemo } from 'react';
import { db } from '../data/db';

export const useCart = () => {

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart');
        return localStorageCart ? JSON.parse(localStorageCart) : [];
      }

    const [data] = useState(db);
    const [cart, setCart] = useState(initialCart)

    const MAX_ITEMS = 5 // máximo de compras

    useEffect(() => {
      localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item) {
      // Verificar que no se duplique la información.
      const itemExist = cart.findIndex(guitar => guitar.id === item.id);
      // Actualiza la cantidad
      if (itemExist >= 0) {
        if (cart[itemExist].quantity >= MAX_ITEMS) return
        const updatedCart = [...cart]
        updatedCart[itemExist].quantity++
        setCart(updatedCart)
      } else {
        item.quantity = 1
        setCart([...cart, item])
      }
    }//cierre addToCart

    function removeFromCart(id) {

      setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function decreaseQuantity(id) {
      const updatedCart = cart.map(item => {
        if (item.id === id && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 }
        }
        return item
      })
      setCart(updatedCart)
    }

    function increaseQuantity(id) {
      const updatedCart = cart.map(item => {
        if (item.id === id && item.quantity < MAX_ITEMS) {
          return { ...item, quantity: item.quantity + 1 }
        }
        return item
      })
      setCart(updatedCart)
    }

    function clearCart() {
      setCart([]);
    }

    const isEmpty = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce((total, item) => 
      total + item.quantity * item.price, 0),[cart])

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }

}