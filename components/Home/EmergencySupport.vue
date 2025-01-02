<template>
  <section class="bg-red-50/50 border-t border-red-100">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
        <div>
          <h2 class="text-2xl font-bold text-red-700 mb-2">Need Immediate Help?</h2>
          <p class="text-gray-600">If you're in crisis or need urgent support, help is available 24/7.</p>
        </div>
        <NuxtLink 
          to="/emergency"
          class="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all hover:shadow-md whitespace-nowrap"
        >
          Get Emergency Help
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
