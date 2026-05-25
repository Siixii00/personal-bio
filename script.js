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
