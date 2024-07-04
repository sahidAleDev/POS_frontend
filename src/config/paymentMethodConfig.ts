import { PaymentMethodId } from '@/types';
import CashIcon from '@/components/icons/CashIcon.vue';
import CreditCardIcon from '@/components/icons/CreditCardIcon.vue';
import CreditCardIcon2 from '@/components/icons/CreditCardIcon2.vue';
import DolarIcon from '@/components/icons/DolarIcon.vue';
import type { Component } from 'vue';

interface PaymentMethodConfig {
  icon: Component;
  name: string;
}

export const paymentMethodConfigs: Record<PaymentMethodId, PaymentMethodConfig> = {
  [PaymentMethodId.Cash]: {
    icon: DolarIcon,
    name: 'Efectivo'
  },
  [PaymentMethodId.Debit]: {
    icon: CreditCardIcon,
    name: 'Tarjeta de débito'
  },
  [PaymentMethodId.Credit]: {
    icon: CreditCardIcon,
    name: 'Tarjeta de crédito'
  },
  [PaymentMethodId.Transfer]: {
    icon: CashIcon,
    name: 'Transferencia'
  },
  [PaymentMethodId.CashCredit]: {
    icon: CreditCardIcon2,
    name: 'Efectivo + T. Crédito'
  },
  [PaymentMethodId.CashDebit]: {
    icon: CreditCardIcon2,
    name: 'Efectivo + T. Débito'
  },
  [PaymentMethodId.CashTransfer]: {
    icon: CashIcon,
    name: 'Efectivo + Transferencia'
  },
};