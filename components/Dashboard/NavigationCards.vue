<!-- NavigationCards.vue -->
<template>
  <div class="navigation-cards">
    <div class="card" v-for="item in navigationItems" :key="item.title">
      <NuxtLink :to="item.path" class="card-content">
        <div class="icon-wrapper">
          <Icon :name="item.icon" size="24" />
        </div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const navigationItems = [
  {
    title: 'Professionals',
    description: 'Find mental health professionals and specialists',
    icon: 'heroicons:user-group',
    path: '/dashboard/professionals'
  },
  {
    title: 'Hospitals',
    description: 'Discover mental health facilities and clinics',
    icon: 'heroicons:building-office-2',
    path: '/dashboard/hospitals'
  },
  {
    title: 'Organizations',
    description: 'Connect with mental health organizations',
    icon: 'heroicons:building-library',
    path: '/dashboard/organizations'
  },
  {
    title: 'Support Groups',
    description: 'Join community support groups',
    icon: 'heroicons:users',
    path: '/dashboard/support-groups'
  }
]
</script>

<style scoped>
.navigation-cards {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  padding: 1rem;
}

.card {
  background: white;
  border-radius: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  text-align: center;
  text-decoration: none;
  color: inherit;
}

.icon-wrapper {
  background: #f0f9f0;
  padding: 1rem;
  border-radius: 50%;
  margin-bottom: 1rem;
  color: #4a8f4a;
}

h3 {
  font-family: 'Inter', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

p {
  font-family: 'Source Serif Pro', serif;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #666;
  margin: 0;
}

@media (max-width: 640px) {
  .navigation-cards {
    grid-template-columns: 1fr;
  }
}
</style>
