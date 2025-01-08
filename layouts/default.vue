<template>
  <div class="min-h-screen">
    <TheHeader />
    <main class="bg-emerald-50">
      <div class="py-20">
        <slot />
      </div>
    </main>
    <TheFooter />
  </div>
</template>