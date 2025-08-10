<template>
  <button
    type="button"
    :class="cardClasses"
    @click="$emit('select', booking)"
  >
    <div :class="contentClasses">
      <div class="flex-1 min-w-0">
        <p :class="nameClasses">
          {{ booking.customerName }}
        </p>
        <p :class="typeClasses">
          {{ bookingTypeText }}
        </p>
        <p :class="vehicleClasses">
          {{ booking.vehicleModel || 'Vehicle TBD' }}
        </p>
      </div>
      
      <div v-if="!isMobile" class="ml-2 flex-shrink-0">
        <span :class="statusClasses">
          {{ booking.status }}
        </span>
      </div>
      
      <div v-if="isMobile" class="flex items-center justify-between mt-2">
        <span :class="statusClasses">
          {{ booking.status }}
        </span>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Booking } from '../../types';
import { useBookingHelpers } from '../../composables/useBookingHelpers';

interface Props {
  booking: Booking;
  date: Date;
  isMobile?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isMobile: false,
});

defineEmits<{
  select: [booking: Booking];
}>();

const { getBookingTypeText, getBookingCardType } = useBookingHelpers();

const bookingTypeText = computed(() => 
  getBookingTypeText(props.booking, props.date)
);

const cardType = computed(() => 
  getBookingCardType(props.booking, props.date)
);

const cardClasses = computed(() => {
  const baseClasses = 'w-full rounded-md cursor-pointer transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-left border-l-4 hover:scale-105 transform transition-transform';
  
  const typeClassesMap = {
    pickup: 'border-green-400 bg-green-50 hover:bg-green-100 hover:border-green-500',
    return: 'border-red-400 bg-red-50 hover:bg-red-100 hover:border-red-500',
    ongoing: 'border-blue-400 bg-blue-50 hover:bg-blue-100 hover:border-blue-500',
  };
  
  const sizeClasses = props.isMobile ? 'p-3' : 'p-2';
  
  return `${baseClasses} ${typeClassesMap[cardType.value]} ${sizeClasses}`;
});

const contentClasses = computed(() => 
  props.isMobile ? 'space-y-1' : 'flex items-center justify-between'
);

const nameClasses = computed(() => 
  props.isMobile ? 'text-sm font-medium' : 'text-xs font-medium truncate'
);

const typeClasses = computed(() => 
  props.isMobile ? 'text-xs text-gray-600' : 'text-xs text-gray-600 truncate'
);

const vehicleClasses = computed(() => 
  props.isMobile ? 'text-xs text-gray-500' : 'text-xs text-gray-500 truncate'
);

const statusClasses = computed(() => {
  const baseClasses = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium';
  
  const statusColorMap = {
    confirmed: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  
  const colorClasses = statusColorMap[props.booking.status as keyof typeof statusColorMap] || 'bg-gray-100 text-gray-800';
  
  return `${baseClasses} ${colorClasses}`;
});
</script>
