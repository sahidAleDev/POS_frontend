<script setup lang="ts">
import { computed } from 'vue';
import { toCurrency } from '@/helpers';
import { useCartStore } from '@/stores/cart';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

interface Emits {
  (e: 'add-to-cart', product: Product): void;
}

/**
 * ------------------------------------------
 *	Utils
 * ------------------------------------------
 */
const $props = defineProps<Props>();
const $cartStore = useCartStore();
defineEmits<Emits>();

/**
 * ------------------------------------------
 *	Data
 * ------------------------------------------
 */
const stockFormatted = computed(() => {
  return (stock: number) => {
    if (stock === 0) return 'Sin stock';
    if (stock === 1) return stock +  ' pza.';
    return stock + ' pzas.';
  }
});

const productQuantityInCart = computed<number>(() => {
  const itemInCart = $cartStore.cart.find(item => item.id === $props.product.id);
  return itemInCart ? itemInCart.quantity : 0;
});
</script>

<template>
  <div class="grid grid-cols-4 md:grid-cols-7 gap-4 justify-self-center justify-items-start items-center border-b-2 p-2">
    <figure class="col-span-2 md:col-span-1">
      <img class="w-20" :src="product.imgUrl" alt="">
    </figure>
    <p class="col-span-2 md:col-span-3">{{ product.name }}</p>
    <p class="md:justify-self-end">{{ stockFormatted(product.stock) }}</p>
    <p class="md:justify-self-end">{{ toCurrency(product.price) }}</p>
    <div class="md:justify-self-end flex items-center gap-2">
      <p>{{ productQuantityInCart }}</p>
      <button @click="$emit('add-to-cart',product)" class="bg-slate-200 py-2 px-4 m-2 rounded-lg hover:bg-slate-300 transition">+</button>
    </div>
  </div>
</template>