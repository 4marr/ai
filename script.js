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

function back() {
    window.open("/dashboard/Playground/index.html")
}

function faq() {
    document.querySelector(".contentFAQ").style.display = "flex"
}

function closeFaq() {
    document.querySelector(".contentFAQ").style.display = "none"
}

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

let generateResponse = (incomingChatLi) => {
    const API_URL = "https://fastrestapis.fasturl.cloud/aillm/deepseek";
    const messageElement = incomingChatLi.querySelector("p");
    chatInput.readOnly = true;
    chatInput.placeholder = 'Mohon tunggu...'

    let conversationHistory = [];

    // Cek apakah ada riwayat percakapan di localStorage
    const storedHistory = localStorage.getItem('conversationHistory');
    if (storedHistory) {
        conversationHistory = JSON.parse(storedHistory);
    }

    // Tambahkan pesan pengguna ke riwayat percakapan
    addMessageToHistory("user", userMessage);

    // Siapkan payload yang berisi seluruh riwayat percakapan
    const payload = {
        id: chatId, // Gunakan id yang sama dari permintaan pertama
        model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
        messages: conversationHistory.slice(-2), // Hanya ambil dua pesan terakhir
        max_tokens: 128,
        temperature: 0.9,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
        top_p: 0.9,
        top_k: 100
    };
    console.log(payload);

    // Kirim seluruh riwayat percakapan ke server
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
            messageElement.innerHTML = data.result.choices[0].message.content.replace("<think>\n\n</think>\n\n", "");;
            // Tambahkan respons asisten ke riwayat percakapan
            addMessageToHistory('system', data.result.choices[0].message.content);

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

sendChatBtn.addEventListener("click",
    handleChat);

const paste = document.getElementById('paste-button');

paste.addEventListener("click",
    async () => {
        const read = await navigator.clipboard.readText()
        chatInput.value = read
    })
