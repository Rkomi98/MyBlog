# Guida Stile Articoli Blog

## Componenti HTML Riutilizzabili

### 1. Header Articolo
```html
<header class="pt-8 pb-8 space-y-6">
    <!-- Tags -->
    <div class="flex flex-wrap gap-2 mb-4">
        <span class="px-2 py-1 bg-blue-500/10 border border-blue-500/20 
                     text-blue-400 text-xs font-mono rounded tracking-wide">
            PYTHON
        </span>
    </div>
    
    <!-- Titolo -->
    <h1 class="text-3xl md:text-4xl font-mono font-bold leading-tight 
               text-white tracking-tight">
        Titolo Articolo
    </h1>
    
    <!-- Autore -->
    <div class="flex items-center gap-3 py-2 border-l-2 border-accent pl-3">
        <div class="h-10 w-10 rounded-full bg-surface border border-white/10">
            <img class="object-cover w-full h-full" src="avatar.jpg"/>
        </div>
        <div class="flex flex-col">
            <span class="text-sm font-mono text-white font-medium">Nome Autore</span>
            <span class="text-xs font-sans text-text-muted">24 Ott 2024 • 7 min</span>
        </div>
    </div>
</header>
```

### 2. Paragrafo con Inline Code
```html
<p class="text-lg leading-relaxed text-gray-300 font-serif">
    Testo normale con <span class="bg-surface text-accent px-1 rounded 
    font-mono text-[0.9em]">codice inline</span> al suo interno.
</p>
```

### 3. Blocco Codice Completo (Copiabile)
```html
<div class="relative my-8 group">
    <!-- Badge linguaggio -->
    <div class="absolute -top-3 right-4 bg-surface border border-white/10 
                px-2 py-0.5 rounded text-[10px] font-mono font-bold 
                text-accent shadow-lg z-10">
        PYTHON
    </div>
    
    <div class="bg-code-bg rounded-lg border border-white/5 overflow-hidden shadow-2xl">
        <!-- Header con controlli -->
        <div class="flex items-center px-4 py-2 bg-white/5 border-b border-white/5">
            <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div class="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
            <span class="ml-4 text-xs font-mono text-text-muted">script.py</span>
            <button onclick="copyCode(this)" class="ml-auto text-text-muted 
                             hover:text-white transition-colors">
                <span class="material-symbols-outlined text-sm">content_copy</span>
            </button>
        </div>
        
        <!-- Codice -->
        <div class="p-4 overflow-x-auto code-scroll">
            <pre class="font-mono text-[13px] leading-6 text-gray-300">
<code><span class="text-purple-400">import</span> numpy</code></pre>
        </div>
    </div>
</div>
```

### 4. Immagine con Didascalia
```html
<figure class="my-10 relative">
    <div class="rounded-lg overflow-hidden border border-white/10 bg-surface shadow-xl">
        <img class="w-full h-auto object-cover opacity-80" src="image.jpg"/>
        <div class="absolute inset-0 bg-gradient-to-t from-background-dark/80 
                    via-transparent to-transparent pointer-events-none"></div>
    </div>
    <figcaption class="mt-3 text-center font-mono text-xs text-text-muted tracking-wider">
        FIGURA 1: DESCRIZIONE
    </figcaption>
</figure>
```

### 5. Blockquote/Citazione
```html
<div class="bg-surface/50 border-l-2 border-blue-500 pl-4 py-2 my-6">
    <p class="font-sans text-sm italic text-gray-400">
        "Citazione importante o nota..."
    </p>
</div>
```

### 6. Lista Puntata
```html
<ul class="space-y-2 list-disc list-inside marker:text-accent">
    <li class="text-lg text-gray-300">Elemento 1</li>
    <li class="text-lg text-gray-300">Elemento 2</li>
</ul>
```

### 7. Lista Numerata
```html
<ol class="space-y-2 list-decimal list-inside marker:text-accent marker:font-mono">
    <li class="text-lg text-gray-300">Primo passo</li>
    <li class="text-lg text-gray-300">Secondo passo</li>
</ol>
```

### 8. Link Stilizzato
```html
<a href="url" class="text-accent hover:text-white transition-colors 
                     underline decoration-accent/50 hover:decoration-white">
    Testo link
</a>
```

### 9. Formula/Elemento Tecnico Inline
```html
<span class="font-mono text-sm bg-surface px-1.5 py-0.5 rounded text-accent">
    O(n log n)
</span>
```

## Colori Syntax Highlighting

| Elemento | Classe Tailwind | Esempio |
|----------|-----------------|---------|
| Keywords | `text-purple-400` | import, from, def, return |
| Functions | `text-blue-400` | nome_funzione() |
| Numbers | `text-orange-400` | 42, 3.14 |
| Comments | `text-text-muted` | # commento |
| Strings | `text-green-400` | "testo" |
| Classes | `text-yellow-400` | ClassName |

## Palette Colori

- **Sfondo**: `#0B1120` (background-dark)
- **Surface**: `#1E293B` (cards)
- **Testo principale**: `#E2E8F0`
- **Testo secondario**: `#94A3B8`
- **Accent**: `#10B981` (verde smeraldo)
- **Primario**: `#0F172A` (deep slate)

## Font

- **Titoli**: `JetBrains Mono` (mono)
- **Corpo**: `Charter` (serif)
- **UI/Buttons**: `Inter` (sans)

## Tag Colori Predefiniti

| Tag | Colore Badge |
|-----|-------------|
| Python | `bg-blue-500/10 border-blue-500/20 text-blue-400` |
| JavaScript | `bg-yellow-500/10 border-yellow-500/20 text-yellow-400` |
| AI/ML | `bg-purple-500/10 border-purple-500/20 text-purple-400` |
| DevOps | `bg-green-500/10 border-green-500/20 text-green-400` |
| Web | `bg-cyan-500/10 border-cyan-500/20 text-cyan-400` |
| Database | `bg-orange-500/10 border-orange-500/20 text-orange-400` |
| Security | `bg-red-500/10 border-red-500/20 text-red-400` |
