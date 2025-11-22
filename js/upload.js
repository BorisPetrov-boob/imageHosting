
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
let currentURL = '';


function showStatus(message, type) {
    const status = document.getElementById('upload-status')
    if (!status) return;

    status.textContent = message;
    status.className = `upload-status ${type}`
    status.style.display = 'block';

    if (type === 'success') {
        setTimeout(() => { status.style.display = 'none'; }, 5000);
    }

}


function validateFile(file) {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        showStatus('Invalid file type. Only JPG, PNG, and GIF are allowed.', 'error');
        return false;
    }

    if (file.size > MAX_FILE_SIZE) {
        showStatus('File is too large. Maximum size is 5 MB.', 'error');
        return false;
    }

    return true;
}

async function handlerFiles(file) {
    if (!file || !validateFile(file)) return;

    showStatus('Uploading...', 'info');

    try {
        // конвертация файла в base64
        const base64 = await filetoBase64(file);
        // сохранение изображения (saveImage может быть асинхронной)
        const success = await saveImage(file.name, base64, file.size);
        if (success) {
            showStatus('File uploaded successfully!', 'success');

            const input = document.getElementById('current-upload-input');
            if (input) {
                input.value = base64.substring(0, 50) + '...'; // сокращённый
                currentURL = base64;
            }

            const fileInputEl = document.getElementById('fileInput');
            if (fileInputEl) fileInputEl.value = '';
        } else {
            showStatus('Failed to upload file.', 'error');
        }

    } catch (error) {
        showStatus('Error uploading file: ' + (error && error.message ? error.message : String(error)), 'error');
    }
}


async function copyURL() {
    if (!currentURL) return;

    try {
        await navigator.clipboard.writeText(currentURL);
        showStatus('Image URL copied to clipboard!', 'success');

        const btn = document.getElementById("copy-button");
        const oldText = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => { btn.textContent = oldText; }, 2000);
    } catch (error) {
        showStatus('Failed to copy URL: ' + (error && error.message ? error.message : String(error)), 'error');

    }

}





document.addEventListener('DOMContentLoaded', () => { 
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.querySelector(".send_file button");
    const copyBtn = document.getElementById("copy-button");

    if (dropArea) {
        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropArea.classList.add('dragover');
        });

        dropArea.addEventListener('dragleave', (e) => {
            dropArea.classList.remove('dragover');
        });

        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dropArea.classList.remove('dragover');
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
                handlerFiles(e.dataTransfer.files[0]);
            }
        });

    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target && e.target.files && e.target.files[0]) {
                handlerFiles(e.target.files[0]);
               
            }
        });
        
        if (browseBtn) {
            browseBtn.addEventListener('click', (e) => {   
                e.preventDefault();
                e.stopPropagation();
                fileInput.click();
            });
        }
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            //  реализация копирования
        });
    }
});