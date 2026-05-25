const playBtn = document.getElementById('play-btn');
let isPlaying = false;

playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    const icon = playBtn.querySelector('.material-symbols-outlined');
    icon.textContent = isPlaying ? 'pause' : 'play_arrow';
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

const settingsBtn = document.getElementById('settings-btn');
const settingsBtnMobile = document.getElementById('settings-btn-mobile');
const settingsModal = document.getElementById('settings-modal');

let currentSettings = {
    name: '[YOUR_NAME]',
    title: '[YOUR_TITLE]',
    bio: '[YOUR_BIO - Write a brief introduction about yourself, your interests, and what you do.]',
    skills: ['SKILL 1', 'SKILL 2', 'SKILL 3'],
    projects: '[NUM]',
    years: '[NUM]',
    connections: '[NUM]',
    headingFont: 'Noto Serif',
    bodyFont: 'Noto Serif',
    primaryColor: '#171818',
    bgColor: '#fbf9f4',
    cardColor: '#ffffff',
    avatarData: null,
    bgImageData: null,
    github: '#',
    linkedin: '#',
    email: '#',
    portfolio: '#',
    twitter: '#'
};

function openSettingsModal() {
    settingsModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    loadCurrentValues();
}

function closeSettingsModal() {
    settingsModal.classList.add('hidden');
    document.body.style.overflow = '';
}

function loadCurrentValues() {
    document.getElementById('edit-name').value = currentSettings.name;
    document.getElementById('edit-title').value = currentSettings.title;
    document.getElementById('edit-bio').value = currentSettings.bio;
    document.getElementById('edit-skills').value = currentSettings.skills.join(', ');
    document.getElementById('edit-projects').value = currentSettings.projects;
    document.getElementById('edit-years').value = currentSettings.years;
    document.getElementById('edit-connections').value = currentSettings.connections;
    document.getElementById('edit-heading-font').value = currentSettings.headingFont;
    document.getElementById('edit-body-font').value = currentSettings.bodyFont;
    document.getElementById('edit-primary-color').value = currentSettings.primaryColor;
    document.getElementById('edit-bg-color').value = currentSettings.bgColor;
    document.getElementById('edit-card-color').value = currentSettings.cardColor;
    document.getElementById('edit-github').value = currentSettings.github;
    document.getElementById('edit-linkedin').value = currentSettings.linkedin;
    document.getElementById('edit-email').value = currentSettings.email;
    document.getElementById('edit-portfolio').value = currentSettings.portfolio;
    document.getElementById('edit-twitter').value = currentSettings.twitter;
    
    if (currentSettings.avatarData) {
        const avatarPreview = document.getElementById('avatar-preview');
        avatarPreview.innerHTML = `<img src="${currentSettings.avatarData}" class="w-full h-full object-cover">`;
    }
    if (currentSettings.bgImageData) {
        const bgPreview = document.getElementById('bg-preview');
        bgPreview.innerHTML = `<img src="${currentSettings.bgImageData}" class="w-full h-full object-cover">`;
    }
}

