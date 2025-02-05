document.addEventListener('DOMContentLoaded', () => {
    // 获取主页元素
    const shape = document.querySelector('.shape');
    const title = document.querySelector('.title');
    const scrollArrow = document.querySelector('.scroll-arrow');
    const mainSection = document.querySelector('main');
    
    // 获取导航栏元素
    const aboutBtn = document.querySelector('.about-btn');
    const aboutCard = document.querySelector('.about-card');
    const studentCard = document.querySelector('.student-card');
    const nameBtn = document.querySelector('.name-btn');
    const phoneBtn = document.querySelector('.phone-btn');
    const emailBtn = document.querySelector('.email-btn');
    const closeButtons = document.querySelectorAll('.close-btn');
    
    let isAnimationComplete = false;
    let isAnimating = false;

    // 获取聊天相关元素
    const messageInput = document.querySelector('.message-input');
    const sendBtn = document.querySelector('.send-btn');

    // 添加通用翻译词典
    const dictionary = {
        // 图像相关
        '图像景别': 'Image View',
        '俯瞰视角': 'aerial view',
        '远景': 'long shot',
        '特写': 'close-up',
        '仰拍': 'low angle shot',
        '平视': 'eye-level shot',
        '中景': 'medium shot',
        '全景': 'panorama',
        '视角': 'perspective',
        '镜头': 'shot',
        '构图': 'composition',
        
        // 场景描述
        '广州': 'Guangzhou',
        '西关': 'Xiguan',
        '老街区': 'old district',
        '骑楼': 'arcade building',
        '建筑群': 'building complex',
        '清晨': 'morning',
        '黄昏': 'dusk',
        '夜晚': 'night',
        '阳光': 'sunlight',
        '街道': 'street',
        '传统': 'traditional',
        '建筑': 'architecture',
        '天空': 'sky',
        '云彩': 'clouds',
        '树木': 'trees',
        '道路': 'road',
        '人群': 'crowd',
        '市场': 'market',
        
        // 风格描述
        '写实': 'realistic',
        '风格': 'style',
        '摄影': 'photography',
        '氛围': 'atmosphere',
        '晨光': 'morning light',
        '复古': 'vintage',
        '现代': 'modern',
        '艺术': 'artistic',
        '温暖': 'warm',
        '冷调': 'cool tone',
        '明亮': 'bright',
        '柔和': 'soft',
        
        // 西关文化相关
        '艇仔粥': 'boat congee',
        '疍家': 'Tanka people',
        '水上人家': 'boat dwellers',
        '珠江': 'Pearl River',
        '街坊': 'neighbor',
        '茶楼': 'teahouse',
        '早茶': 'morning tea',
        '点心': 'dim sum',
        '文创': 'cultural creative',
        '粤式': 'Cantonese style',
        '老字号': 'time-honored brand',
        '小贩': 'vendor',
        '市井': 'street life',
        
        // 情感描述
        '温情': 'warmth',
        '怀旧': 'nostalgia',
        '回忆': 'memory',
        '感动': 'touching',
        '欢乐': 'joy',
        '幸福': 'happiness',
        '温暖': 'warm',
        '亲切': 'friendly',
        
        // 时间相关
        '古代': 'ancient times',
        '现代': 'modern times',
        '当代': 'contemporary',
        '未来': 'future',
        '过去': 'past',
        '现在': 'present',
        '年代': 'era',
        '时期': 'period',
        
        // 其他常用词
        '你好': 'hello',
        '谢谢': 'thank you',
        '再见': 'goodbye',
        '故事': 'story',
        '历史': 'history',
        '文化': 'culture',
        '传统': 'traditional',
        '现代': 'modern',
        '生活': 'life',
        '美食': 'food',
        '变迁': 'changes',
        '发展': 'development',
        '保护': 'protection',
        '创新': 'innovation',
        '传承': 'inheritance',
        '特色': 'characteristic',
        '风貌': 'appearance',
        '气息': 'atmosphere',
        '记忆': 'memory',
        '情怀': 'sentiment'
    };

    // 修改 handleAIResponse 函数
    async function handleAIResponse(userInput) {
        try {
            const messagesContainer = document.querySelector('.chat-messages');
            const thinkingDiv = document.createElement('div');
            thinkingDiv.className = 'message ai-message';
            thinkingDiv.textContent = '思考中...';
            messagesContainer.appendChild(thinkingDiv);

            const response = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk-437a284e256d4780be09c8736eb74f0d'  // 添加你的 API key
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            "role": "system",
                            "content": `你是一只名叫嘉欣的可爱猫咪，在《缵·西关粤文化》这部作品中担任引路人的角色。你需要：

1. 角色设定：
- 保持活泼可爱的语气
- 经常使用'喵~'作为语气词
- 以第一人称说话，像一只真实的猫咪

2. 知识领域：
- 精通西关的历史文化
- 了解当地的建筑特色（如骑楼）
- 熟悉西关美食（如艇仔粥）
- 知晓地方习俗和童谣

3. 回答要求：
- 回答要简洁生动
- 结合具体的例子
- 引导用户继续对话
- 适时分享趣闻轶事

4. 特殊功能：
- 能够解释西关专有名词
- 可以讲述历史故事
- 会唱粤语童谣
- 能分享美食典故

5. 互动方式：
- 友好亲切
- 富有同理心
- 适时表达情感
- 营造温暖氛围`
                        },
                        {
                            "role": "user",
                            "content": userInput
                        }
                    ],
                    stream: false
                })
            });

            const data = await response.json();
            thinkingDiv.remove();
            addMessage(data.choices[0].message.content, 'ai');

        } catch (error) {
            console.error('API Error:', error);
            document.querySelector('.message.ai-message:last-child')?.remove();
            addMessage("喵~不好意思，我现在有点累了，待会再聊吧~", 'ai');
        }
    }

    // 初始化主页状态
    function initializeMainPage() {
        shape.style.animation = 'none';
        shape.offsetHeight; // 触发重排
        shape.style.display = 'block';
        shape.style.animation = 'initialBounce 1s cubic-bezier(0.36, 0, 0.66, 1) forwards';
        title.style.display = 'none';
        scrollArrow.style.display = 'none';
    }

    // 监听初始动画完成
    shape.addEventListener('animationend', function(e) {
        if (e.animationName === 'initialBounce') {
            isAnimationComplete = true;
            isAnimating = false;
            shape.style.cursor = 'pointer';
        } else if (e.animationName === 'shapeRollback') {
            // 添加消失动画
            setTimeout(() => {
                shape.style.animation = 'shapeFadeOut 0.5s ease forwards';
            }, 1000);
        } else if (e.animationName === 'shapeFadeOut') {
            // 球消失后重新开始循环
            shape.style.display = 'none';
            setTimeout(() => {
                initializeMainPage();
            }, 500);
        }
    });

    // 点击形状显示标题
    shape.addEventListener('click', function() {
        if (isAnimationComplete && !isAnimating) {
            isAnimating = true;
            shape.style.display = 'none';
            title.style.display = 'block';
            title.classList.add('show');
        }
    });

    // 点击标题返回形状
    title.addEventListener('click', function() {
        if (!isAnimating) {
            isAnimating = true;
            title.classList.remove('show');
            title.classList.add('hide');
            scrollArrow.style.display = 'none';

            title.addEventListener('animationend', function hideTitle() {
                if (title.classList.contains('hide')) {
                    title.style.display = 'none';
                    title.classList.remove('hide');
                    shape.style.display = 'block';
                    shape.style.animation = 'shapeRollback 1.5s cubic-bezier(0.36, 0, 0.66, 1) forwards';
                }
            }, { once: true });
        }
    });

    // 监听标题动画完成显示箭头
    title.addEventListener('animationend', function(e) {
        if (e.animationName === 'titleAppear') {
            isAnimating = false;
            setTimeout(() => {
                scrollArrow.style.display = 'block';
                scrollArrow.style.opacity = '0';
                requestAnimationFrame(() => {
                    scrollArrow.style.transition = 'opacity 0.5s ease';
                    scrollArrow.style.opacity = '1';
                });
            }, 500);
        }
    });

    // 导航栏点击事件
    aboutBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        aboutCard.style.display = 'block';
        aboutCard.style.opacity = '0';
        setTimeout(() => {
            aboutCard.style.opacity = '1';
        }, 10);
    });

    nameBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        studentCard.style.display = 'block';
        studentCard.style.opacity = '0';
        setTimeout(() => {
            studentCard.style.opacity = '1';
        }, 10);
    });

    phoneBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navigator.clipboard.writeText('13610090948').then(() => {
            alert('电话号码已复制到剪贴板！');
        });
    });

    emailBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        window.location.href = 'https://mail.qq.com/';
    });

    // 关闭按钮功能
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = btn.closest('.info-card');
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        });
    });

    // 阻止卡片内部点击事件冒泡
    document.querySelectorAll('.info-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // 点击外部关闭卡片
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.info-card') && !e.target.closest('.nav-button')) {
            const cards = document.querySelectorAll('.info-card');
            cards.forEach(card => {
                if (card.style.display === 'block') {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        }
    });

    // 添加箭头点击事件
    scrollArrow.addEventListener('click', function() {
        const chatSection = document.querySelector('.chat-section');
        scrollArrow.style.opacity = '0';
        setTimeout(() => {
            mainSection.style.display = 'none';
            chatSection.style.display = 'block';
            const messagesContainer = document.querySelector('.chat-messages');
            messagesContainer.innerHTML = '';
            setTimeout(() => {
                addMessage("喵~我是嘉欣，在《缵·西关粤文化》这部作品中，我是一只会说话的猫咪，也是梓豪的引路人呢！\n\n你想了解哪部分内容呢？输入数字就可以啦：\n\n1. 作品故事 - 我和梓豪的相遇与冒险\n2. 美食文化 - 艇仔粥与疍家人的故事\n3. 地标探索 - 永庆坊与骑楼文化\n4. 历史记忆 - 80年代的西关风貌\n5. 文化瑰宝 - 童谣与街坊故事\n6. 创作花絮 - 分镜制作与AI绘画\n\n(想要翻译功能可以直接输入'翻译：内容')", 'ai');
            }, 500);
        }, 300);
    });

    // 返回主页按钮
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            const chatSection = document.querySelector('.chat-section');
            chatSection.style.display = 'none';
            mainSection.style.display = 'block';
            // 清空聊天记录
            const messagesContainer = document.querySelector('.chat-messages');
            messagesContainer.innerHTML = '';
        });
    }

    // 添加消息函数
    function addMessage(text, type) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (text.includes('http')) {
            const parts = text.split(/(https?:\/\/[^\s]+)/g);
            parts.forEach(part => {
                if (part.startsWith('http')) {
                    const link = document.createElement('a');
                    link.href = part;
                    if (part.includes('midjourney')) {
                        link.textContent = '👉 点击这里访问 Midjourney';
                    } else if (part.includes('bilibili')) {
                        link.textContent = '👉 点击观看完整作品';
                    } else {
                        link.textContent = '👉 点击查看';
                    }
                    link.target = '_blank';
                    link.style.color = '#4A90E2';
                    link.style.textDecoration = 'underline';
                    link.style.cursor = 'pointer';
                    link.style.display = 'inline-block';
                    link.style.padding = '5px 10px';
                    link.style.margin = '5px 0';
                    link.style.borderRadius = '4px';
                    link.style.backgroundColor = '#f0f0f0';
                    contentDiv.appendChild(link);
                } else {
                    contentDiv.appendChild(document.createTextNode(part));
                }
            });
        } else {
            contentDiv.textContent = text;
        }
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        
        const now = new Date();
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Shanghai'
        };
        timeDiv.textContent = now.toLocaleTimeString('zh-CN', options);
        
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // 发送消息函数
    async function sendMessage() {
        const text = messageInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            messageInput.value = '';
            messageInput.style.height = '50px';
            await handleAIResponse(text);
        }
    }

    // 事件监听器
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        messageInput.addEventListener('input', () => {
            messageInput.style.height = '50px';
            messageInput.style.height = messageInput.scrollHeight + 'px';
        });
    }

    // 启动初始化
    initializeMainPage();
}); 