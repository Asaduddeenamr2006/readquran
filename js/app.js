const { createApp, ref, computed, onMounted, nextTick } = Vue;

const RECITERS = [
  { id: 'alafasy', name: 'مشاري العفاسي', nameEn: 'Alafasy', baseUrl: 'https://server8.mp3quran.net/afs/', everyayahKey: 'Alafasy_128kbps' },
  { id: 'husary', name: 'محمود خليل الحصري', nameEn: 'Husary', baseUrl: 'https://server13.mp3quran.net/husr/', everyayahKey: 'Husary_128kbps' },
  { id: 'abdulbasit', name: 'عبد الباسط عبد الصمد', nameEn: 'Abdul Basit', baseUrl: 'https://server7.mp3quran.net/basit/', everyayahKey: 'Abdul_Basit_Murattal_192kbps' },
  { id: 'sudais', name: 'عبد الرحمن السديس', nameEn: 'Sudais', baseUrl: 'https://server11.mp3quran.net/sds/', everyayahKey: 'Abdurrahmaan_As-Sudais_192kbps' },
  { id: 'minshawi', name: 'محمد صديق المنشاوي', nameEn: 'Minshawi', baseUrl: 'https://server10.mp3quran.net/minsh/', everyayahKey: 'Minshawy_Murattal_128kbps' },
  { id: 'maher', name: 'ماهر المعيقلي', nameEn: 'Maher Al Muaiqly', baseUrl: 'https://server12.mp3quran.net/maher/', everyayahKey: 'Alafasy_128kbps' },
  { id: 'ghamdi', name: 'سعد الغامدي', nameEn: 'Saad Al Ghamdi', baseUrl: 'https://server7.mp3quran.net/s_gmd/', everyayahKey: 'Ghamadi_40kbps' },
  { id: 'ajmi', name: 'أحمد العجمي', nameEn: 'Ahmed Al Ajmi', baseUrl: 'https://server10.mp3quran.net/ajm/', everyayahKey: 'Ahmed_ibn_Ali_al-Ajamy_128kbps' },
  { id: 'shuraim', name: 'سعود الشريم', nameEn: 'Shuraim', baseUrl: 'https://server7.mp3quran.net/shur/', everyayahKey: 'Shuraim_128kbps' },
  { id: 'dosari', name: 'فارس عباد', nameEn: 'Fares Abbad', baseUrl: 'https://server8.mp3quran.net/frs_a/', everyayahKey: 'Fares_Abbad_128kbps' }
];

const AUDIO_SOURCES = [
  { id: 'mp3quran', name: 'MP3Quran.net', nameEn: 'MP3Quran' },
  { id: 'everyayah', name: 'EveryAyah.com', nameEn: 'EveryAyah' }
];

