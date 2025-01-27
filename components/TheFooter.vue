<template>
  <footer class="bg-emerald-900 text-emerald-50 py-12">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 class="font-bold text-lg mb-4">{{ $t('footer.emergency_contacts.title') }}</h3>
          <ul class="space-y-2">
            <li>
              <a href="tel:104" class="hover:text-emerald-200 transition-colors flex items-center">
                <span class="material-icons mr-2 text-sm">phone</span>
                {{ $t('footer.emergency_contacts.disha') }}
              </a>
            </li>
            <li>
              <a href="tel:1098" class="hover:text-emerald-200 transition-colors flex items-center">
                <span class="material-icons mr-2 text-sm">phone</span>
                {{ $t('footer.emergency_contacts.childLine') }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-bold text-lg mb-4">{{ $t('footer.quickLinks.title') }}</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/about" class="hover:text-emerald-200 transition-colors">{{ $t('footer.quickLinks.about') }}</NuxtLink></li>
            <li><NuxtLink to="/resources" class="hover:text-emerald-200 transition-colors">{{ $t('footer.quickLinks.resources') }}</NuxtLink></li>
            <li><NuxtLink to="/faq" class="hover:text-emerald-200 transition-colors">{{ $t('footer.quickLinks.faq') }}</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-emerald-200 transition-colors">{{ $t('footer.quickLinks.contact') }}</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h3 class="font-bold text-lg mb-4">{{ $t('footer.legal.title') }}</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/privacy" class="hover:text-emerald-200 transition-colors">{{ $t('footer.legal.privacy') }}</NuxtLink></li>
            <li><NuxtLink to="/terms" class="hover:text-emerald-200 transition-colors">{{ $t('footer.legal.terms') }}</NuxtLink></li>
            <li><NuxtLink to="/disclaimer" class="hover:text-emerald-200 transition-colors">{{ $t('footer.legal.disclaimer') }}</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h3 class="font-bold text-lg mb-4">{{ $t('footer.languages.title') }}</h3>
          <div class="flex space-x-4">
            <button class="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 transition-colors">
              {{ $t('footer.languages.english') }}
            </button>
            <button class="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 transition-colors font-malayalam">
              {{ $t('footer.languages.malayalam') }}
            </button>
          </div>
        </div>
      </div>

      <div class="border-t border-emerald-800 pt-8 text-center text-sm">
        <p>&copy; {{ new Date().getFullYear() }} mindhelp.fyi - {{ $t('footer.copyright') }}</p>
      </div>
    </div>
  </footer>
</template>
