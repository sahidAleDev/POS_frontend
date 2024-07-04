<script setup lang="ts">
import { computed } from 'vue';
import { toCurrency } from '@/helpers';
import { useCartStore } from '@/stores/cart';
import type { CartItem } from '@/types';

interface Props {
  product: CartItem;
}

/**
 * ------------------------------------------
 *	Components
 * ------------------------------------------
 */
import CloseIcon from '@/components/icons/CloseIcon.vue';
import InfoIcon from './icons/InfoIcon.vue';

/**
 * ------------------------------------------
 *	Utils
 * ------------------------------------------
 */
const $props = defineProps<Props>();
const $cartStore = useCartStore();

/**
 * ------------------------------------------
 *	Data
 * ------------------------------------------
 */
const price = computed(() => {
  return $props.product.price * productQuantityInCart.value;
});

const productQuantityInCart = computed<number>(() => {
  const itemInCart = $cartStore.cart.find(item => item.id === $props.product.id);
  return itemInCart ? itemInCart.quantity : 0;
});

const stockFormatted = computed<string>(() => {
  return $props.product.stock === 1 ? 'Solo 1 disponible' : `Solo ${$props.product.stock} disponibles`;
});
</script>

<template>
  <div class="grid grid-cols-5 sm:grid-cols-8 sm:grid-rows-1 justify-self-center justify-items-center items-center gap-4 border-b-2 p-2 min-">
    <figure class="col-span-2 sm:col-span-1">
      <img class="w-full" :src="product.imgUrl" alt="">
    </figure>

    <div class="col-span-3 justify-self-start space-y-2">
      <p class="text-sm">{{ product.name }}</p>
      <p class="text-xs flex items-center gap-1 text-red-600 font-semibold">
        <InfoIcon class="size-5 inline-block" />
        <span>{{ stockFormatted }}</span>
      </p>
    </div>
    
    <div class="col-span-2 flex items-center gap-2">
      <button @click="$cartStore.decreaseQuantity(product)" class="bg-slate-200 py-2 px-4 m-2 rounded-lg hover:bg-slate-300 transition">-</button>
      <p>{{ productQuantityInCart }}</p>
      <button @click="$cartStore.increaseQuantity(product)" class="bg-slate-200 py-2 px-4 m-2 rounded-lg hover:bg-slate-300 transition">+</button>
    </div>

    <div class="col-span-2 row-start-2 col-start-4 sm:row-start-1 sm:col-start-7 flex flex-wrap gap-4 items-center">
      <p>{{ toCurrency(price)  }}</p>
      <CloseIcon @click="$cartStore.deleteItem(product)" class="cursor-pointer" />
    </div>
  </div>
</template>