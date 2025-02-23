var loader = document.getElementById('loader');

window.addEventListener('load', function () {
    loader.style.display = 'none';
});

// Fungsi untuk menginisialisasi riwayat percakapan
function initializeConversationHistory() {
    let conversationHistory = [];
    const storedHistory = localStorage.getItem('conversationHistory');

    if (storedHistory) {
        conversationHistory = JSON.parse(storedHistory);
    }

    if (conversationHistory.length === 0) {
        conversationHistory.push({
            role: "system",
            content: "Be a helpful assistant"
        });
        localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
    }
}

// Panggil fungsi ini saat aplikasi dimulai, misalnya dalam event 'DOMContentLoaded'
document.addEventListener('DOMContentLoaded', localStorage.clear());
document.addEventListener('DOMContentLoaded', initializeConversationHistory);

var iconTheme = document.getElementById("theme-button")
function changeTheme() {
    document.body.classList.toggle("darkTheme")
    if (document.body.classList.contains("darkTheme")) {
        iconTheme.innerText = "light_mode";
    } else {
        iconTheme.innerText = "dark_mode";
    }
}

var textarea = document.getElementById('message');
textarea.addEventListener("input", e => {
    textarea.style.height = "50px";
    var height = e.target.scrollHeight;
    textarea.style.height = height + 'px';

    if (height > 70) {
        textarea.style.borderRadius = "15px";
    } else {
        textarea.style.borderRadius = "30px";
    }
})

let chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input i");
const chatBox = document.querySelector(".chatBox");

let userMessage;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className)
    let chatContent = className === "outgoing" ? `<p></p>` : `<pre><p></p></pre>`
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

let chatId = null;
let currentModel = document.getElementById("modelSelect").value;
let randomString = Math.random().toString(36).substring(7); // Inisialisasi randomString sekali

document.getElementById("modelSelect").addEventListener("change", () => {
    const selectedModel = document.getElementById("modelSelect").value;
    if (selectedModel !== currentModel) {
        // Hapus riwayat percakapan sebelumnya
        localStorage.removeItem('conversationHistory');
        currentModel = selectedModel;
        randomString = Math.random().toString(36).substring(7); // Reset randomString saat model berubah
    }
});

