// 锁定指针系统
(function() {
    // 创建音效对象
    const clickSound = new Audio('click.mp3');
    
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
            this.emojis = CURSOR_CONFIG.emojis;
            this.particles = [];
            this.mouse = { x: 0, y: 0 };
            
            // 创建自定义指针
            this.cursor = document.createElement('div');
            this.cursor.className = 'custom-cursor';
            document.body.appendChild(this.cursor);
            
            // 确保指针可见
            this.cursor.style.display = 'block';
            this.cursor.style.visibility = 'visible';
            
            this.isClicking = false;
            this.raf = null;
            this.cursorPos = { x: 0, y: 0 };
            
            this.init();
            this.setupClickHandling();
            
            // 修改基础样式
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
                    transition: opacity 0.05s linear;
                }
            `;
            document.head.appendChild(style);
        }

        init() {
            // 修改鼠标移动处理
            const updateCursor = (e) => {
                this.cursorPos.x = e.clientX;
                this.cursorPos.y = e.clientY;
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                
                // 更新指针位置
                this.cursor.style.transform = `translate(${this.cursorPos.x}px, ${this.cursorPos.y}px) translate(-50%, -50%)`;
                
                // 直接创建粒子，不使用 RAF
                if (this.isClicking) {
                    this.createParticle();
                    this.createParticle();
                } else {
                    this.createParticle();
                }
            };

            document.addEventListener('mousemove', updateCursor, { passive: true });

            // 修改鼠标进入/离开处理
            document.addEventListener('mouseleave', () => {
                this.cursor.style.visibility = 'hidden';
            });

            document.addEventListener('mouseenter', () => {
                this.cursor.style.visibility = 'visible';
            });

            // 确保指针在页面加载时就显示
            document.addEventListener('DOMContentLoaded', () => {
                document.body.style.cursor = 'none';
            });

            // 添加点击动画
            document.addEventListener('mousedown', (e) => {
                this.cursor.classList.add('clicking');
                this.createRipple(e.clientX, e.clientY);
                this.isClicking = true;
            });

            document.addEventListener('mouseup', () => {
                this.cursor.classList.remove('clicking');
                this.isClicking = false;
            });

            // 添加悬停检测
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

            // 动画循环
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

                // 创建并设置元素
                particle.element.className = 'emoji-particle';
                particle.element.textContent = particle.emoji;
                particle.element.style.left = `${particle.x}px`;
                particle.element.style.top = `${particle.y}px`;
                particle.element.style.opacity = particle.life;
                particle.element.style.transform = `translate(-50%, -50%) scale(${particle.scale}) rotate(${particle.rotation}deg)`;
                document.body.appendChild(particle.element);

                this.particles.push(particle);

                // 更快的自动移除
                setTimeout(() => {
                    if (particle.element && particle.element.parentNode) {
                        particle.element.remove();
                    }
                }, 150); // 从300ms改为150ms
            }
        }

        createClickEffect(x, y) {
            // 点击时创建更多粒子
            for (let i = 0; i < 15; i++) { // 增加粒子数量
                this.particles.push({
                    x: x,
                    y: y,
                    emoji: this.emojis[Math.floor(Math.random() * this.emojis.length)],
                    life: 1,
                    velocity: {
                        x: (Math.random() - 0.5) * 15, // 增加速度
                        y: (Math.random() - 0.5) * 15
                    },
                    scale: Math.random() * 1 + 0.5, // 增加大小
                    rotation: Math.random() * 360
                });
            }
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
                particle.life -= 0.15; // 大幅加快消失速度
                particle.velocity.y += 0.35; // 增加重力效果
                particle.rotation += 12; // 加快旋转

                if (particle.element) {
                    particle.element.style.left = `${particle.x}px`;
                    particle.element.style.top = `${particle.y}px`;
                    particle.element.style.opacity = particle.life;
                    particle.element.style.transform = `translate(-50%, -50%) scale(${particle.scale}) rotate(${particle.rotation}deg)`;
                }
            });

            requestAnimationFrame(() => this.animate());
        }

        createRipple(x, y) {
            const ripple = document.createElement('div');
            ripple.className = 'cursor-ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // 添加涟漪动画样式
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
                style.remove(); // 动画结束后移除样式
            });
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

    // 创建单例实例并冻结
    const cursorInstance = Object.freeze(new EmojiEffect());

    // 防止外部修改
    Object.defineProperty(window, 'cursorSystem', {
        value: cursorInstance,
        writable: false,
        configurable: false
    });
})(); 