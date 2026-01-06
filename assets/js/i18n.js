class I18nManager {
    constructor() {
        this.currentLang = localStorage.getItem('app_language') || 'zh-CN';
        this.data = typeof i18nData !== 'undefined' ? i18nData : {};
        this.init();
    }

    init() {
        this.applyLanguage(this.currentLang);
        this.updateDropdownUI();
    }

    setLanguage(lang) {
        if (this.data[lang]) {
            this.currentLang = lang;
            localStorage.setItem('app_language', lang);
            this.applyLanguage(lang);
            this.updateDropdownUI();
        }
    }

    applyLanguage(lang) {
        const langData = this.data[lang];
        if (!langData) return;

        // Update Text Content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (langData[key]) {
                if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
                    element.setAttribute('placeholder', langData[key]);
                } else {
                    element.innerText = langData[key];
                }
            }
        });

        // Handle RTL for Arabic
        if (lang === 'ar-SA') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.body.classList.add('rtl-mode');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.body.classList.remove('rtl-mode');
        }

        // Update html lang attribute
        document.documentElement.setAttribute('lang', lang);
    }

    updateDropdownUI() {
        // Update the active state in the language dropdown if it exists
        document.querySelectorAll('.lang-option').forEach(option => {
            if (option.getAttribute('data-lang') === this.currentLang) {
                option.classList.add('active', 'bg-blue-50', 'text-blue-600');
            } else {
                option.classList.remove('active', 'bg-blue-50', 'text-blue-600');
            }
        });

        // Update main toggle button text/icon if needed
        const currentLangLabel = document.getElementById('currentLangLabel');
        if (currentLangLabel) {
            const labels = {
                'zh-CN': '中文',
                'en-US': 'English',
                'pt-BR': 'Português',
                'ar-SA': 'العربية'
            };
            currentLangLabel.innerText = labels[this.currentLang];
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.i18n = new I18nManager();
});
