function showError(message) {
    const toast = document.createElement('div')
    toast.className = 'error-toast'
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">⚠️</span>
            <span class="toast-message">${message.replace(/\n/g, '<br>')}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `

    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ffebee;
        border: 1px solid #f44336;
        border-radius: 8px;
        padding: 15px;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `
    document.body.appendChild(toast)

    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove()
        }
    }, 2000)
}
