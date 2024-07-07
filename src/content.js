// 创建弹幕容器
const danmakuContainer = document.createElement('div');
danmakuContainer.id = 'danmaku-container';
document.body.appendChild(danmakuContainer);

// 创建并显示弹幕
function createDanmaku(text, color = '#ffffff') {
  const danmaku = document.createElement('div');
  danmaku.className = 'danmaku';
  danmaku.textContent = text;
  danmaku.style.color = color;
  danmaku.style.top = Math.random() * (window.innerHeight - 50) + 'px';
  
  danmakuContainer.appendChild(danmaku);
  
  setTimeout(() => {
    danmaku.remove();
  }, 8000);
}

// 监听来自 background.js 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showDanmaku') {
    createDanmaku(request.text, request.color);
  }
});