let globalSettings = {
    name: 'Your Name',
    title: 'Your Title',
    bio: 'Write a brief introduction about yourself, your interests, and what you do.',
    skills: ['Skill 1', 'Skill 2', 'Skill 3'],
    projects: '0',
    years: '0',
    connections: '0',
    headingFont: 'Noto Serif',
    bodyFont: 'Noto Serif',
    primaryColor: '#171818',
    bgColor: '#fbf9f4',
    cardColor: '#ffffff',
    avatarData: null,
    bgImageData: null,
    github: '',
    linkedin: '',
    email: '',
    portfolio: '',
    twitter: ''
};

let pageConfig = {
    navItems: [
        { id: 'nav-1', label: 'Profile', icon: 'person', targetBlock: 'block-profile', isNewTab: false },
        { id: 'nav-2', label: 'Stats', icon: 'leaderboard', targetBlock: 'block-stats', isNewTab: false },
        { id: 'nav-3', label: 'Works', icon: 'menu_book', targetBlock: 'block-works', isNewTab: false },
        { id: 'nav-4', label: 'Social', icon: 'share', targetBlock: 'block-social', isNewTab: false }
    ],
    blocks: [
        { id: 'block-profile', type: 'profile', title: 'Profile', visible: true },
        { id: 'block-stats', type: 'stats', title: 'Statistics', visible: true },
        { id: 'block-music', type: 'music', title: 'Now Playing', visible: true },
        { id: 'block-works', type: 'works', title: 'Featured Works', visible: true },
        { id: 'block-social', type: 'social', title: 'Social Connections', visible: true }
    ]
};

let currentEditingBlock = null;

const blockTypes = [
    { type: 'profile', name: '個人檔案', icon: 'person', description: '顯示大頭貼、姓名和簡介' },
    { type: 'stats', name: '統計數據', icon: 'leaderboard', description: '顯示專案數、年資等數據' },
    { type: 'music', name: '音樂播放器', icon: 'music_note', description: '展示正在播放的音樂' },
    { type: 'works', name: '作品展示', icon: 'menu_book', description: '展示專案和作品' },
    { type: 'social', name: '社群連結', icon: 'share', description: '社群媒體連結' },
    { type: 'text', name: '文字區塊', icon: 'article', description: '自訂文字內容' },
    { type: 'image', name: '圖片區塊', icon: 'image', description: '單張圖片展示' },
    { type: 'links', name: '連結列表', icon: 'link', description: '自訂連結按鈕列表' },
    { type: 'divider', name: '分隔線', icon: 'horizontal_rule', description: '視覺分隔區塊' },
    { type: 'html', name: '自訂 HTML', icon: 'code', description: '嵌入自訂 HTML 代碼' }
];

function init() {
    loadFromStorage();
    renderNavItems();
    renderBlocksList();
    renderBlockLibrary();
    renderContent();
    applyGlobalStyles();
}

function loadFromStorage() {
    const savedGlobal = localStorage.getItem('personalBio_global');
    if (savedGlobal) {
        globalSettings = { ...globalSettings, ...JSON.parse(savedGlobal) };
    }
    const savedConfig = localStorage.getItem('personalBio_pageConfig');
    if (savedConfig) {
        pageConfig = { ...pageConfig, ...JSON.parse(savedConfig) };
    }
    const savedAvatar = localStorage.getItem('personalBio_avatar');
    if (savedAvatar) globalSettings.avatarData = savedAvatar;
    const savedBg = localStorage.getItem('personalBio_bg');
    if (savedBg) globalSettings.bgImageData = savedBg;
}

function saveToStorage() {
    const settingsToSave = { ...globalSettings };
    delete settingsToSave.avatarData;
    delete settingsToSave.bgImageData;
    localStorage.setItem('personalBio_global', JSON.stringify(settingsToSave));
    localStorage.setItem('personalBio_pageConfig', JSON.stringify(pageConfig));
    if (globalSettings.avatarData) localStorage.setItem('personalBio_avatar', globalSettings.avatarData);
    if (globalSettings.bgImageData) localStorage.setItem('personalBio_bg', globalSettings.bgImageData);
}

