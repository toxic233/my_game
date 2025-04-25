// 更新时间显示
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    timeElement.textContent = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 每秒更新时间
setInterval(updateTime, 1000);

// 立即更新时间
updateTime();