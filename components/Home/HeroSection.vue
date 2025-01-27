<template>
  <div class="text-center">
    <h1 class="text-4xl md:text-5xl font-bold font-display leading-normal text-emerald-800 mb-6">
      {{ $t('home.hero.title') }}
    </h1>
    
    <!-- Initial State -->
    <div v-if="!showQuestions" class="space-y-8">
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        {{ $t('home.hero.subtitle') }}
      </p>
      <button 
        @click="showQuestions = true"
        class="inline-flex items-center px-8 py-4 text-lg bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all hover:shadow-lg"
      >
        {{ $t('home.hero.cta') }}
        <span class="material-icons ml-2">arrow_forward</span>
      </button>
    </div>

    <!-- Questions Flow -->
    <HeadlessTransitionRoot
      appear
      :show="showQuestions"
      as="template"
    >
      <HeadlessDialog
        as="div"
        @close="showQuestions = false"
        class="relative z-50"
      >
        <HeadlessTransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </HeadlessTransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <HeadlessTransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
            
              <HeadlessDialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <HeadlessDialogTitle
                  as="h3"
                  class="text-2xl font-medium leading-6 text-emerald-800 mb-6 text-center flex justify-between"
                >
                  What brings you here?
                <div>     <button 
                    @click="showQuestions = false"
                    class="text-gray-400 hover:text-gray-500"
                  >
                    <span class="material-icons">close</span>
                  </button></div>
                </HeadlessDialogTitle>

                <div class="grid gap-4">
                  <button
                    v-for="option in options"
                    :key="option.id"
                    @click="selectOption(option)"
                    :class="getOptionClasses(option)"
                  >
                    <div class="flex items-start">
                      <span 
                        class="material-icons mr-3 group-hover:scale-110 transition-transform"
                        :class="getIconColor(option)"
                      >
                        {{ option.icon }}
                      </span>
                      <div>
                        <h4 class="font-medium text-gray-900">{{ option.title }}</h4>
                        <p v-if="option.description" class="text-gray-600 text-sm mt-1">
                          {{ option.description }}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </HeadlessDialogPanel>
            </HeadlessTransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </HeadlessTransitionRoot>

    <!-- Support Options Dialog -->
    <HeadlessTransitionRoot
      appear
      :show="!!selectedOption"
      as="template"
    >
      <HeadlessDialog
        as="div"
        @close="selectedOption = null"
        class="relative z-50"
      >
        <HeadlessTransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </HeadlessTransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <HeadlessTransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <HeadlessDialogPanel 
                v-if="selectedOption"
                class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >  <button 
                    @click="backToOptions"
                    class="inline-flex items-center px-3 py-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                  >
                    <span class="material-icons mr-1 text-xl">arrow_back</span>
                  Back to options
                  </button>
                <div class="flex justify-between items-start mb-6">
                  
                  <HeadlessDialogTitle as="h3" class="text-2xl font-medium text-emerald-800">
                    Here's what might help you right now
                  </HeadlessDialogTitle>
               
                  <button 
                    @click="selectedOption = null"
                    class="text-gray-400 hover:text-gray-500"
                  >
                    <span class="material-icons">close</span>
                  </button>
                </div>

                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div 
                    v-for="support in selectedOption.supportOptions" 
                    :key="support.title"
                    class="flex flex-col p-4 rounded-xl border-2 border-emerald-100 hover:border-emerald-300 transition-all"
                  >
                    <div class="mb-4">
                      <h4 class="font-medium text-emerald-800 mb-2 flex items-center">
                        <span class="material-icons mr-2 text-emerald-600">{{ support.icon }}</span>
                        {{ support.title }}
                      </h4>
                      <p class="text-gray-600 text-sm">{{ support.description }}</p>
                    </div>

                    <div class="space-y-3 flex-grow">
                      <div class="text-sm">
                        <p class="flex items-center text-gray-700 mb-2">
                          <span class="material-icons mr-2 text-emerald-600 text-base">people</span>
                          Best for: {{ support.bestFor }}
                        </p>
                        <p class="flex items-center text-gray-700">
                          <span class="material-icons mr-2 text-emerald-600 text-base">payments</span>
                          Cost: {{ support.cost }}
                        </p>
                      </div>

                      <!-- Emergency Contacts -->
                      <div v-if="support.emergencyContacts" class="mt-4">
                        <h5 class="text-sm font-medium text-red-800 mb-2">Emergency Contacts:</h5>
                        <ul class="text-sm text-gray-600 space-y-2">
                          <li 
                            v-for="contact in support.emergencyContacts" 
                            :key="contact.name" 
                            class="flex flex-col"
                          >
                            <span class="font-medium">{{ contact.name }}</span>
                            <a 
                              :href="`tel:${contact.number}`" 
                              class="text-red-600 hover:text-red-700 flex items-center"
                            >
                              <span class="material-icons mr-1 text-base">phone</span>
                              {{ contact.number }} ({{ contact.hours }})
                            </a>
                          </li>
                        </ul>
                      </div>

                      <!-- Professional Types -->
                      <div v-if="support.professionalTypes" class="mt-4">
                        <h5 class="text-sm font-medium text-emerald-800 mb-2">Available Professionals:</h5>
                        <ul class="text-sm text-gray-600 space-y-1">
                          <li v-for="type in support.professionalTypes" :key="type" class="flex items-center">
                            <span class="material-icons mr-2 text-emerald-600 text-base">check_circle</span>
                            {{ type }}
                          </li>
                        </ul>
                      </div>

                      <!-- Included Services -->
                      <div v-if="support.includes" class="mt-4">
                        <h5 class="text-sm font-medium text-emerald-800 mb-2">Includes:</h5>
                        <ul class="text-sm text-gray-600 space-y-1">
                          <li v-for="item in support.includes" :key="item" class="flex items-center">
                            <span class="material-icons mr-2 text-emerald-600 text-base">check_circle</span>
                            {{ item }}
                          </li>
                        </ul>
                      </div>
                    </div>

                    <NuxtLink
                      :to="support.link"
                      class="inline-flex items-center mt-4 text-emerald-600 hover:text-emerald-700 group"
                    >
                      Learn more
                      <span class="material-icons ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </NuxtLink>
                  </div>
                </div>

                <div class="mt-8 text-center">
                  <h4 class="font-medium text-lg text-emerald-800 mb-4">Ready to take the next step?</h4>
                  <div class="flex flex-wrap justify-center gap-4">
                    <NuxtLink
                      to="/find-help"
                      class="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all hover:shadow-md"
                    >
                      Find professionals
                    </NuxtLink>
                    <NuxtLink
                      to="/emergency"
                      class="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:shadow-md"
                    >
                      Get emergency help
                    </NuxtLink>
                    <NuxtLink
                      to="/groups"
                      class="inline-flex items-center px-6 py-3 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all hover:shadow-md"
                    >
                      Join support groups
                    </NuxtLink>
                  </div>
                </div>
              </HeadlessDialogPanel>
            </HeadlessTransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </HeadlessTransitionRoot>
  </div>