function renderNavItems() {
    const container = document.getElementById('nav-items-container');
    container.innerHTML = pageConfig.navItems.map((item, index) => `
        <div class="nav-item-editor bg-surface-container rounded-lg p-2 flex items-center gap-2 cursor-move" draggable="true" data-nav-id="${item.id}" data-index="${index}">
            <span class="material-symbols-outlined text-on-surface-variant cursor-grab">drag_indicator</span>
            <span class="material-symbols-outlined text-primary">${item.icon}</span>
            <span class="flex-1 text-sm truncate">${item.label}</span>
            <button onclick="editNavItem('${item.id}')" class="material-symbols-outlined text-on-surface-variant hover:text-primary text-lg">edit</button>
            <button onclick="deleteNavItem('${item.id}')" class="material-symbols-outlined text-error hover:text-primary text-lg">delete</button>
        </div>
    `).join('');
    
    initDragDrop(container, 'nav', (fromIndex, toIndex) => {
        const item = pageConfig.navItems.splice(fromIndex, 1)[0];
        pageConfig.navItems.splice(toIndex, 0, item);
        saveToStorage();
        renderNavItems();
    });
}

function renderBlocksList() {
    const container = document.getElementById('blocks-list');
    container.innerHTML = pageConfig.blocks.map((block, index) => `
        <div class="block-item-editor bg-surface-container rounded-lg p-2 flex items-center gap-2 cursor-move ${!block.visible ? 'opacity-50' : ''}" draggable="true" data-block-id="${block.id}" data-index="${index}">
            <span class="material-symbols-outlined text-on-surface-variant cursor-grab">drag_indicator</span>
            <span class="material-symbols-outlined text-primary">${getBlockTypeIcon(block.type)}</span>
            <span class="flex-1 text-sm truncate">${block.title}</span>
            <button onclick="toggleBlockVisibility('${block.id}')" class="material-symbols-outlined text-on-surface-variant hover:text-primary text-lg">${block.visible ? 'visibility' : 'visibility_off'}</button>
            <button onclick="editBlock('${block.id}')" class="material-symbols-outlined text-on-surface-variant hover:text-primary text-lg">edit</button>
            <button onclick="deleteBlock('${block.id}')" class="material-symbols-outlined text-error hover:text-primary text-lg">delete</button>
        </div>
    `).join('');
    
    initDragDrop(container, 'block', (fromIndex, toIndex) => {
        const block = pageConfig.blocks.splice(fromIndex, 1)[0];
        pageConfig.blocks.splice(toIndex, 0, block);
        saveToStorage();
        renderBlocksList();
        renderContent();
    });
}

function initDragDrop(container, type, callback) {
    let draggedItem = null;
    let draggedIndex = null;
    
    container.querySelectorAll('[draggable="true"]').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedItem = item;
            draggedIndex = parseInt(item.dataset.index);
            item.style.opacity = '0.5';
        });
        
        item.addEventListener('dragend', () => {
            item.style.opacity = '';
            draggedItem = null;
            draggedIndex = null;
        });
        
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            item.style.borderTop = '2px solid var(--primary)';
        });
        
        item.addEventListener('dragleave', () => {
            item.style.borderTop = '';
        });
        
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            item.style.borderTop = '';
            const toIndex = parseInt(item.dataset.index);
            if (draggedIndex !== null && draggedIndex !== toIndex) {
                callback(draggedIndex, toIndex);
            }
        });
    });
}

function getBlockTypeIcon(type) {
    const found = blockTypes.find(b => b.type === type);
    return found ? found.icon : 'widget';
}

function renderBlockLibrary() {
    const grid = document.getElementById('block-types-grid');
    grid.innerHTML = blockTypes.map(bt => `
        <div onclick="addBlock('${bt.type}')" class="bg-surface-container rounded-xl p-4 cursor-pointer hover:border-primary border-2 border-transparent transition-colors">
            <span class="material-symbols-outlined text-3xl text-primary mb-2">${bt.icon}</span>
            <h4 class="font-bold">${bt.name}</h4>
            <p class="text-xs text-on-surface-variant">${bt.description}</p>
        </div>
    `).join('');
}

function renderContent() {
    const content = document.getElementById('content-area');
    content.innerHTML = pageConfig.blocks.filter(b => b.visible).map(block => renderBlock(block)).join('');
}

function renderBlock(block) {
    const renderers = {
        profile: renderProfileBlock,
        stats: renderStatsBlock,
        music: renderMusicBlock,
        works: renderWorksBlock,
        social: renderSocialBlock,
        text: renderTextBlock,
        image: renderImageBlock,
        links: renderLinksBlock,
        divider: renderDividerBlock,
        html: renderHtmlBlock
    };
    return renderers[block.type] ? renderers[block.type](block) : '';
}