createApp({
  setup() {
    const isDark = ref(true);
    const isArabic = ref(true);
    const isReadingMode = ref(false);
    const sidebarOpen = ref(false);
    const loading = ref(false);
    const searchQuery = ref('');
    const selectedReciter = ref('alafasy');
    const selectedSource = ref('everyayah');
    const currentSurah = ref(null);
    const currentPageIndex = ref(0);
    const surahs = ref([]);
    const pages = ref([]);
    const allAyahs = ref([]);
    const toasts = ref([]);
    const fontSize = ref(28);
    const lineHeight = ref(2.6);
    const textAlign = ref('center');
    const readingTheme = ref('light');
    const readingControlsVisible = ref(false);
    const showReadingSettings = ref(false);
    const pageTransition = ref('slide-left');
    const contentArea = ref(null);
    const readingArea = ref(null);
    const playingAyahNumber = ref(null);
    const isPlaying = ref(false);
    const showReciterPanel = ref(false);
    const showSourcePanel = ref(false);
    const repeatCount = ref(0);
    const currentRepeat = ref(0);
    const playMode = ref('surah');

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let currentAudio = null;
    let controlsTimeout = null;
    let lastTapTime = 0;
    let currentPlayingAyahIndex = -1;

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

    const currentReciter = computed(() => RECITERS.find(r => r.id === selectedReciter.value) || RECITERS[0]);
    const currentSource = computed(() => AUDIO_SOURCES.find(s => s.id === selectedSource.value) || AUDIO_SOURCES[0]);

    const currentSurahName = computed(() => {
      if (!currentSurah.value || !surahs.value.length) return '';
      const surah = surahs.value.find(s => s.number === currentSurah.value);
      return surah ? surah.name : '';
    });

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

    const getSurahPageCount = (num) => surahPageCount[num] || 10;

    const padNum = (num, len = 3) => String(num).padStart(len, '0');

    const getAyahAudioUrl = (surahNum, ayahNum) => {
      const reciter = currentReciter.value;
      if (selectedSource.value === 'everyayah') {
        return `https://everyayah.com/data/${reciter.everyayahKey}/${padNum(surahNum)}${padNum(ayahNum, 3)}.mp3`;
      }
      return `${reciter.baseUrl}${padNum(surahNum)}.mp3`;
    };

    const saveState = () => {
      try {
        const state = {
          isDark: isDark.value,
          isArabic: isArabic.value,
          currentSurah: currentSurah.value,
          currentPageIndex: currentPageIndex.value,
          selectedReciter: selectedReciter.value,
          selectedSource: selectedSource.value,
          fontSize: fontSize.value,
          lineHeight: lineHeight.value,
          textAlign: textAlign.value,
          readingTheme: readingTheme.value
        };
        localStorage.setItem('quranAppState', JSON.stringify(state));
      } catch (e) {
        console.warn('Could not save state:', e);
      }
    };

    const loadState = () => {
      try {
        const saved = localStorage.getItem('quranAppState');
        if (saved) {
          const state = JSON.parse(saved);
          isDark.value = state.isDark ?? true;
          isArabic.value = state.isArabic ?? true;
          currentSurah.value = state.currentSurah ?? null;
          currentPageIndex.value = state.currentPageIndex ?? 0;
          selectedReciter.value = state.selectedReciter ?? 'alafasy';
          selectedSource.value = state.selectedSource ?? 'everyayah';
          fontSize.value = state.fontSize ?? 28;
          lineHeight.value = state.lineHeight ?? 2.6;
          textAlign.value = state.textAlign ?? 'center';
          readingTheme.value = state.readingTheme ?? 'light';
          
          if (isDark.value) {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
          } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
          }
        }
      } catch (e) {
        console.warn('Could not load state:', e);
      }
    };

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
        ? (isArabic.value ? 'الوضع الليلي' : 'Night Mode') 
        : (isArabic.value ? 'الوضع النهاري' : 'Day Mode');
      showToast(themeLabel, 'bi bi-palette');
      saveState();
    };

    const toggleLang = () => {
      isArabic.value = !isArabic.value;
      showToast(isArabic.value ? 'العربية' : 'English', 'bi bi-translate');
      saveState();
    };

    const increaseFontSize = () => {
      if (fontSize.value < 60) {
        fontSize.value += 2;
        saveState();
      }
    };

    const decreaseFontSize = () => {
      if (fontSize.value > 16) {
        fontSize.value -= 2;
        saveState();
      }
    };

    const increaseLineHeight = () => {
      if (lineHeight.value < 3.2) {
        lineHeight.value = Math.round((lineHeight.value + 0.2) * 10) / 10;
        saveState();
      }
    };

    const decreaseLineHeight = () => {
      if (lineHeight.value > 1.8) {
        lineHeight.value = Math.round((lineHeight.value - 0.2) * 10) / 10;
        saveState();
      }
    };

    const setReadingTheme = (theme) => {
      readingTheme.value = theme;
      if (theme === 'light' || theme === 'sepia') {
        isDark.value = false;
      } else if (theme === 'dark' || theme === 'night') {
        isDark.value = true;
      }
      saveState();
    };

    const toggleReadingSettings = () => {
      showReadingSettings.value = !showReadingSettings.value;
      showReciterPanel.value = false;
      showSourcePanel.value = false;
    };

    const toggleReciterPanel = () => {
      showReciterPanel.value = !showReciterPanel.value;
      showSourcePanel.value = false;
      showReadingSettings.value = false;
    };

    const toggleSourcePanel = () => {
      showSourcePanel.value = !showSourcePanel.value;
      showReciterPanel.value = false;
      showReadingSettings.value = false;
    };

    const selectReciter = (id) => {
      selectedReciter.value = id;
      showReciterPanel.value = false;
      saveState();
      if (isPlaying.value) {
        playFromAyah(currentPlayingAyahIndex);
      }
    };

    const selectSource = (id) => {
      selectedSource.value = id;
      showSourcePanel.value = false;
      saveState();
      if (isPlaying.value) {
        playFromAyah(currentPlayingAyahIndex);
      }
    };

    const toggleReadingMode = () => {
      isReadingMode.value = !isReadingMode.value;
      if (isReadingMode.value) {
        readingControlsVisible.value = true;
        showReadingSettings.value = false;
        document.body.style.overflow = 'hidden';
        resetControlsTimeout();
      } else {
        document.body.style.overflow = '';
        clearTimeout(controlsTimeout);
      }
    };

    const exitReadingMode = () => {
      isReadingMode.value = false;
      showReadingSettings.value = false;
      document.body.style.overflow = '';
      clearTimeout(controlsTimeout);
    };

    const resetControlsTimeout = () => {
      clearTimeout(controlsTimeout);
      readingControlsVisible.value = true;
      controlsTimeout = setTimeout(() => {
        if (isReadingMode.value) {
          readingControlsVisible.value = false;
          showReadingSettings.value = false;
        }
      }, 4000);
    };

    const handleReadingTap = () => {
      const now = Date.now();
      if (now - lastTapTime < 300) return;
      lastTapTime = now;
      resetControlsTimeout();
    };

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
      if (sidebarOpen.value) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    const closeSidebar = () => {
      sidebarOpen.value = false;
      document.body.style.overflow = '';
    };

    const prevPage = () => {
      if (currentPageIndex.value > 0) {
        pageTransition.value = 'slide-right';
        currentPageIndex.value--;
        saveState();
        resetControlsTimeout();
      }
    };

    const nextPage = () => {
      if (currentPageIndex.value < totalPages.value - 1) {
        pageTransition.value = 'slide-left';
        currentPageIndex.value++;
        saveState();
        resetControlsTimeout();
      }
    };

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchMove = (e) => {
      if (!touchStartX || !touchStartY) return;
    };

    const handleTouchEnd = (e) => {
      if (!touchStartX || !touchStartY) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const deltaTime = Date.now() - touchStartTime;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 80 && Math.abs(deltaY) < 40 && deltaTime < 500) {
        const isRtl = document.documentElement.dir === 'rtl';
        if (isRtl) {
          if (deltaX > 0) nextPage();
          else prevPage();
        } else {
          if (deltaX < 0) nextPage();
          else prevPage();
        }
      }

      touchStartX = 0;
      touchStartY = 0;
      touchStartTime = 0;
    };

    const loadSurahs = async () => {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        if (!res.ok) throw new Error('Network response was not ok');
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
      document.body.style.overflow = '';
      stopAudio();

      try {
        const surahRes = await fetch(`https://api.alquran.cloud/v1/surah/${num}`);
        if (!surahRes.ok) throw new Error('Network response was not ok');
        const surahData = await surahRes.json();
        
        const ayahs = surahData.data.ayahs;
        allAyahs.value = ayahs;
        
        const wordsByAyah = {};
        try {
          const wordsRes = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${num}?language=ar&words=true&word_fields=text_uthmani,translation&translations=131&per_page=300`);
          if (wordsRes.ok) {
            const wordsData = await wordsRes.json();
            if (wordsData.verses) {
              wordsData.verses.forEach(v => {
                if (v.words) {
                  wordsByAyah[v.verse_number] = v.words;
                }
              });
            }
          }
        } catch (e) {
          console.warn('Word-by-word data not available, using fallback text');
        }
        
        const total = getSurahPageCount(num);
        const ayahsPerPage = Math.max(1, Math.ceil(ayahs.length / total));
        
        pages.value = [];
        
        for (let i = 0; i < ayahs.length; i += ayahsPerPage) {
          const chunk = ayahs.slice(i, Math.min(i + ayahsPerPage, ayahs.length));
          
          const text = chunk.map(a => {
            const words = wordsByAyah[a.numberInSurah] || [];
            const wordSpans = words
              .filter(w => w.char_type_name === 'word' && w.audio_url)
              .map(w => {
                const audioKey = w.audio_url.replace('wbw/', '').replace('.mp3', '');
                return `<span class="quran-word" data-audio="${audioKey}" onclick="window.__playWord(this)">${w.text_uthmani}</span>`;
              });
            
            const ayahText = wordSpans.length > 0 ? wordSpans.join(' ') : a.text;
            return `${ayahText} <span class="ayah-number" data-ayah="${a.numberInSurah}" onclick="window.__playAyah(${a.numberInSurah})">۝ ${a.numberInSurah}</span>`;
          }).join(' ');
          
          pages.value.push({
            text,
            startAyah: chunk[0].numberInSurah,
            endAyah: chunk[chunk.length - 1].numberInSurah,
            isFirstPage: i === 0
          });
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        saveState();
      } catch (error) {
        console.error('Error loading surah:', error);
        showToast(isArabic.value ? 'خطأ في تحميل السورة' : 'Error loading surah', 'bi bi-exclamation-triangle');
      } finally {
        loading.value = false;
      }
    };

    const stopAudio = () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
      }
      isPlaying.value = false;
      playingAyahNumber.value = null;
      currentPlayingAyahIndex = -1;
      currentRepeat.value = 0;
      document.querySelectorAll('.ayah-number.playing').forEach(el => el.classList.remove('playing'));
      document.querySelectorAll('.quran-word.playing').forEach(el => el.classList.remove('playing'));
    };

    const playFromAyah = (ayahIndex) => {
      if (!currentSurah.value || !allAyahs.value.length) return;
      
      currentPlayingAyahIndex = ayahIndex;
      const ayah = allAyahs.value[ayahIndex];
      if (!ayah) return;

      playingAyahNumber.value = ayah.numberInSurah;
      isPlaying.value = true;

      document.querySelectorAll('.ayah-number.playing').forEach(el => el.classList.remove('playing'));
      const el = document.querySelector(`.ayah-number[data-ayah="${ayah.numberInSurah}"]`);
      if (el) el.classList.add('playing');

      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }

      if (selectedSource.value === 'mp3quran') {
        currentAudio = new Audio(getAyahAudioUrl(currentSurah.value, ayah.numberInSurah));
        currentAudio.addEventListener('loadedmetadata', () => {
          const startFraction = ayahIndex / allAyahs.value.length;
          currentAudio.currentTime = currentAudio.duration * startFraction;
        });
        currentAudio.addEventListener('timeupdate', () => {
          if (!currentAudio || !currentAudio.duration) return;
          const fraction = currentAudio.currentTime / currentAudio.duration;
          const estimatedIndex = Math.floor(fraction * allAyahs.value.length);
          if (estimatedIndex !== currentPlayingAyahIndex && estimatedIndex < allAyahs.value.length) {
            currentPlayingAyahIndex = estimatedIndex;
            const currentAyah = allAyahs.value[estimatedIndex];
            if (currentAyah) {
              playingAyahNumber.value = currentAyah.numberInSurah;
              document.querySelectorAll('.ayah-number.playing').forEach(el => el.classList.remove('playing'));
              const el = document.querySelector(`.ayah-number[data-ayah="${currentAyah.numberInSurah}"]`);
              if (el) el.classList.add('playing');
            }
          }
        });
        currentAudio.addEventListener('ended', () => {
          if (currentPlayingAyahIndex < allAyahs.value.length - 1) {
            playFromAyah(currentPlayingAyahIndex + 1);
          } else {
            stopAudio();
            showToast(isArabic.value ? 'تمت السورة' : 'Surah completed', 'bi bi-check-circle');
          }
        });
      } else {
        currentAudio = new Audio(getAyahAudioUrl(currentSurah.value, ayah.numberInSurah));
        currentAudio.addEventListener('ended', () => {
          if (currentPlayingAyahIndex < allAyahs.value.length - 1) {
            playFromAyah(currentPlayingAyahIndex + 1);
          } else {
            stopAudio();
            showToast(isArabic.value ? 'تمت السورة' : 'Surah completed', 'bi bi-check-circle');
          }
        });
      }

      currentAudio.addEventListener('error', () => {
        if (currentPlayingAyahIndex < allAyahs.value.length - 1) {
          playFromAyah(currentPlayingAyahIndex + 1);
        } else {
          stopAudio();
        }
      });

      currentAudio.play().catch(e => {
        console.log('Play error:', e);
        stopAudio();
      });
    };

    const playAyahOnce = (ayahNum) => {
      if (!currentSurah.value || !allAyahs.value.length) return;
      
      const ayahIndex = allAyahs.value.findIndex(a => a.numberInSurah === ayahNum);
      if (ayahIndex === -1) return;

      stopAudio();

      currentPlayingAyahIndex = ayahIndex;
      const ayah = allAyahs.value[ayahIndex];

      playingAyahNumber.value = ayah.numberInSurah;
      isPlaying.value = true;

      document.querySelectorAll('.ayah-number.playing').forEach(el => el.classList.remove('playing'));
      const el = document.querySelector(`.ayah-number[data-ayah="${ayah.numberInSurah}"]`);
      if (el) el.classList.add('playing');

      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }

      currentAudio = new Audio(getAyahAudioUrl(currentSurah.value, ayah.numberInSurah));
      currentAudio.addEventListener('ended', () => {
        stopAudio();
      });
      currentAudio.addEventListener('error', () => {
        stopAudio();
      });
      currentAudio.play().catch(e => {
        console.log('Play error:', e);
        stopAudio();
      });
    };

    const playAyahRepeat = (ayahNum) => {
      if (!currentSurah.value || !allAyahs.value.length) return;
      
      const ayahIndex = allAyahs.value.findIndex(a => a.numberInSurah === ayahNum);
      if (ayahIndex === -1) return;

      stopAudio();

      currentPlayingAyahIndex = ayahIndex;
      const ayah = allAyahs.value[ayahIndex];

      playingAyahNumber.value = ayah.numberInSurah;
      isPlaying.value = true;
      currentRepeat.value = 0;

      document.querySelectorAll('.ayah-number.playing').forEach(el => el.classList.remove('playing'));
      const el = document.querySelector(`.ayah-number[data-ayah="${ayah.numberInSurah}"]`);
      if (el) el.classList.add('playing');

      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }

      const playOne = () => {
        currentAudio = new Audio(getAyahAudioUrl(currentSurah.value, ayah.numberInSurah));
        currentAudio.addEventListener('ended', () => {
          currentRepeat.value++;
          playOne();
        });
        currentAudio.addEventListener('error', () => {
          stopAudio();
        });
        currentAudio.play().catch(e => {
          console.log('Play error:', e);
          stopAudio();
        });
      };

      playOne();
    };

    const playAyah = (ayahNum) => {
      if (!currentSurah.value || !allAyahs.value.length) return;
      
      const ayahIndex = allAyahs.value.findIndex(a => a.numberInSurah === ayahNum);
      if (ayahIndex === -1) return;

      if (isPlaying.value && playingAyahNumber.value === ayahNum) {
        stopAudio();
        return;
      }

      playAyahRepeat(ayahNum);
    };

    const playWord = (el) => {
      const audioKey = el.getAttribute('data-audio');
      if (!audioKey) return;

      document.querySelectorAll('.quran-word.playing').forEach(w => w.classList.remove('playing'));
      el.classList.add('playing');

      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }

      currentAudio = new Audio(`https://verses.quran.com/wbw/${audioKey}.mp3`);
      currentAudio.addEventListener('ended', () => {
        el.classList.remove('playing');
        currentAudio = null;
      });
      currentAudio.addEventListener('error', () => {
        el.classList.remove('playing');
        currentAudio = null;
      });
      currentAudio.play().catch(e => {
        console.log('Word play error:', e);
        el.classList.remove('playing');
      });
    };

    const playCurrentAyah = () => {
      if (!currentSurah.value || !allAyahs.value.length) return;
      
      if (isPlaying.value) {
        if (currentAudio) {
          currentAudio.pause();
          isPlaying.value = false;
        }
        return;
      }

      playFromAyah(0);
    };

    const cycleRepeat = () => {
      repeatCount.value = repeatCount.value === 0 ? 1 : 0;
      if (repeatCount.value === 0) {
        showToast(isArabic.value ? 'بدون تكرار' : 'No repeat', 'bi bi-arrow-repeat');
      } else {
        showToast(isArabic.value ? 'تكرار مستمر' : 'Continuous repeat', 'bi bi-arrow-repeat');
      }
      saveState();
    };

    const stopRepeat = () => {
      repeatCount.value = 0;
      stopAudio();
      showToast(isArabic.value ? 'تم إيقاف التكرار' : 'Repeat stopped', 'bi bi-check-circle');
      saveState();
    };

    const togglePlayPause = () => {
      if (!currentSurah.value || !allAyahs.value.length) return;
      
      if (isPlaying.value) {
        if (currentAudio) {
          currentAudio.pause();
          isPlaying.value = false;
        }
      } else {
        if (currentPlayingAyahIndex >= 0) {
          playFromAyah(currentPlayingAyahIndex);
        } else {
          playFromAyah(0);
        }
      }
    };

    window.__playAyah = playAyah;
    window.__playWord = playWord;

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') nextPage();
      else if (e.key === 'ArrowRight') prevPage();
      else if (e.key === 'r' || e.key === 'R') toggleReadingMode();
      else if (e.key === 'Escape') {
        if (isReadingMode.value) exitReadingMode();
        if (sidebarOpen.value) closeSidebar();
        if (showReadingSettings.value) showReadingSettings.value = false;
        if (showReciterPanel.value) showReciterPanel.value = false;
        if (showSourcePanel.value) showSourcePanel.value = false;
      }
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
      else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
      resetControlsTimeout();
    });

    onMounted(async () => {
      try {
        loadState();
        await loadSurahs();
        if (currentSurah.value) {
          await loadSurah(currentSurah.value);
        } else {
          await loadSurah(1);
        }
      } catch (error) {
        console.error('App init error:', error);
        loading.value = false;
      }
    });

    return {
      isDark,
      isArabic,
      isReadingMode,
      sidebarOpen,
      loading,
      searchQuery,
      selectedReciter,
      selectedSource,
      currentSurah,
      currentPageIndex,
      surahs,
      pages,
      allAyahs,
      toasts,
      fontSize,
      lineHeight,
      textAlign,
      readingTheme,
      readingControlsVisible,
      showReadingSettings,
      showReciterPanel,
      showSourcePanel,
      pageTransition,
      contentArea,
      readingArea,
      playingAyahNumber,
      isPlaying,
      repeatCount,
      currentRepeat,
      playMode,
      currentReciter,
      currentSource,
      reciters: RECITERS,
      sources: AUDIO_SOURCES,
      currentSurahName,
      filteredSurahs,
      totalPages,
      progressPercent,
      toggleTheme,
      toggleLang,
      toggleReadingMode,
      exitReadingMode,
      toggleSidebar,
      closeSidebar,
      prevPage,
      nextPage,
      loadSurah,
      playCurrentAyah,
      togglePlayPause,
      stopAudio,
      playAyah,
      playWord,
      cycleRepeat,
      stopRepeat,
      increaseFontSize,
      decreaseFontSize,
      increaseLineHeight,
      decreaseLineHeight,
      setReadingTheme,
      toggleReadingSettings,
      toggleReciterPanel,
      toggleSourcePanel,
      selectReciter,
      selectSource,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      handleReadingTap,
      resetControlsTimeout
    };
  }
}).mount('#app');
