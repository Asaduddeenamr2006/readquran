# Quran App - المصحف التفاعلي

تطبيق ويب حديث لقراءة القرآن الكريم مبني بVue.js 3 وBootstrap 5.

## المميزات

- ⚡️ **Vue.js 3** - تفاعلية كاملة وحالة的管理
- 📱 **Responsive** - يعمل على جميع الأجهزة
- 🌓 **Theming** - ثيم فاتح وداكن
- 🎯 **Focus Mode** - قراءة بدون تشتيت
- 🔊 **Audio** - تشغيل التلاوة مع اختيار القارئ
- 🔍 **Search** - بحث في السور
- ⌨️ **Keyboard Shortcuts** - تحكم بلوحة المفاتيح

## التقنيات

- [Vue.js 3](https://vuejs.org/) - JavaScript Framework
- [Bootstrap 5](https://getbootstrap.com/) - CSS Framework
- [Bootstrap Icons](https://icons.getbootstrap.com/) - Icons
- [AlQuran Cloud API](https://api.alquran.cloud/) - Quran Data

## تشغيل المشروع

```bash
cd quran
python3 -m http.server 8000
# ثم افتح http://localhost:8000
```

## Keyboard Shortcuts

| المفتاح | الإجراء |
|--------|---------|
| ← | الصفحة السابقة |
| → | الصفحة التالية |
| F | تبديل وضع التركيز |
| Esc | الخروج من وضع التركيز |
| ↑/↓ | التنقل في Focus Mode |

## هيكل المشروع

```
quran/
├── index.html    # الملف الرئيسي
├── css/
│   └── styles.css
├── js/
│   └── app.js    # Vue.js التطبيق
└── README.md
```

## API

واجهة برمجة التطبيقات: `https://api.alquran.cloud/v1`

- `/surah` - قائمة السور
- `/surah/:number` - آيات سورة معينة
- `/ayah/:surah/:ayah/:reciter` - تشغيل تلاوة
