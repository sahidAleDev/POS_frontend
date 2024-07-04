<script setup lang="ts">
import { paymentMethodConfigs } from '@/config/paymentMethodConfig';
import { PaymentMethodId } from '@/types';
import { ref, computed } from 'vue';
import { toCurrency } from '@/helpers';
import { useCartStore } from '@/stores';
import { useNotificationStore } from '@/stores/notification';
import { useRouter } from 'vue-router';
import type { PaymentAmount, LogPayment, PaymentMethod, LabelForPaymentMethod } from '@/types';

/**
 * ------------------------------------------
 *	Components
 * ------------------------------------------
 */
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue'

/**
 * ------------------------------------------
 *	Utils
 * ------------------------------------------
 */
const $router = useRouter();
const $cartStore = useCartStore();
const $notificationStore = useNotificationStore();

/**
 * ------------------------------------------
 *	Data
 * ------------------------------------------
 */
const isCombinedMethod = computed<boolean>(() => ['cash_credit', 'cash_debit', 'cash_transfer'].includes(selectedPaymentMethod.value));
const paymentAmounts = ref<PaymentAmount[]>([]);


const paymentMethods: PaymentMethod[] = Object.entries(paymentMethodConfigs).map(([id, config]) => ({
  id: id as PaymentMethodId,
  name: config.name
}));

const remainingAmount = computed<number>(() => {
  const paidAmount = paymentAmounts.value.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmountFormatted = parseFloat(paidAmount.toFixed(2));
  return $cartStore.totalPayable - paidAmountFormatted;
});

const selectedPaymentMethod = ref('');

const labelForPaymentMethod: LabelForPaymentMethod = paymentMethods.reduce(
  (acc, method) => ({
    ...acc,
    [method.id]: method.name
  }),
  {} as LabelForPaymentMethod
);

/**
 * ------------------------------------------
 *	Methods
 * ------------------------------------------
 */

/**
 * handleBlur
 */
function handleBlur(index: number, target: EventTarget) {
  const input = target as HTMLInputElement;

  if (isCombinedMethod.value && index === 0) {
    input.value = paymentAmounts.value[0].amount.toFixed(2);
  }
}

/**
 * selectPaymentMethod
 */
 function selectPaymentMethod(method: PaymentMethodId) {
  selectedPaymentMethod.value = method;
  paymentAmounts.value = [];

  if (isCombinedMethod.value) {
    paymentAmounts.value = [
      { method: PaymentMethodId.Cash, amount: 0 },
      { method: method.split('_')[1] as PaymentMethodId, amount: 0 }
    ];
  } else {
    paymentAmounts.value = [{ method, amount: $cartStore.totalPayable }];
  }
}

/**
 * submitPayment
 */
function submitPayment() {
  if (!selectedPaymentMethod.value) {
    $notificationStore.showNotification('Seleccione un método de pago', 'warning');
    return;
  }

  if (remainingAmount.value !== 0) {
    $notificationStore.showNotification('El monto total no coincide con el total a pagar', 'warning');
    return;
  }

  const logPayment: LogPayment = {
    cart: $cartStore.cart,
    totalPayable: $cartStore.totalPayable,
    paymentMethods: paymentAmounts.value,
    log: {
      date: new Date(),
    }
  };

  console.log('Pago registrado:', logPayment);
  $cartStore.clearCart();
  $notificationStore.showNotification('Operación exitosa', 'success');
  $router.push('/');
}

/**
 * updatePaymentAmount
 */
 function updatePaymentAmount(index: number, event: EventTarget) {
  const input = event as HTMLInputElement;
  let amount = input.value === '' ? 0 : parseFloat(input.value);

  if (!isNaN(amount)) {
    
    const validAmount = Math.max(0, amount);

    if (isCombinedMethod.value) {
      if (index === 0) {
        paymentAmounts.value[0].amount = Math.min(validAmount, $cartStore.totalPayable);
        paymentAmounts.value[1].amount = parseFloat(($cartStore.totalPayable - paymentAmounts.value[0].amount).toFixed(2));
      }
    } else {
      // Para métodos no combinados, actualizar normalmente
      paymentAmounts.value[index].amount = validAmount;
    }
  } else {
    // Si el valor no es un número válido, resetear a 0
    paymentAmounts.value[index].amount = 0;
    input.value = '0';

    if (isCombinedMethod.value) {
      // Si es método combinado, actualizar el segundo monto
      paymentAmounts.value[1].amount = $cartStore.totalPayable;
    }
  }
}
</script>

<template>

  <DefaultLayout>
    <div class="min-h-screen bg-slate-100">
      <main class="w-2/3 lg:w-1/2 mx-auto py-10 space-y-10">
        <section class="flex items-center gap-2">
          <button class="bg-transparent border p-1.5 rounded-md cursor-pointer hover:bg-slate-200 transition" @click="$router.back()">
            <ArrowLeftIcon class="size-6 text-black" />
          </button>
          <h2 class="text-3xl font-black text-black">Informar Pago</h2>
        </section>
  
        <section class="space-y-10">
          <h3 class="text-2xl font-black text-black">¿Cómo pagó el cliente?</h3>
  
          <article class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="method in paymentMethods" 
              :key="method.id"
              class="bg-white p-4 flex items-center gap-2 rounded-md cursor-pointer"
              :class="{ 'border-2 border-indigo-600': selectedPaymentMethod === method.id }"
              @click="selectPaymentMethod(method.id)"
            >
              <span class="bg-slate-200 p-2 rounded-md">
                <component :is="paymentMethodConfigs[method.id].icon" class="size-4 text-black" />
              </span>
              <p>{{ method.name }}</p>
            </div>
          </article>
  
          <article v-if="selectedPaymentMethod" class="space-y-4" v-show="isCombinedMethod">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div v-for="(payment, index) in paymentAmounts" :key="index" class="w-full space-y-2" >
                <label :for="`payment-${index}`" class="block font-medium">
                  {{ labelForPaymentMethod[payment.method] }}
                </label>
                <input 
                  :disabled="index !== 0 && isCombinedMethod"
                  :id="`payment-${index}`"
                  :placeholder="`Monto en ${labelForPaymentMethod[payment.method]}`"
                  @blur="handleBlur(index, $event.target as EventTarget)"
                  @input="updatePaymentAmount(index, $event.target as EventTarget)"
                  class="w-full p-2 border rounded"
                  min="0"
                  type="number"
                  v-model="payment.amount"
                />
              </div>
            </div>
            <p class="text-lg font-semibold">
              Monto restante: {{ toCurrency(remainingAmount) }}
            </p>
          </article>
  
          <article>
            <p class="text-3xl font-black text-black text-center">Total a pagar: <span class="text-indigo-600">{{ toCurrency($cartStore.totalPayable) }} </span> </p>
            <div class="flex justify-between gap-4 mt-10">
              <button class="w-full bg-transparent border border-indigo-600 text-indigo-600 uppercase p-4 rounded-md" @click="$router.back()">Regresar</button>
              <button class="w-full bg-indigo-600 text-white uppercase p-4 rounded-md" @click="submitPayment">Pagar</button>
            </div>
          </article>
        </section>
      </main>
    </div>
  </DefaultLayout>
</template>