function renderProfileBlock(block) {
    const avatarSrc = globalSettings.avatarData || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop';
    const skillsHtml = globalSettings.skills.map(s => `<span class="bg-surface-container px-4 py-1 rounded-full text-sm">${s}</span>`).join('');
    
    return `
        <section id="${block.id}" class="parchment-card rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative group">
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="editBlock('${block.id}')" class="material-symbols-outlined text-on-surface-variant hover:text-primary">edit</button>
            </div>
            <div class="relative">
                <div class="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl rotate-3 transition-transform hover:rotate-0">
                    <img alt="Profile" class="w-full h-full object-cover" src="${avatarSrc}"/>
                </div>
            </div>
            <div class="flex-1 text-center md:text-left pt-4">
                <span class="text-xs uppercase tracking-widest mb-2 block text-outline">Personal Profile</span>
                <h2 class="text-4xl md:text-5xl font-bold mb-4 leading-none">${globalSettings.name}</h2>
                <p class="text-lg text-on-surface-variant max-w-2xl">${globalSettings.bio}</p>
                <div class="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">${skillsHtml}</div>
            </div>
        </section>
    `;
}

function renderStatsBlock(block) {
    return `
        <section id="${block.id}" class="grid grid-cols-3 gap-4 md:gap-8 relative group">
            <div class="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onclick="editBlock('${block.id}')" class="material-symbols-outlined text-on-surface-variant hover:text-primary bg-surface-container rounded">edit</button>
            </div>
            <div class="parchment-card rounded-xl p-4 md:p-6 flex flex-col items-center text-center">
                <span class="material-symbols-outlined text-outline mb-2 text-2xl">auto_stories</span>
                <span class="text-2xl md:text-4xl font-bold">${globalSettings.projects}</span>
                <span class="text-xs uppercase tracking-wider text-on-surface-variant">Projects</span>
            </div>
            <div class="parchment-card rounded-xl p-4 md:p-6 flex flex-col items-center text-center">
                <span class="material-symbols-outlined text-outline mb-2 text-2xl">schedule</span>
                <span class="text-2xl md:text-4xl font-bold">${globalSettings.years}</span>
                <span class="text-xs uppercase tracking-wider text-on-surface-variant">Years Exp</span>
            </div>
            <div class="parchment-card rounded-xl p-4 md:p-6 flex flex-col items-center text-center">
                <span class="material-symbols-outlined text-outline mb-2 text-2xl">groups</span>
                <span class="text-2xl md:text-4xl font-bold">${globalSettings.connections}</span>
                <span class="text-xs uppercase tracking-wider text-on-surface-variant">Connections</span>
            </div>
        </section>
    `;
}

function renderMusicBlock(block) {
    return `
        <section id="${block.id}" class="parchment-card rounded-xl overflow-hidden relative group">
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onclick="editBlock('${block.id}')" class="material-symbols-outlined text-on-surface-variant hover:text-primary bg-surface-container rounded">edit</button>
            </div>
            <div class="h-32 bg-primary-container relative">
                <div class="absolute inset-0 opacity-20 flex items-center justify-center">
                    <span class="material-symbols-outlined text-8xl">album</span>
                </div>
                <img alt="Album" class="w-full h-full object-cover opacity-60" src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=200&fit=crop"/>
            </div>
            <div class="p-6">
                <h4 class="font-bold text-lg truncate">Song Title</h4>
                <p class="text-sm text-on-surface-variant">Artist Name • Album Name</p>
                <div class="mt-4 flex items-center justify-center space-x-6">
                    <button class="material-symbols-outlined hover:scale-110 transition-transform">skip_previous</button>
                    <button class="w-12 h-12 rounded-full bg-primary text-on-secondary flex items-center justify-center hover:scale-105 transition-transform">
                        <span class="material-symbols-outlined">play_arrow</span>
                    </button>
                    <button class="material-symbols-outlined hover:scale-110 transition-transform">skip_next</button>
                </div>
            </div>
        </section>
    `;
}

