const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

// 加入訊息到畫面
function addMessage(role, content) {
    const div = document.createElement('div');
    div.classList.add('bubble', role);
    div.textContent = content;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 載入初始 AI 訊息
window.addEventListener('DOMContentLoaded', () => {
    addMessage('ai', '你好！有什麼我可以幫忙的嗎？');
});

// 表單送出事件
chatForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage('user', text);
    chatInput.value = '';
    chatInput.focus();

    // 呼叫後端 API 串接 OpenAI
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: text }),
        });

        const data = await response.json();
        if (data.reply) {
            addMessage('ai', data.reply);
        } else if (data.error) {
            addMessage('ai', '錯誤：' + data.error);
        }
    } catch (error) {
        addMessage('ai', '伺服器錯誤，請稍後再試。');
    }
});