function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`;
        };
        reader.readAsDataURL(file);
    }
}

function applySettings() {
    currentSettings = {
        name: document.getElementById('edit-name').value || '[YOUR_NAME]',
        title: document.getElementById('edit-title').value || '[YOUR_TITLE]',
        bio: document.getElementById('edit-bio').value || '[YOUR_BIO]',
        skills: document.getElementById('edit-skills').value.split(',').map(s => s.trim()).filter(s => s),
        projects: document.getElementById('edit-projects').value || '[NUM]',
        years: document.getElementById('edit-years').value || '[NUM]',
        connections: document.getElementById('edit-connections').value || '[NUM]',
        headingFont: document.getElementById('edit-heading-font').value,
        bodyFont: document.getElementById('edit-body-font').value,
        primaryColor: document.getElementById('edit-primary-color').value,
        bgColor: document.getElementById('edit-bg-color').value,
        cardColor: document.getElementById('edit-card-color').value,
        avatarData: getPreviewData('avatar-preview'),
        bgImageData: getPreviewData('bg-preview'),
        github: document.getElementById('edit-github').value || '#',
        linkedin: document.getElementById('edit-linkedin').value || '#',
        email: document.getElementById('edit-email').value || '#',
        portfolio: document.getElementById('edit-portfolio').value || '#',
        twitter: document.getElementById('edit-twitter').value || '#'
    };
    
    updatePageContent();
    closeSettingsModal();
}

function getPreviewData(previewId) {
    const preview = document.getElementById(previewId);
    const img = preview.querySelector('img');
    return img ? img.src : null;
}

function updatePageContent() {
    document.title = `${currentSettings.name} | Personal Bio`;
    
    document.querySelectorAll('.font-display-lg, h2.font-title-md').forEach(el => {
        if (el.textContent.includes('[YOUR_NAME]')) {
            el.textContent = currentSettings.name;
        }
    });
    
    document.querySelectorAll('.font-label-sm').forEach(el => {
        if (el.textContent.includes('[YOUR_TITLE]')) {
            el.textContent = currentSettings.title;
        }
    });
    
    const bioEl = document.querySelector('.font-body-lg.text-on-surface-variant.max-w-2xl');
    if (bioEl) bioEl.textContent = currentSettings.bio;
    
    const stats = document.querySelectorAll('#stats .font-headline-lg, #stats .font-display-lg');
    const statValues = [currentSettings.projects, currentSettings.years, currentSettings.connections];
    stats.forEach((el, i) => {
        if (statValues[i]) el.textContent = statValues[i];
    });
    
    const skillsContainer = document.querySelector('.mt-6.flex.flex-wrap.gap-3');
    if (skillsContainer && currentSettings.skills.length > 0) {
        skillsContainer.innerHTML = currentSettings.skills.map(skill => 
            `<span class="bg-surface-container px-4 py-1 rounded-full font-label-sm text-label-sm text-primary">${skill}</span>`
        ).join('');
    }
    
    if (currentSettings.avatarData) {
        document.querySelectorAll('img[alt="Avatar"], img[alt="Profile picture"]').forEach(img => {
            img.src = currentSettings.avatarData;
        });
    }
    
    if (currentSettings.bgImageData) {
        document.body.style.backgroundImage = `url('${currentSettings.bgImageData}')`;
    }
    
    document.documentElement.style.setProperty('--primary-color', currentSettings.primaryColor);
    document.documentElement.style.setProperty('--bg-color', currentSettings.bgColor);
    document.documentElement.style.setProperty('--card-bg', currentSettings.cardColor);
    
    document.querySelectorAll('.parchment-card').forEach(card => {
        card.style.backgroundColor = `${currentSettings.cardColor}bf`;
    });
    
    const socialLinks = document.querySelectorAll('#social a');
    const urls = [currentSettings.github, currentSettings.linkedin, currentSettings.email, currentSettings.portfolio, currentSettings.twitter];
    socialLinks.forEach((link, i) => {
        if (urls[i] && urls[i] !== '#') {
            link.href = urls[i];
        }
    });
    
    const style = document.createElement('style');
    style.textContent = `
        .font-display-lg, .font-headline-lg, .font-title-md, h2.font-title-md {
            font-family: '${currentSettings.headingFont}', serif !important;
        }
        .font-body-lg, .font-body-md, .font-label-md, .font-label-sm {
            font-family: '${currentSettings.bodyFont}', sans-serif !important;
        }
    `;
    document.head.appendChild(style);
    
    saveToLocalStorage();
}

function resetSettings() {
    currentSettings = {
        name: '[YOUR_NAME]',
        title: '[YOUR_TITLE]',
        bio: '[YOUR_BIO - Write a brief introduction about yourself, your interests, and what you do.]',
        skills: ['SKILL 1', 'SKILL 2', 'SKILL 3'],
        projects: '[NUM]',
        years: '[NUM]',
        connections: '[NUM]',
        headingFont: 'Noto Serif',
        bodyFont: 'Noto Serif',
        primaryColor: '#171818',
        bgColor: '#fbf9f4',
        cardColor: '#ffffff',
        avatarData: null,
        bgImageData: null,
        github: '#',
        linkedin: '#',
        email: '#',
        portfolio: '#',
        twitter: '#'
    };
    loadCurrentValues();
    
    const avatarPreview = document.getElementById('avatar-preview');
    avatarPreview.innerHTML = '<span class="material-symbols-outlined text-outline">person</span>';
    const bgPreview = document.getElementById('bg-preview');
    bgPreview.innerHTML = '<span class="material-symbols-outlined text-outline">image</span>';
}

function saveToLocalStorage() {
    const settingsToSave = {...currentSettings};
    delete settingsToSave.avatarData;
    delete settingsToSave.bgImageData;
    localStorage.setItem('personalBioSettings', JSON.stringify(settingsToSave));
    
    if (currentSettings.avatarData) {
        localStorage.setItem('personalBioAvatar', currentSettings.avatarData);
    }
    if (currentSettings.bgImageData) {
        localStorage.setItem('personalBioBg', currentSettings.bgImageData);
    }
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('personalBioSettings');
    if (saved) {
        currentSettings = {...currentSettings, ...JSON.parse(saved)};
    }
    const savedAvatar = localStorage.getItem('personalBioAvatar');
    if (savedAvatar) currentSettings.avatarData = savedAvatar;
    const savedBg = localStorage.getItem('personalBioBg');
    if (savedBg) currentSettings.bgImageData = savedBg;
    
    if (saved || savedAvatar || savedBg) {
        updatePageContent();
    }
}

if (settingsBtn) settingsBtn.addEventListener('click', openSettingsModal);
if (settingsBtnMobile) settingsBtnMobile.addEventListener('click', openSettingsModal);

document.addEventListener('DOMContentLoaded', loadFromLocalStorage);

async function exportPackage() {
    applySettings();
    
    const files = [];
    
    const htmlContent = await generateModifiedHTML();
    files.push({ name: 'index.html', content: htmlContent });
    
    const cssContent = await generateModifiedCSS();
    files.push({ name: 'styles.css', content: cssContent });
    
    const jsContent = generateModifiedJS();
    files.push({ name: 'script.js', content: jsContent });
    
    if (currentSettings.avatarData) {
        const avatarFile = await dataURLtoFile(currentSettings.avatarData, 'avatar.png');
        files.push({ name: 'avatar.png', content: avatarFile, isBinary: true });
    }
    
    if (currentSettings.bgImageData) {
        const bgFile = await dataURLtoFile(currentSettings.bgImageData, 'background.png');
        files.push({ name: 'background.png', content: bgFile, isBinary: true });
    }
    
    await downloadZip(files);
}

async function generateModifiedHTML() {
    let html = document.documentElement.outerHTML;
    
    html = html.replace(/\[YOUR_NAME\]/g, currentSettings.name);
    html = html.replace(/\[YOUR_TITLE\]/g, currentSettings.title);
    html = html.replace(/\[YOUR_BIO[^\]]*\]/g, currentSettings.bio);
    html = html.replace(/\[NUM\]/g, currentSettings.projects);
    
    const skillsHtml = currentSettings.skills.map(skill => 
        `<span class="bg-surface-container px-4 py-1 rounded-full font-label-sm text-label-sm text-primary">${skill}</span>`
    ).join('\n                        ');
    html = html.replace(/<span class="bg-surface-container px-4 py-1 rounded-full font-label-sm text-label-sm text-primary">SKILL 1<\/span>\s*\n\s*<span class="bg-surface-container px-4 py-1 rounded-full font-label-sm text-label-sm text-primary">SKILL 2<\/span>\s*\n\s*<span class="bg-surface-container px-4 py-1 rounded-full font-label-sm text-label-sm text-primary">SKILL 3<\/span>/, skillsHtml);
    
    const statsValues = [currentSettings.projects, currentSettings.years, currentSettings.connections];
    const statTexts = ['Projects', 'Years Exp', 'Connections'];
    for (let i = 0; i < 3; i++) {
        const pattern = new RegExp(`(<span class="font-headline-lg[^"]*">\\[NUM\\]</span>\\s*\\n\\s*<span class="font-label-sm[^"]*[^>]*>${statTexts[i]}</span>)`);
    }
    
    if (currentSettings.avatarData) {
        const avatarBase64 = currentSettings.avatarData;
        html = html.replace(/src="https:\/\/images\.unsplash\.com\/photo-1472099645785-5658abf4ff4e\?w=200&h=200&fit=crop"/g, `src="avatar.png"`);
        html = html.replace(/src="https:\/\/images\.unsplash\.com\/photo-1472099645785-5658abf4ff4e\?w=400&h=400&fit=crop"/g, `src="avatar.png"`);
    }
    
    if (currentSettings.bgImageData) {
        html = html.replace(/background-image: url\('https:\/\/images\.unsplash\.com\/photo-1558618666-fcd25c85cd64\?w=1920&q=80'\);/g, `background-image: url('background.png');`);
    }
    
    const socialUrls = [currentSettings.github, currentSettings.linkedin, currentSettings.email, currentSettings.portfolio, currentSettings.twitter];
    const socialPatterns = [
        /href="#"[^>]*>\s*<div[^>]*>\s*<span[^>]*>code<\/span>/,
        /href="#"[^>]*>\s*<div[^>]*>\s*<span[^>]*>work<\/span>/,
        /href="#"[^>]*>\s*<div[^>]*>\s*<span[^>]*>mail<\/span>/,
        /href="#"[^>]*>\s*<div[^>]*>\s*<span[^>]*>brush<\/span>/,
        /href="#"[^>]*>\s*<div[^>]*>\s*<span[^>]*>chat<\/span>/
    ];
    socialPatterns.forEach((pattern, i) => {
        if (socialUrls[i] && socialUrls[i] !== '#') {
            html = html.replace(pattern, `href="${socialUrls[i]}"`);
        }
    });
    
    html = '<!DOCTYPE html>\n<html' + html.substring(html.indexOf('<html') + 5);
    
    return html;
}

