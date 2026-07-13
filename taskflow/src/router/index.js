import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomePage from '@/views/HomePage.vue';
import Day7TabsPage from '@/views/Day7/Task7/TabsPage.vue';
import Day6TabsPage from '@/views/Day6/Task6/TabsPage.vue';
import Day8TabsPage from '@/views/Day8/Task8/TabsPage.vue';

const routes = [
  {
    path: '/',
    component: HomePage
  },
  {
    path: '/tabs/',
    component: Day7TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tasks'
      },
      {
        path: 'tasks',
        component: () => import('@/views/Day7/Task7/TasksPage.vue')
      },
      {
        path: 'tasks/:id',
        component: () => import('@/views/Day7/Task7/TaskDetailPage.vue')
      },
      {
        path: 'completed',
        component: () => import('@/views/Day7/Task7/CompletedPage.vue')
      },
      {
        path: 'settings',
        component: () => import('@/views/Day7/Task7/SettingsPage.vue')
      }
    ]
  },
  {
    path: '/day8/',
    component: Day8TabsPage,
    children: [
      {
        path: '',
        redirect: '/day8/tasks'
      },
      {
        path: 'tasks',
        component: () => import('@/views/Day8/Task8/TasksPage.vue')
      },
      {
        path: 'tasks/:id',
        component: () => import('@/views/Day8/Task8/TaskDetailPage.vue')
      },
      {
        path: 'completed',
        component: () => import('@/views/Day8/Task8/CompletedPage.vue')
      },
      {
        path: 'settings',
        component: () => import('@/views/Day8/Task8/SettingsPage.vue')
      }
    ]
  },
  {
    path: '/day6/',
    component: Day6TabsPage,
    children: [
      {
        path: '',
        redirect: '/day6/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Day6/Task6/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Day6/Task6/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Day6/Task6/Tab3Page.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
