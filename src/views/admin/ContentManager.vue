<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-white">Gestion du contenu</h1>

    <!-- Tabs -->
    <div class="flex gap-4 border-b border-gray-700">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-2 font-semibold transition-colors relative',
          activeTab === tab.id ? 'text-orange-500' : 'text-gray-400 hover:text-white'
        ]"
      >
        {{ tab.label }}
        <span v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></span>
      </button>
    </div>

    <!-- Pages Management -->
    <div v-if="activeTab === 'pages'" class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-white">Pages</h2>
        <button class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          + Nouvelle page
        </button>
      </div>
      <div class="grid gap-4">
        <div v-for="page in pages" :key="page.id" class="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20 flex justify-between items-center">
          <div>
            <h3 class="text-white font-semibold">{{ page.title }}</h3>
            <p class="text-gray-400 text-sm">{{ page.slug }}</p>
          </div>
          <div class="flex gap-2">
            <button class="text-gray-400 hover:text-white transition-colors">Modifier</button>
            <button class="text-gray-400 hover:text-red-500 transition-colors">Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Blog Management -->
    <div v-if="activeTab === 'blog'" class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-white">Articles de blog</h2>
        <button class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          + Nouvel article
        </button>
      </div>
      <div class="grid gap-4">
        <div v-for="post in blogPosts" :key="post.id" class="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="text-white font-semibold mb-1">{{ post.title }}</h3>
              <p class="text-gray-400 text-sm mb-2">{{ post.excerpt }}</p>
              <div class="flex gap-4 text-xs text-gray-500">
                <span>{{ formatDate(post.date) }}</span>
                <span>Auteur: {{ post.author }}</span>
                <span :class="post.published ? 'text-green-400' : 'text-yellow-400'">
                  {{ post.published ? 'Publié' : 'Brouillon' }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="text-gray-400 hover:text-white transition-colors">Modifier</button>
              <button class="text-gray-400 hover:text-red-500 transition-colors">Supprimer</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Media Library -->
    <div v-if="activeTab === 'media'" class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-white">Médiathèque</h2>
        <button class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          + Ajouter un média
        </button>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="media in mediaItems" :key="media.id" class="bg-gray-800/50 rounded-lg overflow-hidden border border-purple-500/20 group">
          <div class="aspect-square bg-gray-700 flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="p-2">
            <p class="text-gray-300 text-xs truncate">{{ media.name }}</p>
            <p class="text-gray-500 text-xs">{{ media.size }}</p>
          </div>
          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button class="p-2 bg-white/20 rounded hover:bg-white/30">👁️</button>
            <button class="p-2 bg-white/20 rounded hover:bg-white/30">🗑️</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('pages')

const tabs = [
  { id: 'pages', label: 'Pages' },
  { id: 'blog', label: 'Blog' },
  { id: 'media', label: 'Médias' }
]

const pages = ref([
  { id: '1', title: 'Accueil', slug: '/' },
  { id: '2', title: 'Événement', slug: '/event' },
  { id: '3', title: 'Billetterie', slug: '/tickets' },
  { id: '4', title: 'Mentions légales', slug: '/legal' }
])

const blogPosts = ref([
  { 
    id: '1', 
    title: 'Annonce officielle : Le Petit Poto revient !', 
    excerpt: 'Après une pause, nous sommes ravis de vous annoncer le retour...',
    date: '2025-01-20',
    author: 'Admin',
    published: true
  },
  { 
    id: '2', 
    title: 'Les artistes à ne pas manquer', 
    excerpt: 'Découvrez notre sélection des artistes qui vont enflammer la scène...',
    date: '2025-01-18',
    author: 'Marie',
    published: true
  },
  { 
    id: '3', 
    title: 'Conseils pour profiter au maximum', 
    excerpt: 'Voici nos conseils pour passer une soirée inoubliable...',
    date: '2025-01-15',
    author: 'Paul',
    published: false
  }
])

const mediaItems = ref([
  { id: '1', name: 'banner-2025.jpg', size: '2.4 MB' },
  { id: '2', name: 'logo-event.png', size: '156 KB' },
  { id: '3', name: 'artist-1.jpg', size: '1.8 MB' },
  { id: '4', name: 'artist-2.jpg', size: '2.1 MB' },
  { id: '5', name: 'venue-photo.jpg', size: '3.2 MB' },
  { id: '6', name: 'promo-video.mp4', size: '45 MB' }
])

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
</script>
