// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Initialize circle mask
const circleMask = document.querySelector('.circle-mask');
const heroSection = document.querySelector('.hero');


function initCirclePosition() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Generate random position but avoid too close to edges
    const circleX = Math.max(100, Math.min(viewportWidth - 100, Math.random() * viewportWidth));
    const circleY = Math.max(100, Math.min(viewportHeight - 100, Math.random() * viewportHeight));
    
    circleMask.style.left = `${circleX}px`;
    circleMask.style.top = `${circleY}px`;
    
    // Calculate maximum radius (ensure it can cover the entire screen)
    const topLeft = Math.sqrt(circleX * circleX + circleY * circleY);
    const topRight = Math.sqrt((viewportWidth - circleX) * (viewportWidth - circleX) + circleY * circleY);
    const bottomLeft = Math.sqrt(circleX * circleX + (viewportHeight - circleY) * (viewportHeight - circleY));
    const bottomRight = Math.sqrt((viewportWidth - circleX) * (viewportWidth - circleX) + (viewportHeight - circleY) * (viewportHeight - circleY));
    
    const maxRadius = Math.max(topLeft, topRight, bottomLeft, bottomRight) * 1.1;
    
    circleMask.style.width = `${maxRadius * 2}px`;
    circleMask.style.height = `${maxRadius * 2}px`;
    circleMask.style.marginLeft = `-${maxRadius}px`;
    circleMask.style.marginTop = `-${maxRadius}px`;
    
    return maxRadius;
}

// Initialize circle mask position
initCirclePosition();

// Handle window resize
window.addEventListener('resize', function() {
    initCirclePosition();
});

// Handle scroll event
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    // 計算圓形遮罩的縮放和透明度
    const scrollPercentage = Math.min(scrollTop / windowHeight, 1);
    const opacity = 1 - Math.min((scrollTop - windowHeight) / windowHeight, 1);
    
    circleMask.style.transform = `scale(${scrollPercentage})`;
    circleMask.style.opacity = `${opacity}`;
    
    // 顯示/隱藏遮罩
    if (scrollPercentage > 0.1) {
        circleMask.classList.add('active');
    } else {
        circleMask.classList.remove('active');
    }
    
    // 處理 hero 區域的可見性
    if (scrollPercentage >= 1) {
        heroSection.style.visibility = 'hidden';
        heroSection.style.position = 'absolute';
        heroSection.style.top = `${windowHeight}px`;
    } else {
        heroSection.style.visibility = 'visible';
        heroSection.style.position = 'fixed';
        heroSection.style.top = '0';
    }
    
    // 確保所有區塊都可見
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.visibility = 'visible';
    });
    
    lastScrollTop = scrollTop;
});



// Smooth scroll for navbar links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        // 先解除所有 ScrollTrigger 的 pin
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.vars.pin) {
                trigger.kill();
            }
        });

        // 滾動到目標位置
        gsap.to(window, {
            duration: 1,
            scrollTo: {
                y: target,
                offsetY: -navbarHeight
            },
            ease: "power2.inOut",
            onComplete: () => {
                // 重新創建 recent-updates 的 ScrollTrigger
                if (target.id === 'recent') {
                    createRecentUpdatesScrollTrigger();
                }
                // 關閉手機版導航菜單
                const navLinks = document.querySelector('.nav-links');
                if (navLinks) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
});

// Mobile menu toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
});

// Recent Updates Section Animation
const recentUpdates = [
    {
        title: "龜龜日記01 - 黏黏怪",
        description: "問題來，就來扛！",
        image: "/TurtleJournal/assets/01/guegue03.png",
        link: "https://store.line.me/stickershop/showcase/top/zh-Hant"
    },
    {
        title: "龜龜日記01 - 黏黏怪",
        description: "嘎你抱緊緊！",
        image: "/TurtleJournal/assets/01/guegue01.png",
        link: "https://store.line.me/stickershop/showcase/top/zh-Hant"
    },
    {
        title: "龜龜日記01 - 黏黏怪",
        description: "爸爸買給你！",
        image: "/TurtleJournal/assets/01/guegue04.png",
        link: "https://store.line.me/stickershop/showcase/top/zh-Hant"
    },
    {
        title: "龜龜日記01 - 黏黏怪",
        description: "球球尼～",
        image: "/TurtleJournal/assets/01/guegue10.png",
        link: "https://store.line.me/stickershop/showcase/top/zh-Hant"
    },
    {
        title: "龜龜日記01 - 黏黏怪",
        description: "巴豆夭！",
        image: "/TurtleJournal/assets/01/guegue11.png",
        link: "https://store.line.me/stickershop/showcase/top/zh-Hant"
    }
];

