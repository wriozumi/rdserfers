import { createRouter, createWebHistory } from 'vue-router';
import CalendarView from '@/views/CalendarView.vue';
import BookingDetailView from '@/views/BookingDetailView.vue';

const routes = [
  {
    path: '/',
    name: 'Calendar',
    component: CalendarView,
  },
  {
    path: '/booking/:id',
    name: 'BookingDetail',
    component: BookingDetailView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory('/rdserfers/'),
  routes,
});

export default router;