async function generateModifiedCSS() {
    let css = `body {
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
}

.grain-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 50;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.parchment-card {
    background-color: ${currentSettings.cardColor}bf;
    backdrop-filter: blur(8px);
    border: 1px solid #E8E2D6;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.active-interaction:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
}

#settings-modal input[type="text"],
#settings-modal input[type="url"],
#settings-modal input[type="email"],
#settings-modal textarea,
#settings-modal select {
    font-size: 14px;
}

#settings-modal input[type="color"] {
    -webkit-appearance: none;
    border: none;
    padding: 0;
}

#settings-modal input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
}

#settings-modal input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
}

.font-display-lg, .font-headline-lg, .font-title-md, h2.font-title-md {
    font-family: '${currentSettings.headingFont}', serif !important;
}

.font-body-lg, .font-body-md, .font-label-md, .font-label-sm {
    font-family: '${currentSettings.bodyFont}', sans-serif !important;
}`;

    if (currentSettings.bgImageData) {
        css = css.replace('background-size: cover;', `background-image: url('background.png');\n    background-size: cover;`);
    } else {
        css = `body {
    background-image: url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80');
${css.substring(css.indexOf('body {') + 7)}`;
    }
    
    return css;
}

function generateModifiedJS() {
    return `const playBtn = document.getElementById('play-btn');
let isPlaying = false;

playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    const icon = playBtn.querySelector('.material-symbols-outlined');
    icon.textContent = isPlaying ? 'pause' : 'play_arrow';
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});`;
}