// Create content for each update
const updatesContainer = document.querySelector('.updates-container');
updatesContainer.innerHTML = ''; // Clear existing content

function createRecentUpdatesScrollTrigger() {
    // Calculate the total height needed for all updates
    console.log('recentUpdates.length', recentUpdates.length)
    console.log('window.innerHeight', window.innerHeight)
    const totalHeight = recentUpdates.length * window.innerHeight;
    
    // Create ScrollTrigger for the section
    ScrollTrigger.create({
        trigger: ".recent-updates",
        start: "top top",
        end: `+=${totalHeight}`,
        pin: true,
        scrub: 1,
        markers: false
    });

    recentUpdates.forEach((update, index) => {
        const updateContent = document.createElement('div');
        updateContent.className = 'updates-content';
        updateContent.innerHTML = `
            <div class="updates-text">
                <h2 class="update-title">${update.title}</h2>
                <p class="update-description">${update.description}</p>
                <button class="button" type="button" onclick="window.open('${update.link}', '_blank');">購買</button>
            </div>
            <div class="updates-image">
                <img src="${update.image}" alt="${update.title}">
            </div>
        `;
        updatesContainer.appendChild(updateContent);

        // Create ScrollTrigger for each update
        ScrollTrigger.create({
            trigger: updateContent,
            start: () => `top+=${index * 250}% top`,
            end: () => `top+=${(index + 1) * 250}% top`,
            onEnter: () => {
                gsap.to(updateContent, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            },
            onLeave: () => {
                gsap.to(updateContent, {
                    opacity: 0,
                    y: -100,
                    duration: 0.5,
                    ease: "power2.in"
                });
            },
            onEnterBack: () => {
                gsap.to(updateContent, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            },
            onLeaveBack: () => {
                gsap.to(updateContent, {
                    opacity: 0,
                    y: 100,
                    duration: 0.5,
                    ease: "power2.in"
                });
            }
        });
    });
}

// Initial creation of recent updates scroll trigger
createRecentUpdatesScrollTrigger();

// All Stickers Section
const stickers = [{
    id: 1,
    title: `龜龜日記01 - 黏黏怪`,
    image: `/TurtleJournal/assets/01/guegue05.png`,
    link: "https://store.line.me/stickershop/showcase/top/zh-Hant"
}]

const stickersPerPage = 10;
let currentPage = 1;
const stickersGrid = document.querySelector('.stickers-grid');
const pageNumbers = document.querySelector('.page-numbers');

function renderStickers() {
    stickersGrid.innerHTML = '';
    const start = (currentPage - 1) * stickersPerPage;
    const end = start + stickersPerPage;
    
    stickers.slice(start, end).forEach(sticker => {
        const stickerElement = document.createElement('div');
        stickerElement.className = 'sticker-item';
        stickerElement.innerHTML = `
            <img src="${sticker.image}" alt="${sticker.title}">
            <h3>${sticker.title}</h3>
            <button class="buy-button" onclick="window.open('${sticker.link}', '_blank')">購買</button>
        `;
        stickersGrid.appendChild(stickerElement);
    });

    pageNumbers.textContent = `${currentPage} / ${Math.ceil(stickers.length / stickersPerPage)}`;
}

// Pagination buttons
document.querySelector('.prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderStickers();
    }
});

document.querySelector('.next-page').addEventListener('click', () => {
    if (currentPage < Math.ceil(stickers.length / stickersPerPage)) {
        currentPage++;
        renderStickers();
    }
});

// Initial render
renderStickers();

// Hero section animation
gsap.from(".hero h1", {
    duration: 1,
    y: -50,
    opacity: 0,
    ease: "power2.out"
});

gsap.from(".hero p", {
    duration: 1,
    y: 50,
    opacity: 0,
    delay: 0.5,
    ease: "power2.out"
});

gsap.from(".hero-image", {
    duration: 1,
    scale: 0.5,
    opacity: 0,
    delay: 1,
    ease: "back.out(1.7)"
}); 