</template>

<script setup lang="ts">
const showQuestions = ref(false)
const selectedOption = ref<Option | null>(null)

interface EmergencyContact {
  name: string
  number: string
  hours: string
}

interface SupportOption {
  title: string
  description: string
  icon: string
  bestFor: string
  cost: string
  link: string
  emergencyContacts?: EmergencyContact[]
  includes?: string[]
  professionalTypes?: string[]
  categories?: string[]
}

interface Option {
  id: number
  title: string
  description?: string
  icon: string
  urgent?: boolean
  supportOptions: SupportOption[]
}

const options: Option[] = [
  {
    id: 0,
    title: "I'm having thoughts of suicide or self-harm",
    icon: 'emergency',
    urgent: true,
    supportOptions: [
      {
        title: 'Immediate Crisis Support',
        description: 'Free 24/7 support from trained professionals',
        icon: 'emergency',
        bestFor: 'When you need to talk to someone right now',
        cost: 'Free',
        link: '/crisis-support',
        emergencyContacts: [
          {
            name: 'DISHA Kerala Helpline',
            number: '1056',
            hours: '24/7'
          },
          {
            name: 'Kerala State Mental Health Helpline',
            number: '0471-2552056',
            hours: '24/7'
          },
          {
            name: 'Emergency Services',
            number: '112',
            hours: '24/7'
          }
        ],
        includes: [
          'Immediate phone support',
          'Crisis intervention',
          'Safety planning',
          'Local emergency resources'
        ]
      },
      {
        title: 'Urgent Professional Care',
        description: 'Immediate professional mental health support',
        icon: 'local_hospital',
        bestFor: 'Getting immediate professional help',
        cost: 'Varies by provider',
        link: '/find-help/urgent-care',
        professionalTypes: [
          'Emergency Psychiatrists',
          'Crisis Counselors',
          'Mental Health Emergency Services'
        ]
      }
    ]
  },
  {
    id: 1,
    title: "I'm feeling overwhelmed/stressed",
    icon: 'psychology',
    supportOptions: [
      {
        title: 'Immediate Relief',
        description: 'Quick techniques and resources for stress relief',
        icon: 'self_improvement',
        bestFor: 'When you need help right now',
        cost: 'Free',
        link: '/resources/immediate-help',
        includes: [
          'Guided breathing exercises',
          'Stress reduction techniques',
          'Grounding methods',
          'Quick meditation guides'
        ]
      },
      {
        title: 'Counseling Support',
        description: 'Professional help with stress management',
        icon: 'person',
        bestFor: 'Ongoing stress and anxiety management',
        cost: '₹500-1500 per session',
        link: '/find-help/stress-support',
        professionalTypes: [
          'Counselors',
          'Stress Management Specialists',
          'Anxiety Therapists'
        ]
      },
      {
        title: 'Lifestyle Changes',
        description: 'Long-term solutions for better wellbeing',
        icon: 'lifestyle',
        bestFor: 'Building lasting stress resilience',
        cost: 'Free to ₹1000 per session',
        link: '/resources/lifestyle-wellness',
        includes: [
          'Exercise programs',
          'Nutrition guidance',
          'Sleep improvement',
          'Work-life balance tips'
        ]
      }
    ]
  },
  {
    id: 2,
    title: "I'm experiencing emotional difficulties",
    icon: 'sentiment_dissatisfied',
    supportOptions: [
      {
        title: 'Professional Help',
        description: 'Expert support for emotional challenges',
        icon: 'psychology',
        bestFor: 'Understanding and managing emotions',
        cost: '₹700-2000 per session',
        link: '/find-help/emotional-support',
        professionalTypes: [
          'Psychologists',
          'Counselors',
          'Therapists',
          'Psychiatrists'
        ]
      },
      {
        title: 'Support Groups',
        description: 'Connect with others who understand',
        icon: 'group',
        bestFor: 'Sharing experiences and finding community',
        cost: 'Free to ₹200 per session',
        link: '/groups/emotional-support',
        includes: [
          'Online support groups',
          'Local meetups',
          'Moderated forums',
          'Peer support programs'
        ]
      },
      {
        title: 'Self-Help Resources',
        description: 'Tools and techniques for emotional wellbeing',
        icon: 'school',
        bestFor: 'Learning to manage emotions independently',
        cost: 'Free',
        link: '/resources/emotional-wellness',
        includes: [
          'Mood tracking tools',
          'Coping strategies',
          'Educational materials',
          'Wellness activities'
        ]
      }
    ]
  },
  {
    id: 3,
    title: "I'm having physical health concerns",
    icon: 'medical_services',
    supportOptions: [
      {
        title: 'Medical Assessment',
        description: 'Professional evaluation of physical symptoms',
        icon: 'local_hospital',
        bestFor: 'Understanding physical health impacts',
        cost: '₹1000-3000 initial consultation',
        link: '/find-help/health-assessment',
        professionalTypes: [
          'General Physicians',
          'Psychiatrists',
          'Sleep Specialists',
          'Nutritionists'
        ]
      },
      {
        title: 'Holistic Care',
        description: 'Comprehensive mind-body approaches',
        icon: 'spa',
        bestFor: 'Addressing both physical and mental wellbeing',
        cost: '₹500-2000 per session',
        link: '/find-help/holistic-care',
        includes: [
          'Mind-body techniques',
          'Alternative therapies',
          'Lifestyle medicine',
          'Integrated health plans'
        ]
      }
    ]
  },
  {
    id: 4,
    title: "I'm dealing with relationship challenges",
    icon: 'favorite_border',
    supportOptions: [
      {
        title: 'Relationship Counseling',
        description: 'Professional guidance for relationships',
        icon: 'people',
        bestFor: 'Working through relationship issues',
        cost: '₹800-2500 per session',
        link: '/find-help/relationship-counseling',
        professionalTypes: [
          'Relationship Counselors',
          'Marriage Therapists',
          'Family Therapists',
          'Dating Coaches'
        ]
      },
      {
        title: 'Personal Growth',
        description: 'Individual support for relationship skills',
        icon: 'person_add',
        bestFor: 'Developing better relationship patterns',
        cost: '₹700-1800 per session',
        link: '/find-help/personal-growth',
        includes: [
          'Communication skills',
          'Boundary setting',
          'Self-esteem building',
          'Attachment patterns'
        ]
      }
    ]
  },
  {
    id: 5,
    title: "I need help with specific life challenges",
    icon: 'assignment',
    supportOptions: [
      {
        title: 'Specialized Counseling',
        description: 'Expert help for specific situations',
        icon: 'psychology',
        bestFor: 'Addressing particular life challenges',
        cost: '₹700-2000 per session',
        link: '/find-help/specialized-support',
        categories: [
          'Career counseling',
          'Grief counseling',
          'Addiction support',
          'Life transitions'
        ]
      },
      {
        title: 'Practical Support',
        description: 'Concrete help and resources',
        icon: 'build',
        bestFor: 'Getting practical assistance',
        cost: 'Varies by service',
        link: '/resources/practical-help',
        includes: [
          'Financial guidance',
          'Legal resources',
          'Career services',
          'Support services'
        ]
      }
    ]
  }
]

const getOptionClasses = (option: Option) => {
  if (option.urgent) {
    return 'text-left p-4 rounded-xl border-2 border-red-200 hover:border-red-400 hover:bg-red-50 transition-all group'
  }
  return 'text-left p-4 rounded-xl border-2 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all group'
}

const getIconColor = (option: Option) => {
  return option.urgent ? 'text-red-600' : 'text-emerald-600'
}

function selectOption(option: Option) {
  selectedOption.value = option
  showQuestions.value = false
}

function backToOptions() {
  selectedOption.value = null
  showQuestions.value = true
}
</script>
