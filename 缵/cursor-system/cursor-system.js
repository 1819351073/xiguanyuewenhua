// 锁定指针系统
(function() {
    console.log('Cursor system initializing...');

    // 创建音效对象
    const clickSound = new Audio('cursor-system/click.mp3');
    
    // 冻结配置对象
    const CURSOR_CONFIG = Object.freeze({
        emojis: ['✨', '💫', '⭐', '🌟', '💥'],
        zIndex: {
            cursor: 99999,
            particles: 99998,
            ripple: 99997
        }
    });

    class EmojiEffect {
        constructor() {
            console.log('Creating cursor element...');
            
            this.emojis = CURSOR_CONFIG.emojis;
            this.particles = [];
            this.mouse = { x: 0, y: 0 };
            
            // 创建自定义指针
            this.cursor = document.createElement('div');
            this.cursor.className = 'custom-cursor';
            this.cursor.style.visibility = 'visible';
            this.cursor.style.display = 'block';
            document.body.appendChild(this.cursor);
            
            console.log('Cursor element created:', this.cursor);
            
            this.isClicking = false;
            this.raf = null;
            this.cursorPos = { x: 0, y: 0 };
            
            this.init();
            this.setupClickHandling();
            
            // 添加基础样式
            const style = document.createElement('style');
            style.textContent = `
                .emoji-particle {
                    position: fixed;
                    pointer-events: none !important;
                    z-index: ${CURSOR_CONFIG.zIndex.particles};
                    font-size: 20px;
                    transform: translate(-50%, -50%);
                    will-change: transform, opacity;
                    user-select: none;
                    display: block;
                }
            `;
            document.head.appendChild(style);
        }

        init() {
            const updateCursor = (e) => {
                this.cursorPos.x = e.clientX;
                this.cursorPos.y = e.clientY;
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                
                this.cursor.style.transform = `translate(${this.cursorPos.x}px, ${this.cursorPos.y}px) translate(-50%, -50%)`;
                
                if (this.isClicking) {
                    this.createParticle();
                    this.createParticle();
                } else {
                    this.createParticle();
                }
            };

            document.addEventListener('mousemove', updateCursor, { passive: true });

            document.addEventListener('mouseleave', () => {
                this.cursor.style.visibility = 'hidden';
            });

            document.addEventListener('mouseenter', () => {
                this.cursor.style.visibility = 'visible';
            });

            document.addEventListener('mousedown', (e) => {
                this.cursor.classList.add('clicking');
                this.createRipple(e.clientX, e.clientY);
                this.isClicking = true;
            });

            document.addEventListener('mouseup', () => {
                this.cursor.classList.remove('clicking');
                this.isClicking = false;
            });

            document.addEventListener('mousemove', (e) => {
                const elements = document.elementsFromPoint(e.clientX, e.clientY);
                const isOverClickable = elements.some(el => 
                    el.matches('a, button, .clickable')
                );
                
                if (isOverClickable) {
                    this.cursor.classList.add('hover');
                } else {
                    this.cursor.classList.remove('hover');
                }
            }, { passive: true });

            this.animate();
        }

        createParticle() {
            if (Math.random() > 0.7) {
                const emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
                const particle = {
                    x: this.mouse.x,
                    y: this.mouse.y,
                    emoji: emoji,
                    life: 1,
                    velocity: {
                        x: (Math.random() - 0.5) * 8,
                        y: -Math.random() * 8 - 4
                    },
                    scale: Math.random() * 0.5 + 0.5,
                    rotation: Math.random() * 360,
                    element: document.createElement('div')
                };

                particle.element.className = 'emoji-particle';
                particle.element.textContent = particle.emoji;
                particle.element.style.left = `${particle.x}px`;
                particle.element.style.top = `${particle.y}px`;
                particle.element.style.opacity = particle.life;
                particle.element.style.transform = `translate(-50%, -50%) scale(${particle.scale}) rotate(${particle.rotation}deg)`;
                document.body.appendChild(particle.element);

                this.particles.push(particle);

                setTimeout(() => {
                    if (particle.element && particle.element.parentNode) {
                        particle.element.remove();
                    }
                }, 150);
            }
        }

        createRipple(x, y) {
            const ripple = document.createElement('div');
            ripple.className = 'cursor-ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            const style = document.createElement('style');
            style.textContent = `
                .cursor-ripple {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                    position: fixed;
                    pointer-events: none !important;
                    z-index: ${CURSOR_CONFIG.zIndex.ripple};
                    transform: translate(-50%, -50%);
                    animation: ripple 0.5s linear forwards;
                }

                @keyframes ripple {
                    0% {
                        width: 20px;
                        height: 20px;
                        opacity: 1;
                    }
                    100% {
                        width: 50px;
                        height: 50px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(ripple);

            ripple.addEventListener('animationend', () => {
                ripple.remove();
                style.remove();
            });
        }

        animate() {
            this.particles = this.particles.filter(particle => {
                if (particle.life <= 0) {
                    if (particle.element && particle.element.parentNode) {
                        particle.element.remove();
                    }
                    return false;
                }
                return true;
            });

            this.particles.forEach(particle => {
                particle.x += particle.velocity.x;
                particle.y += particle.velocity.y;
                particle.life -= 0.15;
                particle.velocity.y += 0.35;
                particle.rotation += 12;

                if (particle.element) {
                    particle.element.style.left = `${particle.x}px`;
                    particle.element.style.top = `${particle.y}px`;
                    particle.element.style.opacity = particle.life;
                    particle.element.style.transform = `translate(-50%, -50%) scale(${particle.scale}) rotate(${particle.rotation}deg)`;
                }
            });

            requestAnimationFrame(() => this.animate());
        }

        setupClickHandling() {
            document.addEventListener('click', (e) => {
                e.preventDefault();
                
                const clickX = e.clientX;
                const clickY = e.clientY;
                const elements = document.elementsFromPoint(clickX, clickY);
                
                const clickableElement = elements.find(el => 
                    el.matches('a, button, .clickable')
                );
                
                if (clickableElement) {
                    if (clickableElement.tagName === 'A') {
                        const href = clickableElement.getAttribute('href');
                        if (href.startsWith('#')) {
                            const targetElement = document.querySelector(href);
                            if (targetElement) {
                                targetElement.scrollIntoView({ behavior: 'smooth' });
                            }
                        } else {
                            window.location.href = href;
                        }
                    }
                    
                    if (clickableElement.tagName === 'BUTTON') {
                        clickableElement.click();
                    }
                    
                    clickSound.currentTime = 0;
                    clickSound.play();
                    this.createClickEffect(clickX, clickY);
                }
            }, { capture: true });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, creating cursor instance...');
        const cursorInstance = Object.freeze(new EmojiEffect());
        console.log('Cursor instance created.');

        Object.defineProperty(window, 'cursorSystem', {
            value: cursorInstance,
            writable: false,
            configurable: false
        });
    });
})(); 