function renderWorksBlock(block) {
    const projects = block.projects || [
        { name: 'Project 1', desc: 'Project description', date: '2024', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop', link: '' },
        { name: 'Project 2', desc: 'Project description', date: '2024', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop', link: '' }
    ];
    
    return `
        <section id="${block.id}" class="space-y-6 relative group">
            <div class="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onclick="editBlock('${block.id}')" class="material-symbols-outlined text-on-surface-variant hover:text-primary bg-surface-container rounded">edit</button>
            </div>
            <div class="flex items-center justify-between">
                <h3 class="text-2xl font-bold">${block.title}</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${projects.map(p => `
                    <div class="parchment-card rounded-xl overflow-hidden hover:border-primary transition-colors cursor-pointer group/card">
                        <div class="h-40 bg-surface-container-high relative overflow-hidden">
                            <img alt="${p.name}" class="w-full h-full object-cover grayscale group-hover/card:grayscale-0 transition-all duration-500" src="${p.image}"/>
                        </div>
                        <div class="p-4">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-bold">${p.name}</h4>
                                <span class="text-xs text-outline">${p.date}</span>
                            </div>
                            <p class="text-sm text-on-surface-variant line-clamp-2">${p.desc}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

function renderSocialBlock(block) {
    const socials = [
        { name: 'GitHub', icon: 'code', url: globalSettings.github },
        { name: 'LinkedIn', icon: 'work', url: globalSettings.linkedin },
        { name: 'Email', icon: 'mail', url: globalSettings.email ? `mailto:${globalSettings.email}` : '' },
        { name: 'Portfolio', icon: 'brush', url: globalSettings.portfolio },
        { name: 'Twitter', icon: 'chat', url: globalSettings.twitter }
    ].filter(s => s.url);
    
    return `
        <section id="${block.id}" class="parchment-card rounded-xl p-6 md:p-8 relative group">
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="editBlock('${block.id}')" class="material-symbols-outlined text-on-surface-variant hover:text-primary">edit</button>
            </div>
            <h3 class="text-lg font-bold mb-6">${block.title}</h3>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                ${socials.map(s => `
                    <a href="${s.url || '#'}" target="_blank" class="flex flex-col items-center space-y-2 group/link cursor-pointer">
                        <div class="w-16 h-16 rounded-full border-2 border-transparent group-hover/link:border-primary transition-all p-1 bg-surface-container">
                            <span class="material-symbols-outlined w-full h-full flex items-center justify-center text-3xl text-primary">${s.icon}</span>
                        </div>
                        <span class="text-xs text-on-surface-variant">${s.name}</span>
                    </a>
                `).join('')}
            </div>
        </section>
    `;
}

function renderTextBlock(block) {
    return `
        <section id="${block.id}" class="parchment-card rounded-xl p-6 relative group">
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="editBlock('${block.id}')" class="material-symbols-outlined text-on-surface-variant hover:text-primary">edit</button>
            </div>
            <div class="prose max-w-none">${block.content || '<p class="text-on-surface-variant">點擊編輯輸入文字內容...</p>'}</div>
        </section>
    `;
}

function renderImageBlock(block) {
    return `
        <section id="${block.id}" class="parchment-card rounded-xl overflow-hidden relative group">
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onclick="editBlock('${block.id}')" class="material-symbols-outlined text-on-surface-variant hover:text-primary bg-surface-container rounded">edit</button>
            </div>
            <img src="${block.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'}" alt="${block.alt || ''}" class="w-full h-auto"/>
        </section>
    `;
}

function renderLinksBlock(block) {
    const links = block.links || [{ label: 'Link 1', url: '#', icon: 'link' }];
    return `
        <section id="${block.id}" class="space-y-3 relative group">
            <div class="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="editBlock('${block.id}')" class="material-symbols-outlined text-on-surface-variant hover:text-primary bg-surface-container rounded">edit</button>
            </div>
            ${links.map(l => `
                <a href="${l.url}" target="_blank" class="parchment-card rounded-xl p-4 flex items-center gap-4 hover:border-primary transition-colors">
                    <span class="material-symbols-outlined text-primary">${l.icon || 'link'}</span>
                    <span class="flex-1">${l.label}</span>
                    <span class="material-symbols-outlined text-outline">arrow_forward</span>
                </a>
            `).join('')}
        </section>
    `;
}

function renderDividerBlock(block) {
    return `
        <section id="${block.id}" class="py-4 relative group">
            <div class="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="editBlock('${block.id}')" class="material-symbols-outlined text-on-surface-variant hover:text-primary bg-surface-container rounded">edit</button>
            </div>
            <div class="flex items-center gap-4">
                <div class="h-px flex-1 bg-outline-variant"></div>
                <span class="material-symbols-outlined text-outline">${block.icon || 'star'}</span>
                <div class="h-px flex-1 bg-outline-variant"></div>
            </div>
        </section>
    `;
}

function renderHtmlBlock(block) {
    return `
        <section id="${block.id}" class="relative group">
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onclick="editBlock('${block.id}')" class="material-symbols-outlined text-on-surface-variant hover:text-primary bg-surface-container rounded">edit</button>
            </div>
            ${block.html || '<div class="parchment-card rounded-xl p-6 text-on-surface-variant">點擊編輯輸入 HTML 代碼...</div>'}
        </section>
    `;
}

function openBlockLibrary() {
    document.getElementById('block-library-modal').classList.remove('hidden');
}

function closeBlockLibrary() {
    document.getElementById('block-library-modal').classList.add('hidden');
}

function addBlock(type) {
    const id = `block-${Date.now()}`;
    const bt = blockTypes.find(b => b.type === type);
    const newBlock = {
        id,
        type,
        title: bt ? bt.name : 'New Block',
        visible: true
    };
    
    if (type === 'works') {
        newBlock.projects = [
            { name: 'Project Name', desc: 'Description', date: '2024', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop', link: '' }
        ];
    }
    if (type === 'links') {
        newBlock.links = [{ label: 'Link Name', url: '#', icon: 'link' }];
    }
    if (type === 'text') {
        newBlock.content = '<p>Enter your text here...</p>';
    }
    if (type === 'image') {
        newBlock.imageUrl = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800';
    }
    if (type === 'divider') {
        newBlock.icon = 'star';
    }
    if (type === 'html') {
        newBlock.html = '<div class="parchment-card rounded-xl p-6">Custom HTML</div>';
    }
    
    pageConfig.blocks.push(newBlock);
    saveToStorage();
    renderBlocksList();
    renderContent();
    closeBlockLibrary();
}

function editBlock(blockId) {
    const block = pageConfig.blocks.find(b => b.id === blockId);
    if (!block) return;
    
    currentEditingBlock = block;
    const content = document.getElementById('block-settings-content');
    
    let settingsHtml = `
        <div class="space-y-4">
            <div>
                <label class="text-sm text-on-surface-variant block mb-1">區塊標題</label>
                <input type="text" id="block-title" value="${block.title}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none">
            </div>
    `;
    
    if (block.type === 'works') {
        settingsHtml += `
            <div>
                <label class="text-sm text-on-surface-variant block mb-2">專案列表</label>
                <div id="projects-editor" class="space-y-3">
                    ${(block.projects || []).map((p, i) => `
                        <div class="bg-surface-container p-3 rounded-lg space-y-2" data-project-index="${i}">
                            <input type="text" value="${p.name}" placeholder="專案名稱" class="project-name w-full px-2 py-1 rounded border border-outline-variant bg-surface-container-lowest text-sm">
                            <input type="text" value="${p.desc}" placeholder="專案描述" class="project-desc w-full px-2 py-1 rounded border border-outline-variant bg-surface-container-lowest text-sm">
                            <input type="text" value="${p.date}" placeholder="日期" class="project-date w-full px-2 py-1 rounded border border-outline-variant bg-surface-container-lowest text-sm">
                            <input type="url" value="${p.image}" placeholder="圖片 URL" class="project-image w-full px-2 py-1 rounded border border-outline-variant bg-surface-container-lowest text-sm">
                            <input type="url" value="${p.link || ''}" placeholder="連結（選填）" class="project-link w-full px-2 py-1 rounded border border-outline-variant bg-surface-container-lowest text-sm">
                        </div>
                    `).join('')}
                </div>
                <button onclick="addProjectToBlock()" class="mt-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded text-sm">+ 新增專案</button>
            </div>
        `;
    }
    
    if (block.type === 'links') {
        settingsHtml += `
            <div>
                <label class="text-sm text-on-surface-variant block mb-2">連結列表</label>
                <div id="links-editor" class="space-y-2">
                    ${(block.links || []).map((l, i) => `
                        <div class="flex gap-2 items-center" data-link-index="${i}">
                            <input type="text" value="${l.label}" placeholder="名稱" class="link-label flex-1 px-2 py-1 rounded border border-outline-variant bg-surface-container-lowest text-sm">
                            <input type="url" value="${l.url}" placeholder="URL" class="link-url flex-1 px-2 py-1 rounded border border-outline-variant bg-surface-container-lowest text-sm">
                            <select class="link-icon px-2 py-1 rounded border border-outline-variant bg-surface-container-lowest text-sm">
                                <option value="link" ${l.icon === 'link' ? 'selected' : ''}>link</option>
                                <option value="open_in_new" ${l.icon === 'open_in_new' ? 'selected' : ''}>open_in_new</option>
                                <option value="download" ${l.icon === 'download' ? 'selected' : ''}>download</option>
                            </select>
                        </div>
                    `).join('')}
                </div>
                <button onclick="addLinkToBlock()" class="mt-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded text-sm">+ 新增連結</button>
            </div>
        `;
    }
    
    if (block.type === 'text') {
        settingsHtml += `
            <div>
                <label class="text-sm text-on-surface-variant block mb-1">文字內容（支援 HTML）</label>
                <textarea id="block-text-content" rows="6" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none resize-none">${block.content || ''}</textarea>
            </div>
        `;
    }
    
    if (block.type === 'image') {
        settingsHtml += `
            <div>
                <label class="text-sm text-on-surface-variant block mb-1">圖片 URL</label>
                <input type="url" id="block-image-url" value="${block.imageUrl || ''}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none">
            </div>
            <div>
                <label class="text-sm text-on-surface-variant block mb-1">替代文字</label>
                <input type="text" id="block-image-alt" value="${block.alt || ''}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none">
            </div>
        `;
    }
    
    if (block.type === 'divider') {
        settingsHtml += `
            <div>
                <label class="text-sm text-on-surface-variant block mb-1">中間圖示</label>
                <input type="text" id="block-divider-icon" value="${block.icon || 'star'}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none" placeholder="star, favorite, etc.">
            </div>
        `;
    }
    
    if (block.type === 'html') {
        settingsHtml += `
            <div>
                <label class="text-sm text-on-surface-variant block mb-1">HTML 代碼</label>
                <textarea id="block-html-content" rows="10" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none resize-none font-mono text-sm">${block.html || ''}</textarea>
            </div>
        `;
    }
    
    settingsHtml += '</div>';
    content.innerHTML = settingsHtml;
    document.getElementById('block-settings-modal').classList.remove('hidden');
}

function closeBlockSettings() {
    document.getElementById('block-settings-modal').classList.add('hidden');
    currentEditingBlock = null;
}

function saveBlockSettings() {
    if (!currentEditingBlock) return;
    
    currentEditingBlock.title = document.getElementById('block-title').value;
    
    if (currentEditingBlock.type === 'works') {
        const projectDivs = document.querySelectorAll('#projects-editor > div');
        currentEditingBlock.projects = Array.from(projectDivs).map(div => ({
            name: div.querySelector('.project-name').value,
            desc: div.querySelector('.project-desc').value,
            date: div.querySelector('.project-date').value,
            image: div.querySelector('.project-image').value,
            link: div.querySelector('.project-link').value
        }));
    }
    
    if (currentEditingBlock.type === 'links') {
        const linkDivs = document.querySelectorAll('#links-editor > div');
        currentEditingBlock.links = Array.from(linkDivs).map(div => ({
            label: div.querySelector('.link-label').value,
            url: div.querySelector('.link-url').value,
            icon: div.querySelector('.link-icon').value
        }));
    }
    
    if (currentEditingBlock.type === 'text') {
        currentEditingBlock.content = document.getElementById('block-text-content').value;
    }
    
    if (currentEditingBlock.type === 'image') {
        currentEditingBlock.imageUrl = document.getElementById('block-image-url').value;
        currentEditingBlock.alt = document.getElementById('block-image-alt').value;
    }
    
    if (currentEditingBlock.type === 'divider') {
        currentEditingBlock.icon = document.getElementById('block-divider-icon').value;
    }
    
    if (currentEditingBlock.type === 'html') {
        currentEditingBlock.html = document.getElementById('block-html-content').value;
    }
    
    saveToStorage();
    renderBlocksList();
    renderContent();
    closeBlockSettings();
}

function addProjectToBlock() {
    if (!currentEditingBlock) return;
    if (!currentEditingBlock.projects) currentEditingBlock.projects = [];
    currentEditingBlock.projects.push({ name: '', desc: '', date: '', image: '', link: '' });
    editBlock(currentEditingBlock.id);
}

function addLinkToBlock() {
    if (!currentEditingBlock) return;
    if (!currentEditingBlock.links) currentEditingBlock.links = [];
    currentEditingBlock.links.push({ label: '', url: '', icon: 'link' });
    editBlock(currentEditingBlock.id);
}

function deleteBlock(blockId) {
    if (!confirm('確定要刪除此區塊？')) return;
    pageConfig.blocks = pageConfig.blocks.filter(b => b.id !== blockId);
    saveToStorage();
    renderBlocksList();
    renderContent();
}

function toggleBlockVisibility(blockId) {
    const block = pageConfig.blocks.find(b => b.id === blockId);
    if (block) {
        block.visible = !block.visible;
        saveToStorage();
        renderBlocksList();
        renderContent();
    }
}

function addNavItem() {
    const id = `nav-${Date.now()}`;
    pageConfig.navItems.push({
        id,
        label: 'New Item',
        icon: 'radio_button_checked',
        targetBlock: '',
        isNewTab: false
    });
    saveToStorage();
    renderNavItems();
}

function editNavItem(navId) {
    const item = pageConfig.navItems.find(n => n.id === navId);
    if (!item) return;
    
    const newLabel = prompt('導航名稱:', item.label);
    if (newLabel !== null) {
        item.label = newLabel;
    }
    
    const newIcon = prompt('圖示名稱（Material Symbols）:', item.icon);
    if (newIcon !== null) {
        item.icon = newIcon;
    }
    
    const blocks = pageConfig.blocks.map(b => b.id).join(',');
    const newTarget = prompt(`目標區塊 ID:\n可用區塊: ${blocks}`, item.targetBlock);
    if (newTarget !== null) {
        item.targetBlock = newTarget;
    }
    
    item.isNewTab = confirm('是否在新分頁開啟？');
    
    saveToStorage();
    renderNavItems();
}

function deleteNavItem(navId) {
    if (!confirm('確定要刪除此導航項？')) return;
    pageConfig.navItems = pageConfig.navItems.filter(n => n.id !== navId);
    saveToStorage();
    renderNavItems();
}

function openSettingsModal() {
    document.getElementById('global-name').value = globalSettings.name;
    document.getElementById('global-title').value = globalSettings.title;
    document.getElementById('global-bio').value = globalSettings.bio;
    document.getElementById('global-skills').value = globalSettings.skills.join(', ');
    document.getElementById('global-projects').value = globalSettings.projects;
    document.getElementById('global-years').value = globalSettings.years;
    document.getElementById('global-connections').value = globalSettings.connections;
    document.getElementById('global-heading-font').value = globalSettings.headingFont;
    document.getElementById('global-body-font').value = globalSettings.bodyFont;
    document.getElementById('global-primary-color').value = globalSettings.primaryColor;
    document.getElementById('global-bg-color').value = globalSettings.bgColor;
    document.getElementById('global-card-color').value = globalSettings.cardColor;
    document.getElementById('global-github').value = globalSettings.github;
    document.getElementById('global-linkedin').value = globalSettings.linkedin;
    document.getElementById('global-email').value = globalSettings.email;
    document.getElementById('global-portfolio').value = globalSettings.portfolio;
    document.getElementById('global-twitter').value = globalSettings.twitter;
    
    if (globalSettings.avatarData) {
        document.getElementById('global-avatar-preview').innerHTML = `<img src="${globalSettings.avatarData}" class="w-full h-full object-cover">`;
    }
    if (globalSettings.bgImageData) {
        document.getElementById('global-bg-preview').innerHTML = `<img src="${globalSettings.bgImageData}" class="w-full h-full object-cover">`;
    }
    
    document.getElementById('settings-modal').classList.remove('hidden');
}

function closeSettingsModal() {
    document.getElementById('settings-modal').classList.add('hidden');
}

function saveGlobalSettings() {
    globalSettings.name = document.getElementById('global-name').value;
    globalSettings.title = document.getElementById('global-title').value;
    globalSettings.bio = document.getElementById('global-bio').value;
    globalSettings.skills = document.getElementById('global-skills').value.split(',').map(s => s.trim()).filter(s => s);
    globalSettings.projects = document.getElementById('global-projects').value;
    globalSettings.years = document.getElementById('global-years').value;
    globalSettings.connections = document.getElementById('global-connections').value;
    globalSettings.headingFont = document.getElementById('global-heading-font').value;
    globalSettings.bodyFont = document.getElementById('global-body-font').value;
    globalSettings.primaryColor = document.getElementById('global-primary-color').value;
    globalSettings.bgColor = document.getElementById('global-bg-color').value;
    globalSettings.cardColor = document.getElementById('global-card-color').value;
    globalSettings.github = document.getElementById('global-github').value;
    globalSettings.linkedin = document.getElementById('global-linkedin').value;
    globalSettings.email = document.getElementById('global-email').value;
    globalSettings.portfolio = document.getElementById('global-portfolio').value;
    globalSettings.twitter = document.getElementById('global-twitter').value;
    
    applyGlobalStyles();
    saveToStorage();
    renderContent();
    closeSettingsModal();
}

function previewGlobalImage(input, type) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewId = type === 'avatar' ? 'global-avatar-preview' : 'global-bg-preview';
            document.getElementById(previewId).innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`;
            if (type === 'avatar') {
                globalSettings.avatarData = e.target.result;
            } else {
                globalSettings.bgImageData = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
}

function applyGlobalStyles() {
    document.documentElement.style.setProperty('--primary', globalSettings.primaryColor);
    document.body.style.backgroundColor = globalSettings.bgColor;
    
    if (globalSettings.bgImageData) {
        document.body.style.backgroundImage = `url('${globalSettings.bgImageData}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
    }
    
    const style = document.createElement('style');
    style.id = 'dynamic-styles';
    document.getElementById('dynamic-styles')?.remove();
    style.textContent = `
        .parchment-card { background-color: ${globalSettings.cardColor}bf !important; }
        h1, h2, h3, h4, h5, h6, .font-bold { font-family: '${globalSettings.headingFont}', serif !important; }
        body, p, span, div { font-family: '${globalSettings.bodyFont}', sans-serif !important; }
    `;
    document.head.appendChild(style);
}

function togglePreview() {
    const toolbar = document.getElementById('editor-toolbar');
    const sidebar = document.getElementById('sidebar-editor');
    const main = document.getElementById('page-content');
    const toggleText = document.getElementById('preview-toggle-text');
    
    if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden');
        main.classList.add('ml-64');
        main.classList.remove('ml-0');
        toolbar.classList.remove('hidden');
        toggleText.textContent = '預覽';
    } else {
        sidebar.classList.add('hidden');
        main.classList.remove('ml-64');
        main.classList.add('ml-0');
        toolbar.classList.add('hidden');
        toggleText.textContent = '編輯';
    }
}

async function exportPackage() {
    saveToStorage();
    
    const html = generateExportHTML();
    const css = generateExportCSS();
    const js = generateExportJS();
    
    const zip = new JSZip();
    zip.file('index.html', html);
    zip.file('styles.css', css);
    zip.file('script.js', js);
    
    zip.file('README.md', `# ${globalSettings.name} - Personal Bio

## 上傳到 GitHub Pages

1. 建立新倉庫 (yourname.github.io)
2. 上傳所有檔案
3. Settings > Pages > Source: main
4. 完成！

Made with Personal Bio Editor`);
    
    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'personal-bio.zip';
    link.click();
}

function generateExportHTML() {
    const navHtml = pageConfig.navItems.map(item => `
        <a href="#${item.targetBlock}" ${item.isNewTab ? 'target="_blank"' : ''} class="flex items-center space-x-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg">
            <span class="material-symbols-outlined">${item.icon}</span>
            <span>${item.label}</span>
        </a>
    `).join('');
    
    const blocksHtml = pageConfig.blocks.filter(b => b.visible).map(block => renderBlock(block)).join('\n');
    
    return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${globalSettings.name} | Personal Bio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=${globalSettings.headingFont.replace(' ', '+')}:wght@400;600;700&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <link href="styles.css" rel="stylesheet"/>
</head>
<body>
    <div class="grain-overlay"></div>
    
    <nav class="fixed left-0 top-0 flex flex-col p-6 space-y-4 h-screen w-64 border-r border-outline-variant bg-surface-container-low/80 backdrop-blur-md z-40 hidden md:flex">
        <div class="flex items-center space-x-3 mb-8">
            <div class="w-12 h-12 rounded-full bg-secondary-container overflow-hidden border border-outline-variant">
                <img alt="Avatar" class="w-full h-full object-cover" src="${globalSettings.avatarData || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'}"/>
            </div>
            <div>
                <h2 class="font-bold">${globalSettings.name}</h2>
                <p class="text-sm text-on-surface-variant">${globalSettings.title}</p>
            </div>
        </div>
        <div class="space-y-1">${navHtml}</div>
    </nav>
    
    <main class="md:ml-64 min-h-screen">
        <div class="max-w-4xl mx-auto px-8 py-8 space-y-8">
            ${blocksHtml}
        </div>
    </main>
    
    <script src="script.js"></script>
</body>
</html>`;
}

function generateExportCSS() {
    return `body {
    ${globalSettings.bgImageData ? `background-image: url('background.png');` : `background-image: url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80');`}
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-color: ${globalSettings.bgColor};
}

.grain-overlay {
    position: fixed; inset: 0; pointer-events: none; z-index: 50; opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.parchment-card {
    background-color: ${globalSettings.cardColor}bf;
    backdrop-filter: blur(8px);
    border: 1px solid #E8E2D6;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
h1, h2, h3, h4, h5, h6 { font-family: '${globalSettings.headingFont}', serif; }
body, p, span, div { font-family: '${globalSettings.bodyFont}', sans-serif; }`;
}

function generateExportJS() {
    return `document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});`;
}

window.addNavItem = addNavItem;
window.editNavItem = editNavItem;
window.deleteNavItem = deleteNavItem;
window.openBlockLibrary = openBlockLibrary;
window.closeBlockLibrary = closeBlockLibrary;
window.addBlock = addBlock;
window.editBlock = editBlock;
window.closeBlockSettings = closeBlockSettings;
window.saveBlockSettings = saveBlockSettings;
window.addProjectToBlock = addProjectToBlock;
window.addLinkToBlock = addLinkToBlock;
window.deleteBlock = deleteBlock;
window.toggleBlockVisibility = toggleBlockVisibility;
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
window.saveGlobalSettings = saveGlobalSettings;
window.previewGlobalImage = previewGlobalImage;
window.togglePreview = togglePreview;
window.exportPackage = exportPackage;
window.initDragDrop = initDragDrop;

window.addEventListener('DOMContentLoaded', init);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
}
