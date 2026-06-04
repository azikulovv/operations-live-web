<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import AppMobileNav from '~/components/layout/AppMobileNav.vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'

const isMobileMenuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-950">
    <div class="flex">
      <AppSidebar />

      <div class="min-w-0 flex-1">
        <AppHeader @open-menu="isMobileMenuOpen = true" />

        <main class="px-5 py-6 lg:px-8">
          <slot />
        </main>
      </div>
    </div>

    <AppMobileNav :open="isMobileMenuOpen" @close="isMobileMenuOpen = false" />
  </div>
</template>
