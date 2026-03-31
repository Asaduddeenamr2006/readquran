const { createApp, ref, computed, onMounted } = Vue;

const RECITERS = [
  { id: 'Alafasy_128kbps', name: 'مشاري العفاسي' },
  { id: 'Husary_128kbps', name: 'محمود خليل الحصري' },
  { id: 'Husary_128kbps_Mujawwad', name: 'الحصري - مجود' },
  { id: 'Husary_Muallim_128kbps', name: 'الحصري - معلم' },
  { id: 'Abdul_Basit_Murattal_192kbps', name: 'عبد الباسط - مرتل' },
  { id: 'Abdul_Basit_Mujawwad_128kbps', name: 'عبد الباسط - مجود' },
  { id: 'Abdurrahmaan_As-Sudais_192kbps', name: 'عبد الرحمن السديس' },
  { id: 'Minshawy_Murattal_128kbps', name: 'المنشاوي - مرتل' },
  { id: 'Minshawy_Mujawwad_192kbps', name: 'المنشاوي - مجود' },
  { id: 'Minshawy_Teacher_128kbps', name: 'المنشاوي - معلم' },
  { id: 'MaherAlMuaiqly128kbps', name: 'ماهر المعيقلي' },
  { id: 'Ghamadi_40kbps', name: 'سعد الغامدي' },
  { id: 'ahmed_ibn_ali_al_ajamy_128kbps', name: 'أحمد العجمي' },
  { id: 'Saood_ash-Shuraym_128kbps', name: 'سعود الشريم' },
  { id: 'Fares_Abbad_64kbps', name: 'فارس عباد' },
  { id: 'Yasser_Ad-Dussary_128kbps', name: 'ياسر الدوسري' },
  { id: 'Abdullaah_3awwaad_Al-Juhaynee_128kbps', name: 'عبد الله الجهني' },
  { id: 'Abu_Bakr_Ash-Shaatree_128kbps', name: 'أبو بكر الشاطري' },
  { id: 'Hudhaify_128kbps', name: 'علي الحذيفي' },
  { id: 'Ali_Jaber_64kbps', name: 'علي جابر' },
  { id: 'Muhammad_Ayyoub_128kbps', name: 'محمد أيوب' },
  { id: 'Muhammad_Jibreel_128kbps', name: 'محمد جبريل' },
  { id: 'Muhsin_Al_Qasim_192kbps', name: 'محسن القاسم' },
  { id: 'Salah_Al_Budair_128kbps', name: 'صلاح البدير' },
  { id: 'Nasser_Alqatami_128kbps', name: 'ناصر القطامي' },
  { id: 'Khaalid_Abdullaah_al-Qahtaanee_192kbps', name: 'خالد القحطاني' },
  { id: 'Hani_Rifai_192kbps', name: 'هاني الرفاعي' },
  { id: 'Akram_AlAlaqimy_128kbps', name: 'أكرم العلقمي' },
  { id: 'Ali_Hajjaj_AlSuesy_128kbps', name: 'علي حجاج السويسي' },
  { id: 'Abdullah_Basfar_192kbps', name: 'عبد الله بصفر' },
  { id: 'Mohammad_al_Tablaway_128kbps', name: 'محمد الطبلاوي' },
  { id: 'Mustafa_Ismail_48kbps', name: 'مصطفى إسماعيل' },
  { id: 'mahmoud_ali_al_banna_32kbps', name: 'محمود علي البنا' },
  { id: 'Salaah_AbdulRahman_Bukhatir_128kbps', name: 'صلاح بخاطر' },
  { id: 'Aziz_Alili_128kbps', name: 'عزيز العليلي' },
  { id: 'Yaser_Salamah_128kbps', name: 'ياسر سلامة' },
  { id: 'Sahl_Yassin_128kbps', name: 'سهل ياسين' },
  { id: 'Ibrahim_Akhdar_64kbps', name: 'إبراهيم الأخضر' },
  { id: 'Ahmed_Neana_128kbps', name: 'أحمد نعينع' },
  { id: 'Nabil_Rifa3i_48kbps', name: 'نبيل الرفاعي' },
  { id: 'Abdullah_Matroud_128kbps', name: 'عبد الله مطرود' },
  { id: 'Muhammad_AbdulKareem_128kbps', name: 'محمد عبد الكريم' },
  { id: 'Karim_Mansoori_40kbps', name: 'كريم منصوري' }
];

