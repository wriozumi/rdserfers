<template>
  <Transition name="scale" appear>
    <button
      type="button"
      :class="cardClasses"
      :data-testid="`booking-card-${booking.id}`"
      :aria-label="`View booking details for ${booking.customerName}, ${bookingTypeText}, status: ${booking.status}`"
      @click="$emit('select', booking)"
      @keydown.enter="$emit('select', booking)"
      @keydown.space.prevent="$emit('select', booking)"
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

        <div class="flex items-center justify-between mt-2">
          <span :class="statusClasses">
            {{ booking.status }}
          </span>
        </div>
      </div>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBookingHelpers } from '../../composables/useBookingHelpers';
import type { Booking } from '../../types';

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

const cardType = computed(() => getBookingCardType(props.booking, props.date));

const cardClasses = computed(() => {
  const baseClasses =
    'w-full rounded-md cursor-pointer booking-card-hover button-press focus-ring text-left border-l-4 booking-card';

  const typeClassesMap = {
    pickup:
      'border-green-400 bg-green-50 hover:bg-green-100 hover:border-green-500',
    return: 'border-red-400 bg-red-50 hover:bg-red-100 hover:border-red-500',
    ongoing:
      'border-blue-400 bg-blue-50 hover:bg-blue-100 hover:border-blue-500',
  };

  const sizeClasses = props.isMobile ? 'p-3' : 'p-2 lg:p-3 xl:p-4';

  return `${baseClasses} ${typeClassesMap[cardType.value]} ${sizeClasses}`;
});

const contentClasses = computed(() =>
  'space-y-1 booking-card-content'
);

const nameClasses = computed(() =>
  'text-sm lg:text-base font-medium'
);

const typeClasses = computed(() =>
  'text-xs lg:text-sm text-gray-600'
);

const vehicleClasses = computed(() =>
  'text-xs lg:text-sm text-gray-500'
);

const statusClasses = computed(() => {
  const baseClasses =
    'inline-flex items-center px-2 py-0.5 rounded text-xs lg:text-sm font-medium';

  const statusColorMap = {
    confirmed: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const colorClasses =
    statusColorMap[props.booking.status as keyof typeof statusColorMap] ||
    'bg-gray-100 text-gray-800';

  return `${baseClasses} ${colorClasses}`;
});
</script>