async function dataURLtoFile(dataURL, filename) {
    const response = await fetch(dataURL);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
}

async function downloadZip(files) {
    const zip = new JSZip();
    
    for (const file of files) {
        if (file.isBinary) {
            zip.file(file.name, file.content);
        } else {
            zip.file(file.name, file.content);
        }
    }
    
    const readme = `# Personal Bio

這是您的個人簡介網頁，已根據您的設定自動生成。

## 上傳到 GitHub Pages 步驟：

1. 在 GitHub 上建立一個新倉庫（例如：yourname.github.io）
2. 將此 ZIP 解壓縮後的所有檔案上傳到倉庫
3. 在倉庫設定中啟用 GitHub Pages（Settings > Pages > Source: main branch）
4. 等待幾分鐘後，您的網頁將會在 https://yourname.github.io 上線

## 檔案說明：

- index.html - 主網頁檔案
- styles.css - 樣式檔案  
- script.js - JavaScript 檔案
- avatar.png - 您的大頭貼（如果有設定）
- background.png - 背景圖片（如果有設定）

感謝使用 Personal Bio Template！`;
    zip.file('README.md', readme);
    
    const content = await zip.generateAsync({ type: 'blob' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'personal-bio-package.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function loadJSZip() {
    if (typeof JSZip !== 'undefined') return Promise.resolve();
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadJSZip();
});