const TAFSIR_NAMES = {
  'ar.muyassar': 'التفسير الميسر',
  'ar.jalalayn': 'تفسير الجلالين',
  'ar.qurtubi': 'تفسير القرطبي',
  'ar.baghawi': 'تفسير البغوي',
  'ar.ibnkathir': 'تفسير ابن كثير'
};

const SURAHS_PER_PAGE = {
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

const THEMES = ['theme-navy', 'theme-black', 'theme-white'];
const THEME_ICONS = { 'theme-navy': 'bi bi-moon-stars', 'theme-black': 'bi bi-moon-fill', 'theme-white': 'bi bi-sun' };

createApp({
  setup() {
    const theme = ref('theme-navy');
    const isArabic = ref(true);
    const sidebarOpen = ref(false);
    const loading = ref(false);
    const searchQuery = ref('');
    const selectedReciter = ref('Alafasy_128kbps');
    const reciterSearch = ref('');
    const currentSurah = ref(null);
    const currentPageIndex = ref(0);
    const surahs = ref([]);
    const pages = ref([]);
    const allAyahs = ref([]);
    const toasts = ref([]);
    const fontSize = ref(28);
    const playingAyahNumber = ref(null);
    const isPlaying = ref(false);
    const showTafsir = ref(false);
    const selectedTafsir = ref('ar.muyassar');
    const tafsirData = ref([]);
    const tafsirLoading = ref(false);
    const surahInfo = ref(null);
    const showReciterPanel = ref(false);

    let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
    let currentAudio = null;
    let currentPlayingAyahIndex = -1;

    const currentReciterName = computed(() => {
      const r = RECITERS.find(r => r.id === selectedReciter.value);
      return r ? r.name : '';
    });

    const themeIcon = computed(() => {
      const idx = THEMES.indexOf(theme.value);
      return THEME_ICONS[THEMES[(idx + 1) % THEMES.length]];
    });

    const currentSurahName = computed(() => {
      if (!currentSurah.value || !surahs.value.length) return '';
      const s = surahs.value.find(s => s.number === currentSurah.value);
      return s ? s.name : '';
    });

    const filteredSurahs = computed(() => {
      if (!searchQuery.value) return surahs.value;
      const q = searchQuery.value.toLowerCase();
      return surahs.value.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.englishName.toLowerCase().includes(q) ||
        s.number.toString().includes(q)
      );
    });

    const filteredReciters = computed(() => {
      if (!reciterSearch.value) return RECITERS;
      const q = reciterSearch.value.toLowerCase();
      return RECITERS.filter(r => r.name.toLowerCase().includes(q));
    });

    const totalPages = computed(() => pages.value.length);
    const tafsirName = computed(() => TAFSIR_NAMES[selectedTafsir.value] || '');

    const padNum = (n, len = 3) => String(n).padStart(len, '0');

    const getAyahAudioUrl = (surahNum, ayahNum) => {
      return `https://everyayah.com/data/${selectedReciter.value}/${padNum(surahNum)}${padNum(ayahNum, 3)}.mp3`;
    };

    const saveState = () => {
      try {
        localStorage.setItem('quranState', JSON.stringify({
          theme: theme.value,
          isArabic: isArabic.value,
          currentSurah: currentSurah.value,
          currentPageIndex: currentPageIndex.value,
          selectedReciter: selectedReciter.value,
          fontSize: fontSize.value
        }));
      } catch (e) {}
    };

    const loadState = () => {
      try {
        const s = JSON.parse(localStorage.getItem('quranState') || '{}');
        theme.value = s.theme || 'theme-navy';
        isArabic.value = s.isArabic !== undefined ? s.isArabic : true;
        currentSurah.value = s.currentSurah || null;
        currentPageIndex.value = s.currentPageIndex || 0;
        selectedReciter.value = s.selectedReciter || 'Alafasy_128kbps';
        fontSize.value = s.fontSize || 28;
        document.body.className = theme.value;
      } catch (e) {}
    };

    const showToast = (msg, icon = 'bi bi-info-circle') => {
      const id = Date.now();
      toasts.value.push({ id, message: msg, icon });
      setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id); }, 2000);
    };

    const toggleTheme = () => {
      const idx = THEMES.indexOf(theme.value);
      theme.value = THEMES[(idx + 1) % THEMES.length];
      document.body.className = theme.value;
      saveState();
    };

    const toggleLang = () => { isArabic.value = !isArabic.value; saveState(); };

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
      document.body.style.overflow = sidebarOpen.value ? 'hidden' : '';
    };
    const closeSidebar = () => { sidebarOpen.value = false; document.body.style.overflow = ''; };

    const prevPage = () => {
      if (currentPageIndex.value > 0) { currentPageIndex.value--; saveState(); }
    };
    const nextPage = () => {
      if (currentPageIndex.value < totalPages.value - 1) { currentPageIndex.value++; saveState(); }
    };

    const handleTouchStart = (e) => { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; touchStartTime = Date.now(); };
    const handleTouchMove = () => {};
    const handleTouchEnd = (e) => {
      if (!touchStartX || !touchStartY) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const dt = Date.now() - touchStartTime;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 80 && Math.abs(dy) < 40 && dt < 500) {
        const rtl = document.documentElement.dir === 'rtl';
        if (rtl) { dx > 0 ? nextPage() : prevPage(); }
        else { dx < 0 ? nextPage() : prevPage(); }
      }
      touchStartX = 0; touchStartY = 0;
    };

    const loadSurahs = async () => {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        surahs.value = data.data;
      } catch (e) {
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
      tafsirData.value = [];
      surahInfo.value = null;

      try {
        const quranRes = await fetch(`https://api.alquran.cloud/v1/surah/${num}`);
        if (!quranRes.ok) throw new Error('Failed to load surah');
        const quranData = await quranRes.json();
        let ayahs = quranData.data.ayahs;

        const bismillah = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';
        if (num !== 1 && num !== 9 && ayahs.length > 0 && ayahs[0].text.startsWith(bismillah)) {
          ayahs = [...ayahs];
          ayahs[0] = { ...ayahs[0], text: ayahs[0].text.replace(bismillah, '').trim() };
        }

        allAyahs.value = ayahs;

        const wordsByAyah = {};
        try {
          const wRes = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${num}?language=ar&words=true&word_fields=text_uthmani,translation&translations=131&per_page=300`);
          if (wRes.ok) {
            const wData = await wRes.json();
            if (wData.verses) {
              wData.verses.forEach(v => {
                if (v.words) wordsByAyah[v.verse_number] = v.words;
              });
            }
          }
        } catch (e) { /* word data optional */ }

        const total = SURAHS_PER_PAGE[num] || 10;
        const perPage = Math.max(1, Math.ceil(ayahs.length / total));
        pages.value = [];

        for (let i = 0; i < ayahs.length; i += perPage) {
          const chunk = ayahs.slice(i, Math.min(i + perPage, ayahs.length));
          const text = chunk.map(a => {
            const words = wordsByAyah[a.numberInSurah] || [];
            const wordSpans = words
              .filter(w => w.char_type_name === 'word' && w.audio_url)
              .map(w => {
                const key = w.audio_url.replace('wbw/', '').replace('.mp3', '');
                return `<span class="quran-word" data-audio="${key}" onclick="window.__playWord(this)">${w.text_uthmani}</span>`;
              });
            const ayahText = wordSpans.length > 0 ? wordSpans.join(' ') : a.text;
            return `${ayahText} <span class="ayah-number" data-ayah="${a.numberInSurah}" onclick="window.__playAyah(${a.numberInSurah})">۝ ${a.numberInSurah}</span>`;
          }).join(' ');
          pages.value.push({
            text, startAyah: chunk[0].numberInSurah,
            endAyah: chunk[chunk.length - 1].numberInSurah
          });
        }

        try {
          const infoRes = await fetch(`https://api.quran.com/api/v4/chapters/${num}?language=ar`);
          if (infoRes.ok) {
            const infoData = await infoRes.json();
            const info = infoData.chapter;
            surahInfo.value = {
              revelationType: info.revelation_place,
              orderOfRevelation: info.revelation_order,
              ayahsCount: info.verses_count
            };
          }
        } catch (e) { surahInfo.value = null; }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        saveState();
      } catch (e) {
        console.error('Error loading surah:', e);
        showToast(isArabic.value ? 'خطأ في تحميل السورة' : 'Error loading surah', 'bi bi-exclamation-triangle');
        pages.value = [];
      } finally {
        loading.value = false;
      }
    };

    const loadTafsir = async () => {
      if (!currentSurah.value) return;
      tafsirLoading.value = true;
      try {
        const quranRes = await fetch(`https://api.alquran.cloud/v1/surah/${currentSurah.value}`);
        if (!quranRes.ok) throw new Error('Failed');
        const quranData = await quranRes.json();
        let quranAyahs = quranData.data.ayahs;

        let tafsirAyahs;
        if (selectedTafsir.value === 'ar.ibnkathir') {
          const ikRes = await fetch(`https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/ar-tafsir-ibn-kathir/${currentSurah.value}.json`);
          if (!ikRes.ok) throw new Error('Ibn Kathir failed');
          const ikData = await ikRes.json();
          tafsirAyahs = ikData.ayahs.map(a => ({
            numberInSurah: a.number, text: a.text, number: 0
          }));
        } else {
          const tRes = await fetch(`https://api.alquran.cloud/v1/surah/${currentSurah.value}/${selectedTafsir.value}`);
          if (!tRes.ok) throw new Error('Tafsir failed');
          const tData = await tRes.json();
          tafsirAyahs = tData.data.ayahs;
        }

        const bismillah = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';
        let bismillahTafsir = null;

        if (currentSurah.value !== 1 && currentSurah.value !== 9 && quranAyahs.length > 0) {
          if (quranAyahs[0].text.startsWith(bismillah)) {
            quranAyahs = [...quranAyahs];
            quranAyahs[0] = { ...quranAyahs[0], text: quranAyahs[0].text.replace(bismillah, '').trim() };
          }
          if (tafsirAyahs[0] && tafsirAyahs[0].text && tafsirAyahs[0].text.includes(bismillah)) {
            tafsirAyahs = [...tafsirAyahs];
            const t = tafsirAyahs[0].text;
            const idx = t.indexOf(bismillah);
            if (idx !== -1) {
              const end = idx + bismillah.length;
              bismillahTafsir = t.substring(0, end).trim();
              tafsirAyahs[0] = { ...tafsirAyahs[0], text: t.substring(end).trim() };
            }
          }
        }

        const result = [];
        if (bismillahTafsir) {
          result.push({ numberInSurah: 0, text: bismillahTafsir, number: 0, ayahText: bismillah, isBismillah: true });
        }
        tafsirAyahs.forEach((t, i) => {
          result.push({
            numberInSurah: t.numberInSurah, text: t.text, number: t.number,
            ayahText: quranAyahs[i] ? quranAyahs[i].text : '', isBismillah: false
          });
        });
        tafsirData.value = result;
      } catch (e) {
        console.error('Tafsir error:', e);
        tafsirData.value = [];
      } finally {
        tafsirLoading.value = false;
      }
    };

    const toggleTafsir = () => {
      showTafsir.value = !showTafsir.value;
      if (showTafsir.value && currentSurah.value && tafsirData.value.length === 0) {
        loadTafsir();
      }
    };

    const stopAudio = () => {
      if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio = null; }
      isPlaying.value = false;
      playingAyahNumber.value = null;
      currentPlayingAyahIndex = -1;
      document.querySelectorAll('.ayah-number.playing, .quran-word.playing').forEach(el => el.classList.remove('playing'));
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

      if (currentAudio) { currentAudio.pause(); currentAudio = null; }

      currentAudio = new Audio(getAyahAudioUrl(currentSurah.value, ayah.numberInSurah));
      currentAudio.addEventListener('ended', () => {
        if (currentPlayingAyahIndex < allAyahs.value.length - 1) playFromAyah(currentPlayingAyahIndex + 1);
        else { stopAudio(); showToast(isArabic.value ? 'تمت السورة' : 'Surah completed', 'bi bi-check-circle'); }
      });
      currentAudio.addEventListener('error', () => {
        if (currentPlayingAyahIndex < allAyahs.value.length - 1) playFromAyah(currentPlayingAyahIndex + 1);
        else stopAudio();
      });
      currentAudio.play().catch(() => stopAudio());
    };

    const playAyah = (ayahNum) => {
      if (!currentSurah.value || !allAyahs.value.length) return;
      const idx = allAyahs.value.findIndex(a => a.numberInSurah === ayahNum);
      if (idx === -1) return;
      if (isPlaying.value && playingAyahNumber.value === ayahNum) { stopAudio(); return; }
      stopAudio();
      currentPlayingAyahIndex = idx;
      const ayah = allAyahs.value[idx];
      playingAyahNumber.value = ayah.numberInSurah;
      isPlaying.value = true;
      document.querySelectorAll('.ayah-number.playing').forEach(el => el.classList.remove('playing'));
      const el = document.querySelector(`.ayah-number[data-ayah="${ayah.numberInSurah}"]`);
      if (el) el.classList.add('playing');
      if (currentAudio) { currentAudio.pause(); currentAudio = null; }
      currentAudio = new Audio(getAyahAudioUrl(currentSurah.value, ayah.numberInSurah));
      const repeat = () => {
        currentAudio = new Audio(getAyahAudioUrl(currentSurah.value, ayah.numberInSurah));
        currentAudio.addEventListener('ended', repeat);
        currentAudio.addEventListener('error', () => stopAudio());
        currentAudio.play().catch(() => stopAudio());
      };
      currentAudio.addEventListener('ended', repeat);
      currentAudio.addEventListener('error', () => stopAudio());
      currentAudio.play().catch(() => stopAudio());
    };

    const playWord = (el) => {
      const key = el.getAttribute('data-audio');
      if (!key) return;
      document.querySelectorAll('.quran-word.playing').forEach(w => w.classList.remove('playing'));
      el.classList.add('playing');
      if (currentAudio) { currentAudio.pause(); currentAudio = null; }
      currentAudio = new Audio(`https://verses.quran.com/wbw/${key}.mp3`);
      currentAudio.addEventListener('ended', () => { el.classList.remove('playing'); currentAudio = null; });
      currentAudio.addEventListener('error', () => { el.classList.remove('playing'); currentAudio = null; });
      currentAudio.play().catch(() => el.classList.remove('playing'));
    };

    const togglePlayPause = () => {
      if (!currentSurah.value || !allAyahs.value.length) return;
      if (isPlaying.value) {
        if (currentAudio) { currentAudio.pause(); isPlaying.value = false; }
      } else {
        if (currentPlayingAyahIndex >= 0) playFromAyah(currentPlayingAyahIndex);
        else playFromAyah(0);
      }
    };

    const selectReciter = (id) => {
      selectedReciter.value = id;
      showReciterPanel.value = false;
      saveState();
      if (isPlaying.value) playFromAyah(currentPlayingAyahIndex);
    };

    window.__playAyah = playAyah;
    window.__playWord = playWord;

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') nextPage();
      else if (e.key === 'ArrowRight') prevPage();
      else if (e.key === 'Escape') {
        if (sidebarOpen.value) closeSidebar();
        if (showReciterPanel.value) showReciterPanel.value = false;
      }
      else if (e.key === ' ') { e.preventDefault(); togglePlayPause(); }
    });

    onMounted(async () => {
      try {
        loadState();
        await loadSurahs();
        if (currentSurah.value) await loadSurah(currentSurah.value);
        else await loadSurah(1);
      } catch (e) {
        console.error('Init error:', e);
        loading.value = false;
      }
    });

    return {
      theme, themeIcon, isArabic, sidebarOpen, loading, searchQuery,
      selectedReciter, reciterSearch, currentSurah, currentPageIndex,
      surahs, pages, allAyahs, toasts, fontSize,
      playingAyahNumber, isPlaying, showTafsir, selectedTafsir, tafsirData,
      tafsirLoading, surahInfo, showReciterPanel,
      currentReciterName, currentSurahName, filteredSurahs, filteredReciters,
      totalPages, tafsirName,
      toggleTheme, toggleLang,
      toggleSidebar, closeSidebar, prevPage, nextPage, loadSurah,
      togglePlayPause, stopAudio, playAyah, playWord,
      selectReciter, loadTafsir, toggleTafsir,
      handleTouchStart, handleTouchMove, handleTouchEnd
    };
  }
}).mount('#app');
