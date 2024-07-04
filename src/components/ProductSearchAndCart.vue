<script setup lang="ts">
import { computed, ref } from 'vue';
import { toys } from '@/data/products';
import { useCartStore } from '@/stores';

interface Emits {
  (e: 'close'): void;
}

/**
 * ------------------------------------------
 *	Components
 * ------------------------------------------
 */
import CartIcon from './icons/CartIcon.vue';
import ProductItem from './ProductItem.vue';
import SearchIcon from './icons/SearchIcon.vue';

/**
 * ------------------------------------------
 *	Utils
 * ------------------------------------------
 */
const $cartStore = useCartStore();
defineEmits<Emits>()

/**
 * ------------------------------------------
 *	Data
 * ------------------------------------------
 */
const filterProducts = computed(() => {
  return toys.filter(toy => {
    return toy.name.toLowerCase().includes(search.value.toLowerCase());
  });
});

const search = ref<string>('');
</script>

<template>
  <div class="min-h-screen bg-slate-50 z-10 p-10 space-y-4">

    <section class="flex items-center justify-between gap-2">
      <h2 class='text-3xl font-black text-black'>Productos</h2>

      <button class="bg-indigo-600 py-2 px-4 rounded-md text-white flex justify-center items-center gap-2 md:min-w-52" @click="$emit('close')">
        Ver carrito
        <span class="flex items-center gap-0.5">
          <CartIcon class="size-5 text-white" />
          {{ $cartStore.totalQuantity }}
        </span>
        
      </button>
    </section>

    <section class="space-y-2">
      <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <SearchIcon class="size-5" />
        </div>

        <input 
          class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          id="search"
          placeholder="Buscar por name"
          type="search" 
          v-model="search"
        />
      </div>

      <div>
        <ProductItem 
          v-for="(product,index) in filterProducts" 
          :key="`id-${product.id}-index-${index}`" 
          :product="product" 
          @add-to-cart="$cartStore.addToCart"
        />
      </div>
    </section>
  </div>
</template>