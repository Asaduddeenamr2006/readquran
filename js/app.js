const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    const isDark = ref(false);
    const isArabic = ref(true);
    const isReadingMode = ref(false);
    const sidebarOpen = ref(false);
    const loading = ref(false);
    const searchQuery = ref('');
    const selectedReciter = ref('ar.alafasy');
    const currentSurah = ref(null);
    const currentPageIndex = ref(0);
    const surahs = ref([]);
    const pages = ref([]);
    const toasts = ref([]);
    const fontSize = ref(28);

    const filteredSurahs = computed(() => {
      if (!searchQuery.value) return surahs.value;
      const query = searchQuery.value.toLowerCase();
      return surahs.value.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.englishName.toLowerCase().includes(query) ||
        s.number.toString().includes(query)
      );
    });

    const totalPages = computed(() => pages.value.length);

    const progressPercent = computed(() => {
      if (totalPages.value === 0) return 0;
      return ((currentPageIndex.value + 1) / totalPages.value) * 100;
    });

    const surahPageCount = {
      1: 1, 2: 49, 3: 35, 4: 38, 5: 30, 6: 27, 7: 27, 8: 10, 9: 22,
      10: 16, 11: 17, 12: 15, 13: 9, 14: 8, 15: 7, 16: 16, 17: 16, 18: 12,
      19: 11, 20: 12, 21: 11, 22: 10, 23: 9, 24: 9, 25: 9, 26: 9, 27: 8,
      28: 9, 29: 9, 30: 9, 31: 5, 32: 4, 33: 9, 34: 6, 35: 6, 36: 6,
      37: 6, 38: 6, 39: 8, 40: 8, 41: 6, 42: 7, 43: 7, 44: 4, 45: 5,
      46: 6, 47: 5, 48: 5, 49: 4, 50: 5, 51: 3, 52: 4, 53: 3, 54: 4,
      55: 4, 56: 4, 57: 4, 58: 4, 59: 4, 60: 4, 61: 4, 62: 3, 63: 3,
      64: 3, 65: 3, 66: 3, 67: 4, 68: 4, 69: 4, 70: 4, 71: 4, 72: 4,
      73: 3, 74: 4, 75: 4, 76: 4, 77: 4, 78: 4, 79: 4, 80: 3, 81: 3,
      82: 3, 83: 4, 84: 4, 85: 4, 86: 3, 87: 3, 88: 4, 89: 4, 90: 3,
      91: 3, 92: 3, 93: 3, 94: 3, 95: 3, 96: 3, 97: 3, 98: 4, 99: 3,
      100: 3, 101: 3, 102: 3, 103: 3, 104: 3, 105: 3, 106: 3, 107: 3, 108: 3,
      109: 3, 110: 3, 111: 3, 112: 3, 113: 3, 114: 3
    };

    const getSurahPageCount = (num) => surahPageCount[num] || 10;

    const showToast = (message, icon = 'bi bi-info-circle') => {
      const id = Date.now();
      toasts.value.push({ id, message, icon });
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id);
      }, 2000);
    };

    const toggleTheme = () => {
      isDark.value = !isDark.value;
      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add(isDark.value ? 'dark-theme' : 'light-theme');
      const themeLabel = isDark.value 
        ? (isArabic.value ? '🌙 الوضع الليلي' : '🌙 Night Mode') 
        : (isArabic.value ? '☀️ الوضع النهاري' : '☀️ Day Mode');
      showToast(themeLabel, 'bi bi-palette');
    };

    const toggleLang = () => {
      isArabic.value = !isArabic.value;
      showToast(isArabic.value ? '🇸🇦 العربية' : '🇬🇧 English', 'bi bi-translate');
    };

    const increaseFontSize = () => {
      if (fontSize.value < 60) {
        fontSize.value += 4;
      }
    };

    const decreaseFontSize = () => {
      if (fontSize.value > 16) {
        fontSize.value -= 4;
      }
    };

    const toggleReadingMode = () => {
      isReadingMode.value = !isReadingMode.value;
      if (isReadingMode.value) {
        showToast(isArabic.value ? '✨ وضع القراءة مفعل' : '✨ Reading Mode Active', 'bi bi-book');
      } else {
        showToast(isArabic.value ? '📖 تم الخروج من وضع القراءة' : '📖 Exited Reading Mode', 'bi bi-check-circle');
      }
    };

    const exitReadingMode = () => {
      isReadingMode.value = false;
      showToast(isArabic.value ? '📖 تم الخروج من وضع القراءة' : '📖 Exited Reading Mode', 'bi bi-check-circle');
    };

    const prevPage = () => {
      if (currentPageIndex.value > 0) {
        currentPageIndex.value--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const nextPage = () => {
      if (currentPageIndex.value < totalPages.value - 1) {
        currentPageIndex.value++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const loadSurahs = async () => {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await res.json();
        surahs.value = data.data;
      } catch (error) {
        console.error('Error loading surahs:', error);
        showToast(isArabic.value ? 'خطأ في تحميل السور' : 'Error loading surahs', 'bi bi-exclamation-triangle');
      }
    };

    const loadSurah = async (num) => {
      loading.value = true;
      currentSurah.value = num;
      currentPageIndex.value = 0;
      sidebarOpen.value = false;

      try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${num}`);
        const data = await res.json();
        
        const ayahs = data.data.ayahs;
        const total = getSurahPageCount(num);
        const ayahsPerPage = Math.ceil(ayahs.length / total);
        
        pages.value = [];
        
        for (let i = 0; i < ayahs.length; i += ayahsPerPage) {
          const chunk = ayahs.slice(i, Math.min(i + ayahsPerPage, ayahs.length));
          const text = chunk.map(a => 
            `${a.text} <span class="ayah-number" onclick="playAyah(${a.numberInSurah})">۝ ${a.numberInSurah}</span>`
          ).join(' ');
          
          pages.value.push({
            text,
            startAyah: chunk[0].numberInSurah,
            endAyah: chunk[chunk.length - 1].numberInSurah
          });
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('Error loading surah:', error);
        showToast(isArabic.value ? 'خطأ في تحميل السورة' : 'Error loading surah', 'bi bi-exclamation-triangle');
      } finally {
        loading.value = false;
      }
    };

    const playCurrentAyah = () => {
      if (!currentSurah.value) return;
      const audio = new Audio(`https://api.alquran.cloud/v1/ayah/${currentSurah.value}:1/${selectedReciter.value}`);
      audio.play().catch(e => console.log('Play error:', e));
    };

    window.playAyah = (ayahNum) => {
      if (!currentSurah.value) return;
      const audio = new Audio(`https://api.alquran.cloud/v1/ayah/${currentSurah.value}:${ayahNum}/${selectedReciter.value}`);
      audio.play().catch(e => console.log('Play error:', e));
    };

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') nextPage();
      else if (e.key === 'ArrowRight') prevPage();
      else if (e.key === 'r' || e.key === 'R') toggleReadingMode();
      else if (e.key === 'Escape' && isReadingMode.value) exitReadingMode();
      else if (isReadingMode.value) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
          e.key === 'ArrowUp' ? prevPage() : nextPage();
        } else if (e.key === '+' || e.key === '=') {
          increaseFontSize();
        } else if (e.key === '-') {
          decreaseFontSize();
        }
      }
    });

    onMounted(() => {
      loadSurahs();
      setTimeout(() => loadSurah(1), 500);
    });

    return {
      isDark,
      isArabic,
      isReadingMode,
      sidebarOpen,
      loading,
      searchQuery,
      selectedReciter,
      currentSurah,
      currentPageIndex,
      surahs,
      pages,
      toasts,
      fontSize,
      filteredSurahs,
      totalPages,
      progressPercent,
      toggleTheme,
      toggleLang,
      toggleReadingMode,
      exitReadingMode,
      prevPage,
      nextPage,
      loadSurah,
      playCurrentAyah,
      increaseFontSize,
      decreaseFontSize
    };
  }
}).mount('#app');
