import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { Product, CartItem } from '@/types';
import { useNotificationStore } from '@/stores/notification';

const STORE_NAME = 'cart';

export const useCartStore = defineStore(STORE_NAME, () => {

  const $notificationStore = useNotificationStore();
  const cart = ref<CartItem[]>([]);
  const emptyCart = computed<boolean>(() => cart.value.length === 0);
  const totalPayable = computed<number>(() => {
    const total = cart.value.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return Number(total.toFixed(2));
  });
  const totalQuantity = computed<number>(() => cart.value.reduce((acc, item) => acc + item.quantity, 0));

  function addToCart(product: Product) {

    if (product.stock === 0) {
      $notificationStore.showNotification('No hay stock suficiente', 'error');
      return;
    }

    const itemInCart = cart.value.find(item => item.id === product.id);

    if (itemInCart) {
      if (itemInCart.quantity < product.stock) {
        itemInCart.quantity++;
      } else {
        alert('No hay stock suficiente');
      }
    } else {
      cart.value.push({ ...product, quantity: 1 });
    }

  }

  function increaseQuantity(product: Product) {
    const itemInCart = cart.value.find(item => item.id === product.id);

    if (itemInCart && itemInCart.quantity < product.stock) {
      itemInCart.quantity++;
    } else {
      alert('No hay stock suficiente');
    }
  }

  function decreaseQuantity(product: Product) {
    const itemInCart = cart.value.find(item => item.id === product.id);

    if (itemInCart && itemInCart.quantity > 0) {
      itemInCart.quantity--;
      if (itemInCart.quantity === 0) {
        const index = cart.value.findIndex(item => item.id === product.id);
        cart.value.splice(index, 1);
      }
    }
  }

  function deleteItem(product: Product) {
    const index = cart.value.findIndex(item => item.id === product.id);
    cart.value.splice(index, 1);
  }

  function clearCart() {
    cart.value = [];
  }

  return {
    // Data
    cart,
    emptyCart,
    totalPayable,
    totalQuantity,

    // Methods
    addToCart,
    clearCart,
    decreaseQuantity,
    deleteItem,
    increaseQuantity,
  };
});
