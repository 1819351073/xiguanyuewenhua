// 创建音效对象
const clickSound = new Audio('click.mp3'); // 你需要添加一个点击音效文件

// 创建表情符号尾随效果
class EmojiEffect {
    constructor() {
        this.emojis = ['✨', '💫', '⭐', '🌟', '💥'];
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
    }

    init() {
        // 修改鼠标移动处理
        const updateCursor = (e) => {
            this.cursorPos.x = e.clientX;
            this.cursorPos.y = e.clientY;
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // 直接更新指针位置
            this.cursor.style.transform = `translate(${this.cursorPos.x}px, ${this.cursorPos.y}px)`;
            
            if (!this.raf) {
                this.raf = requestAnimationFrame(() => {
                    // 只处理粒子效果，不处理指针位置
                    if (this.isClicking) {
                        this.createParticle();
                        this.createParticle();
                    } else {
                        this.createParticle();
                    }
                    this.raf = null;
                });
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

        // 处理页面失焦时指针隐藏
        document.addEventListener('mouseleave', () => {
            this.cursor.style.display = 'none';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.display = 'block';
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

        // 动画循环
        this.animate();
    }

    createParticle() {
        if (Math.random() > 0.9) { // 控制粒子生成频率
            const emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
            this.particles.push({
                x: this.mouse.x,
                y: this.mouse.y,
                emoji: emoji,
                life: 1,
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: -Math.random() * 2 - 2
                }
            });
        }
    }

    createClickEffect(x, y) {
        // 创建更多粒子
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: x,
                y: y,
                emoji: this.emojis[Math.floor(Math.random() * this.emojis.length)],
                life: 1,
                velocity: {
                    x: (Math.random() - 0.5) * 12, // 增加速度
                    y: (Math.random() - 0.5) * 12
                },
                scale: Math.random() * 0.5 + 0.5, // 添加大小变化
                rotation: Math.random() * 360 // 添加旋转
            });
        }
    }

    animate() {
        // 清理旧的粒子
        this.particles = this.particles.filter(particle => particle.life > 0);

        // 更新粒子位置
        this.particles.forEach(particle => {
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            particle.life -= 0.01;
            particle.velocity.y += 0.1; // 重力效果
        });

        // 渲染粒子
        this.render();

        requestAnimationFrame(() => this.animate());
    }

    render() {
        document.querySelectorAll('.emoji-particle').forEach(el => el.remove());

        this.particles.forEach(particle => {
            const el = document.createElement('div');
            el.className = 'emoji-particle';
            el.textContent = particle.emoji;
            el.style.left = `${particle.x}px`;
            el.style.top = `${particle.y}px`;
            el.style.opacity = particle.life;
            el.style.transform = `translate(-50%, -50%) scale(${particle.scale}) rotate(${particle.rotation}deg)`;
            document.body.appendChild(el);
        });
    }

    // 添加新方法：创建涟漪效果
    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        document.body.appendChild(ripple);

        // 动画结束后移除元素
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }

    setupClickHandling() {
        // 阻止默认点击行为
        document.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 获取点击位置的元素
            const clickX = e.clientX;
            const clickY = e.clientY;
            const elements = document.elementsFromPoint(clickX, clickY);
            
            // 查找可点击元素
            const clickableElement = elements.find(el => 
                el.matches('a, button, .clickable')
            );
            
            if (clickableElement) {
                // 如果是链接，手动处理导航
                if (clickableElement.tagName === 'A') {
                    const href = clickableElement.getAttribute('href');
                    if (href.startsWith('#')) {
                        // 内部锚点链接
                        const targetElement = document.querySelector(href);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    } else {
                        // 外部链接
                        window.location.href = href;
                    }
                }
                
                // 如果是按钮，触发点击事件
                if (clickableElement.tagName === 'BUTTON') {
                    clickableElement.click();
                }
                
                // 播放音效和创建点击效果
                clickSound.currentTime = 0;
                clickSound.play();
                this.createClickEffect(clickX, clickY);
            }
        }, { capture: true });
    }
} 