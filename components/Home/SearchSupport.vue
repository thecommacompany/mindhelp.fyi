<template>
  <div class="w-full max-w-3xl mx-auto">
    <div class="relative">
      <input
        type="text"
        :placeholder="$t('home.hero.search')"
        class="w-full px-6 py-4 text-lg rounded-xl border-2 border-emerald-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 transition-all pl-12"
      />
      <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">search</span>
    </div>
  </div>
</template>