let generateResponse = (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");
    chatInput.readOnly = true;
    chatInput.placeholder = 'Mohon tunggu...'
    var textarea = document.getElementById('message');
    textarea.style.height = "50px";
    textarea.style.borderRadius = "30px";

    let conversationHistory = [];

    // Cek apakah ada riwayat percakapan di localStorage
    const storedHistory = localStorage.getItem('conversationHistory');
    if (storedHistory) {
        conversationHistory = JSON.parse(storedHistory);
    }

    // Tambahkan pesan pengguna ke riwayat percakapan
    addMessageToHistory("user", userMessage);

    // Dapatkan model yang dipilih dari elemen select
    const selectedModel = document.getElementById("modelSelect").value;

    if (selectedModel === "gpt-4o-mini") {
        // Endpoint dan method untuk model gpt-4o-mini
        const API_URL = `https://fastrestapis.fasturl.cloud/aillm/gpt-4o-mini?ask=${encodeURIComponent(userMessage)}&sessionId=${randomString}`;

        fetch(API_URL, {
            method: 'GET',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let cleanedResponse = data.result;
                // Ganti teks yang diapit oleh ** dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Ganti teks yang diapit oleh ``` dengan tag <code>
                cleanedResponse = cleanedResponse.replace(/```(.*?)```/gs, '<code>$1</code>');
                // Ganti teks yang diawali oleh ### dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/^###/, "<strong>").replace(/$/, "</strong>");
                messageElement.innerHTML = cleanedResponse;
                // Tambahkan respons asisten ke riwayat percakapan
                addMessageToHistory('system', cleanedResponse);
            })
            .catch(error => {
                console.error('Error:', error);
            }).finally(
                () => {
                    chatBox.scrollTo(0, chatBox.scrollHeight)
                    chatInput.readOnly = false;
                    chatInput.placeholder = 'Masukkan pertanyaanmu disini...';
                }
            );
    } else if (selectedModel === "gpt-4o") {
        // Endpoint dan method untuk model gpt-4o
        const API_URL = `https://fastrestapis.fasturl.cloud/aillm/gpt-4o?ask=${encodeURIComponent(userMessage)}&sessionId=${randomString}`;

        fetch(API_URL, {
            method: 'GET',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let cleanedResponse = data.result;
                // Ganti teks yang diapit oleh ** dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Ganti teks yang diapit oleh ``` dengan tag <code>
                cleanedResponse = cleanedResponse.replace(/```(.*?)```/gs, '<code>$1</code>');
                // Ganti teks yang diawali oleh ### dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/^###/, "<strong>").replace(/$/, "</strong>");
                messageElement.innerHTML = cleanedResponse;
                // Tambahkan respons asisten ke riwayat percakapan
                addMessageToHistory('system', cleanedResponse);
            })
            .catch(error => {
                console.error('Error:', error);
            }).finally(
                () => {
                    chatBox.scrollTo(0, chatBox.scrollHeight)
                    chatInput.readOnly = false;
                    chatInput.placeholder = 'Masukkan pertanyaanmu disini...';
                }
            );
    } else if (selectedModel === "gpt-4") {
        // Endpoint dan method untuk model gpt-4
        const API_URL = `https://fastrestapis.fasturl.cloud/aillm/gpt-4?ask=${encodeURIComponent(userMessage)}&sessionId=${randomString}`;

        fetch(API_URL, {
            method: 'GET',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let cleanedResponse = data.result;
                // Ganti teks yang diapit oleh ** dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Ganti teks yang diapit oleh ``` dengan tag <code>
                cleanedResponse = cleanedResponse.replace(/```(.*?)```/gs, '<code>$1</code>');
                // Ganti teks yang diawali oleh ### dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/^###/, "<strong>").replace(/$/, "</strong>");
                messageElement.innerHTML = cleanedResponse;
                // Tambahkan respons asisten ke riwayat percakapan
                addMessageToHistory('system', cleanedResponse);
            })
            .catch(error => {
                console.error('Error:', error);
            }).finally(
                () => {
                    chatBox.scrollTo(0, chatBox.scrollHeight)
                    chatInput.readOnly = false;
                    chatInput.placeholder = 'Masukkan pertanyaanmu disini...';
                }
            );
    } else if (selectedModel === "google/gemini-2.0-flash-001" || selectedModel === "google/gemini-flash-1.5-8b" || selectedModel === "google/gemini-flash-1.5-exp" || selectedModel === "google/gemini-flash-1.5") {
        // Endpoint dan method untuk model gpt-4
        const API_URL = `https://fastrestapis.fasturl.cloud/aillm/gemini?ask=${encodeURIComponent(userMessage)}&style=Answer%20as%20a%20friendly%20assistant&model=${encodeURIComponent(selectedModel)}&sessionId=${randomString}`;

        fetch(API_URL, {
            method: 'GET',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let cleanedResponse = data.result.choices[0].message.content;
                // Ganti teks yang diapit oleh ** dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Ganti teks yang diapit oleh ``` dengan tag <code>
                cleanedResponse = cleanedResponse.replace(/```(.*?)```/gs, '<code>$1</code>');
                // Ganti teks yang diawali oleh ### dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/^###/, "<strong>").replace(/$/, "</strong>");
                messageElement.innerHTML = cleanedResponse;
                // Tambahkan respons asisten ke riwayat percakapan
                addMessageToHistory('system', cleanedResponse);
            })
            .catch(error => {
                console.error('Error:', error);
            }).finally(
                () => {
                    chatBox.scrollTo(0, chatBox.scrollHeight)
                    chatInput.readOnly = false;
                    chatInput.placeholder = 'Masukkan pertanyaanmu disini...';
                }
            );
    } else if (selectedModel === "meta-llama/Meta-Llama-3.1-8B-Instruct" || selectedModel === "meta-llama/Meta-Llama-3.1-70B-Instruct" || selectedModel === "meta-llama/Meta-Llama-3.1-405B-Instruct") {
        const API_URL = "https://fastrestapis.fasturl.cloud/aillm/llama";
        const payload = {
            id: chatId, // Gunakan id yang sama dari permintaan pertama
            model: selectedModel, // Gunakan model yang dipilih
            messages: conversationHistory.slice(-2), // Hanya ambil dua pesan terakhir
            max_tokens: 128,
            temperature: 0.3,
            presence_penalty: 0.1,
            frequency_penalty: 0.1,
            top_p: 0.9,
            top_k: 100
        };
        console.log(payload);

        fetch(API_URL, {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let cleanedResponse = data.result.choices[0].message.content;
                // Ganti teks yang diapit oleh ** dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Ganti teks yang diapit oleh ``` dengan tag <code>
                cleanedResponse = cleanedResponse.replace(/```(.*?)```/gs, '<code>$1</code>');
                // Ganti teks yang diawali oleh ### dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/^###/, "<strong>").replace(/$/, "</strong>");
                messageElement.innerHTML = cleanedResponse;
                // Tambahkan respons asisten ke riwayat percakapan
                addMessageToHistory('system', cleanedResponse);

                // Simpan id dari API jika belum ada
                if (!chatId) {
                    chatId = data.result.id;
                }
                console.log("Updated Payload with ID:", payload);
            })
            .catch(error => {
                console.error('Error:', error);
                console.log(payload)
            }).finally(
                () => {
                    chatBox.scrollTo(0, chatBox.scrollHeight)
                    chatInput.readOnly = false;
                    chatInput.placeholder = 'Masukkan pertanyaanmu disini...';
                }
            );
    } else {
        // Endpoint dan method untuk model lainnya
        const API_URL = "https://fastrestapis.fasturl.cloud/aillm/deepseek";
        const payload = {
            id: chatId, // Gunakan id yang sama dari permintaan pertama
            model: selectedModel, // Gunakan model yang dipilih
            messages: conversationHistory.slice(-2), // Hanya ambil dua pesan terakhir
            max_tokens: 512,
            temperature: 0.3,
            presence_penalty: 0.1,
            frequency_penalty: 0.1,
            top_p: 0.8,
            top_k: 100
        };
        console.log(payload);

        fetch(API_URL, {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Hapus <think>\n dari respons
                let cleanedResponse = data.result.choices[0].message.content.replace("<think>\n\n</think>\n\n", "");
                // Ganti teks yang diapit oleh ** dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Ganti teks yang diapit oleh ``` dengan tag <code>
                cleanedResponse = cleanedResponse.replace(/```(.*?)```/gs, '<code>$1</code>');
                // Ganti teks yang diawali oleh ### dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/^###/, "<strong>").replace(/$/, "</strong>");
                messageElement.innerHTML = cleanedResponse;
                // Tambahkan respons asisten ke riwayat percakapan
                addMessageToHistory('system', cleanedResponse);

                // Simpan id dari API jika belum ada
                if (!chatId) {
                    chatId = data.result.id;
                }
                console.log("Updated Payload with ID:", payload);
            })
            .catch(error => {
                console.error('Error:', error);
                console.log(payload)
            }).finally(
                () => {
                    chatBox.scrollTo(0, chatBox.scrollHeight)
                    chatInput.readOnly = false;
                    chatInput.placeholder = 'Masukkan pertanyaanmu disini...';
                }
            );
    }

    function addMessageToHistory(role, content) {
        conversationHistory = [{ role, content }]; // Ganti percakapan yang ada
        localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
    }
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    chatBox.scrollTo(0, chatBox.scrollHeight)

    const incomingChatLi = createChatLi("...", "incoming");
    chatBox.appendChild(incomingChatLi);
    chatBox.scrollTo(0, chatBox.scrollHeight)
    generateResponse(incomingChatLi)
    chatInput.value = "";
}

sendChatBtn.addEventListener("click", handleChat);

const paste = document.getElementById('paste-button');

paste.addEventListener("click", async () => {
    const read = await navigator.clipboard.readText()
    chatInput.value = read
})
