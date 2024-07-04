<script setup lang="ts">
import { computed, ref } from 'vue';
import { ROUTE_NAME } from '@/router/names'
import { toCurrency } from '@/helpers';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';

/**
 * ------------------------------------------
 *	Components
 * ------------------------------------------
 */
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ProductCart from '@/components/ProductCart.vue';
import ProductSearchAndCart from '@/components/ProductSearchAndCart.vue';
import SearchIcon from '@/components/icons/SearchIcon.vue';

/**
 * ------------------------------------------
 *	Utils
 * ------------------------------------------
 */
const $cartStore = useCartStore();
const $router = useRouter();

/**
 * ------------------------------------------
 *	Data
 * ------------------------------------------
 */
const showProductSearch = ref<boolean>(false);
const totalPrice = computed(() =>  $cartStore.cart.reduce((acc, item) => acc + item.price * item.quantity, 0));
</script>

<template>

  <!--
    <AlertNotification />
  -->

  <DefaultLayout>
    <transition name="fade" >
      <ProductSearchAndCart 
      v-show="showProductSearch"   
        @close="showProductSearch = false"
      />
    </transition>
  
    <div v-show="!showProductSearch" class="relative lg:h-screen lg:flex">
      <main class="lg:w-2/5 p-10 lg:h-screen bg-slate-100 space-y-6">
        <section class="space-y-4">
          <h2 class='text-3xl font-black text-black'>Buscar productos, hola desde Dev</h2>
          
          <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <SearchIcon class="size-5" />
            </div>
  
            <input 
              type="search" 
              id="search"
              class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Buscar por nombre"
              required 
              @click="showProductSearch = true"
            />
          </div>
        </section>
      </main>
  
      <aside class="lg:w-3/5 bg-white border border-l-2 px-5 py-10 flex flex-col lg:h-screen">
        <h2 class='text-3xl font-black text-black mb-10'>Carrito</h2>
        <section class="flex-grow lg:overflow-y-auto mb-10" v-auto-animate>
          <ProductCart v-for="product in $cartStore.cart" :key="product.id" :product="product"/>
        </section>
        <section class="mt-auto space-y-4">
          <p class="text-2xl font-semibold">Total: <span class="text-indigo-600">{{ toCurrency(totalPrice) }}</span></p>
          <button 
            class="w-full bg-indigo-600 uppercase px-4 py-2 text-center text-white"
            @click="$router.push({ name: ROUTE_NAME.PAYMENT_VIEW })"
            :disabled="$cartStore.emptyCart"
          >
            Ir a pagar
          </button>
        </section>
      </aside>
    </div>
  </DefaultLayout>
  
</template>

<style>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-from, 
.fade-enter-to{
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
</style>