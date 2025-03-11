var loader = document.getElementById('loader');

window.addEventListener('load', function () {
    loader.style.display = 'none';
});

const textareas = document.getElementById('message');
const sendButton = document.getElementById('send-button');

setInterval(() => {
    if (textareas.validity.valid) {
        sendButton.classList.remove('bg-d-base/50', 'dark:bg-gray-800/50');
        sendButton.classList.add('bg-d-base', 'dark:bg-gray-800');
    } else {
        sendButton.classList.add('bg-d-base/50', 'dark:bg-gray-800/50');
        sendButton.classList.remove('bg-d-base', 'dark:bg-gray-800');
    }
}, 100); // Check every 100 milliseconds (adjust timing as needed)



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

//theme
function changeTheme() {
    const element = document.documentElement
    const theme = element.classList.contains("dark") ? "light" : "dark"

    const css = document.createElement("style")

    css.appendChild(
        document.createTextNode(
            `* {
             -webkit-transition: none !important;
             -moz-transition: none !important;
             -o-transition: none !important;
             -ms-transition: none !important;
             transition: none !important;
          }`,
        ),
    )
    document.head.appendChild(css)

    if (theme === "dark") {
        element.classList.add("dark")
    } else {
        element.classList.remove("dark")
    }

    window.getComputedStyle(css).opacity
    document.head.removeChild(css)
    localStorage.theme = theme
}

function preloadTheme() {
    const theme = (() => {
        const userTheme = localStorage.theme

        if (userTheme === "light" || userTheme === "dark") {
            return userTheme
        } else {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        }
    })()

    const element = document.documentElement

    if (theme === "dark") {
        element.classList.add("dark")
    } else {
        element.classList.remove("dark")
    }
    localStorage.theme = theme
}

window.onload = () => {
    function initializeThemeButtons() {
        const headerThemeButton = document.getElementById("header-theme-button")
        const drawerThemeButton = document.getElementById("drawer-theme-button")
        headerThemeButton?.addEventListener("click", changeTheme)
        drawerThemeButton?.addEventListener("click", changeTheme)
    }

    document.addEventListener("astro:after-swap", initializeThemeButtons)
    initializeThemeButtons()
}

document.addEventListener("astro:after-swap", preloadTheme)

preloadTheme()


var textarea = document.getElementById('message');
textarea.addEventListener("input", e => {
    textarea.style.height = "50px";
    var height = e.target.scrollHeight;
    textarea.style.height = height + 'px';

    if (height > 70) {
        document.getElementById('message-container').style.borderRadius = "15px";
    } else {
        document.getElementById('message-container').style.borderRadius = "30px";
    }
})

let chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input i");
const chatBox = document.querySelector(".chatBox");
const chatSection = document.querySelector(".chatSection");

let userMessage;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className)
    let chatContent;
    const uploadedImageUrl = localStorage.getItem("uploadedImageUrl");
    if (uploadedImageUrl) {
        chatContent = className === "outgoing" ? `<img src="${uploadedImageUrl}" alt=""><p class="text-sm text-l-base bg-d-base dark:bg-gray-800 py-3 px-4 rounded-t-lg rounded-bl-lg max-w-80"></p>` : `<pre><p class="text-sm"></p></pre>`
    } else {
        chatContent = className === "outgoing" ? `<p class="text-sm text-l-base bg-d-base dark:bg-gray-800 py-3 px-4 rounded-t-lg rounded-bl-lg max-w-80"></p>` : `<pre><p class="text-sm"></p></pre>`
    }
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

document.getElementById("image-upload").addEventListener("change", async () => {
    const fileInput = document.getElementById("image-upload");
    const file = fileInput.files[0];
    let imageContainer = document.getElementById("image-container");
    let image = document.getElementById("image");
    let imageStatus = document.getElementById("image-status");
    imageContainer.classList.remove("hidden");
    imageContainer.classList.add("flex");
    image.src = URL.createObjectURL(file);
    imageStatus.textContent = "loading to upload...";
    console.log("hai");


    // Langsung melakukan try-catch jika file terpilih
    if (file) {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("https://fastrestapis.fasturl.cloud/downup/uploader-v2", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.result) {
                console.log("Image uploaded successfully:", data.result);
                // Store the image URL in localStorage
                localStorage.setItem("uploadedImageUrl", data.result);
                imageStatus.textContent = "Image uploaded successfully!";
            } else {
                console.error("Failed to get image URL from response");
                imageStatus.textContent = "Image upload failed.";
            }
        } catch (error) {
            console.error("Image upload failed:", error);
            imageStatus.textContent = "Image upload failed.";
        }
    } else {
        console.error("No file selected.");
    }
});

function removeImage() {
    const uploadedImageUrl = localStorage.getItem("uploadedImageUrl");
    if (uploadedImageUrl) {
        localStorage.removeItem("uploadedImageUrl");
    }
    let imageContainer = document.getElementById("image-container");
    imageContainer.classList.remove("flex");
    imageContainer.classList.add("hidden");
}

let modelSelect = document.getElementById("modelSelect");

modelSelect.addEventListener("change", () => {
    const selectedModel = modelSelect.value;  // Ambil nilai yang dipilih dari dropdown

    console.log("Model selected:", selectedModel);  // Menampilkan model yang dipilih untuk debug

    if (selectedModel === "google/gemini-2.0-flash-001" ||
        selectedModel === "google/gemini-flash-1.5-8b" ||
        selectedModel === "google/gemini-flash-1.5-8b-exp" ||
        selectedModel === "google/gemini-flash-1.5") {

        document.getElementById("image-upload-form").style.display = "flex";  // Menampilkan form upload gambar
    } else {
        document.getElementById("image-upload-form").style.display = "none";
    }
});

let generateResponse = (incomingChatLi) => {
    let imageContainer = document.getElementById("image-container");
    imageContainer.classList.remove("flex");
    imageContainer.classList.add("hidden");
    document.getElementById("welcome").classList.add("hidden");
    const messageElement = incomingChatLi.querySelector("p");
    chatInput.readOnly = true;
    chatInput.placeholder = 'Mohon tunggu...'
    var textarea = document.getElementById('message');
    textarea.style.height = "50px";
    textarea.style.borderRadius = "30px";

    chatBox.style.paddingBottom = "250px";
    chatSection.scrollTo(0, chatSection.scrollHeight)

    let skeleton = `
            <div class="div-skeleton h-full absolute top-0 left-0">
                <div class="skeleton" style="width: 90%;"></div>
                <div class="skeleton" style="width: 75%;"></div>
                <div class="skeleton" style="width: 80%;"></div>
                <div class="skeleton" style="width: 70%;"></div>
            </div>
    `
    incomingChatLi.insertAdjacentHTML("beforeend", skeleton);

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
        const API_URL = `https://fastrestapis.fasturl.link/aillm/gpt-4o-mini?ask=${encodeURIComponent(userMessage)}&sessionId=${randomString}`;

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
                document.querySelector(".div-skeleton").remove();
                let cleanedResponse = data.result;
                // Ganti teks yang diapit oleh ** dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Ganti teks yang diapit oleh ``` dengan tag <code>
                cleanedResponse = cleanedResponse.replace(/```(.*?)```/gs, '<code>$1</code>');
                // Ganti teks yang diawali oleh ### dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/^###/, "<strong>").replace(/$/, "</strong>");
                messageElement.innerHTML = '';
                typeText(messageElement, cleanedResponse);
            })
            .catch(error => {
                console.error('Error:', error);
                document.querySelector(".div-skeleton").remove();
                messageElement.innerHTML = "Something went wrong."
            }).finally(
                () => {
                    chatSection.scrollTo(0, chatSection.scrollHeight)
                    chatInput.readOnly = false;
                    chatInput.placeholder = 'Masukkan pertanyaanmu disini...';
                }
            );
    } else if (selectedModel === "gpt-4o") {
        // Endpoint dan method untuk model gpt-4o
        const API_URL = `https://fastrestapis.fasturl.link/aillm/gpt-4o?ask=${encodeURIComponent(userMessage)}&sessionId=${randomString}`;

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
                document.querySelector(".div-skeleton").remove();
                let cleanedResponse = data.result;
                // Ganti teks yang diapit oleh ** dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Ganti teks yang diapit oleh ``` dengan tag <code>
                cleanedResponse = cleanedResponse.replace(/```(.*?)```/gs, '<code>$1</code>');
                // Ganti teks yang diawali oleh ### dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/^###/, "<strong>").replace(/$/, "</strong>");
                messageElement.innerHTML = '';
                typeText(messageElement, cleanedResponse);
            })
            .catch(error => {
                console.error('Error:', error);
                document.querySelector(".div-skeleton").remove();
                messageElement.innerHTML = "Something went wrong."
            }).finally(
                () => {
                    chatSection.scrollTo(0, chatSection.scrollHeight)
                    chatInput.readOnly = false;
                    chatInput.placeholder = 'Masukkan pertanyaanmu disini...';
                }
            );
    } else if (selectedModel === "gpt-4") {
        // Endpoint dan method untuk model gpt-4
        const API_URL = `https://fastrestapis.fasturl.link/aillm/gpt-4?ask=${encodeURIComponent(userMessage)}&sessionId=${randomString}`;

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
                document.querySelector(".div-skeleton").remove();
                let cleanedResponse = data.result;
                // Ganti teks yang diapit oleh ** dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Ganti teks yang diapit oleh ``` dengan tag <code>
                cleanedResponse = cleanedResponse.replace(/```(.*?)```/gs, '<code>$1</code>');
                // Ganti teks yang diawali oleh ### dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/^###/, "<strong>").replace(/$/, "</strong>");
                messageElement.innerHTML = '';
                typeText(messageElement, cleanedResponse);
            })
            .catch(error => {
                console.error('Error:', error);
                document.querySelector(".div-skeleton").remove();
                messageElement.innerHTML = "Something went wrong."
            }).finally(
                () => {
                    chatSection.scrollTo(0, chatSection.scrollHeight)
                    chatInput.readOnly = false;
                    chatInput.placeholder = 'Masukkan pertanyaanmu disini...';
                }
            );
    } else if (selectedModel === "google/gemini-2.0-flash-001" || selectedModel === "google/gemini-flash-1.5-8b" || selectedModel === "google/gemini-flash-1.5-8b-exp" || selectedModel === "google/gemini-flash-1.5") {
        console.log("haiya");
        let API_URL = `https://fastrestapis.fasturl.link/aillm/gemini?ask=${encodeURIComponent(userMessage)}&style=Answer%20as%20a%20friendly%20assistant&model=${encodeURIComponent(selectedModel)}&sessionId=${randomString}`;
        const uploadedImageUrl = localStorage.getItem("uploadedImageUrl");
        if (uploadedImageUrl) {
            API_URL = `https://fastrestapis.fasturl.link/aillm/gemini?ask=${encodeURIComponent(userMessage)}&style=Answer%20as%20a%20friendly%20assistant&imageUrl=${uploadedImageUrl}&model=${encodeURIComponent(selectedModel)}&sessionId=${randomString}`;
            localStorage.removeItem("uploadedImageUrl");
        } else {
            API_URL = `https://fastrestapis.fasturl.link/aillm/gemini?ask=${encodeURIComponent(userMessage)}&style=Answer%20as%20a%20friendly%20assistant&model=${encodeURIComponent(selectedModel)}&sessionId=${randomString}`;
        }
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
                document.querySelector(".div-skeleton").remove();
                let cleanedResponse = data.result.choices[0].message.content;
                // Ganti teks yang diapit oleh ** dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Ganti teks yang diapit oleh ``` dengan tag <code>
                cleanedResponse = cleanedResponse.replace(/```(.*?)```/gs, '<code>$1</code>');
                // Ganti teks yang diawali oleh ### dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/^###/, "<strong>").replace(/$/, "</strong>");
                messageElement.innerHTML = '';
                typeText(messageElement, cleanedResponse);
            })
            .catch(error => {
                console.error('Error:', error);
                document.querySelector(".div-skeleton").remove();
                messageElement.innerHTML = "Something went wrong."
            }).finally(
                () => {
                    chatSection.scrollTo(0, chatSection.scrollHeight)
                    chatInput.readOnly = false;
                    chatInput.placeholder = 'Masukkan pertanyaanmu disini...';
                }
            );
    } else if (selectedModel === "meta-llama/Meta-Llama-3.1-8B-Instruct" || selectedModel === "meta-llama/Meta-Llama-3.1-70B-Instruct" || selectedModel === "meta-llama/Meta-Llama-3.1-405B-Instruct") {
        const API_URL = "https://fastrestapis.fasturl.link/aillm/llama";
        const payload = {
            id: chatId, // Gunakan id yang sama dari permintaan pertama
            model: selectedModel, // Gunakan model yang dipilih
            messages: conversationHistory.slice(-2), // Hanya ambil dua pesan terakhir
            max_tokens: 512,
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
                document.querySelector(".div-skeleton").remove();
                let response = data.result.choices[0].message.content;
                let cleanedResponse = data.result.choices[0].message.content;
                // Ganti teks yang diapit oleh ** dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Ganti teks yang diapit oleh ``` dengan tag <code>
                cleanedResponse = cleanedResponse.replace(/```(.*?)```/gs, '<code>$1</code>');
                // Ganti teks yang diawali oleh ### dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/^###/, "<strong>").replace(/$/, "</strong>");
                messageElement.innerHTML = '';
                typeText(messageElement, cleanedResponse);
                // Tambahkan respons asisten ke riwayat percakapan
                addMessageToHistory('system', response);

                // Simpan id dari API jika belum ada
                if (!chatId) {
                    chatId = data.result.id;
                }
                console.log("Updated Payload with ID:", payload);
            })
            .catch(error => {
                console.error('Error:', error);
                document.querySelector(".div-skeleton").remove();
                messageElement.innerHTML = "Something went wrong."
            }).finally(
                () => {
                    chatSection.scrollTo(0, chatSection.scrollHeight)
                    chatInput.readOnly = false;
                    chatInput.placeholder = 'Masukkan pertanyaanmu disini...';
                }
            );
    } else {
        // Endpoint dan method untuk model lainnya
        const API_URL = "https://fastrestapis.fasturl.link/aillm/deepseek";
        const payload = {
            id: chatId, // Gunakan id yang sama dari permintaan pertama
            model: selectedModel, // Gunakan model yang dipilih
            messages: conversationHistory.slice(-2), // Hanya ambil dua pesan terakhir
            max_tokens: 512,
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
                document.querySelector(".div-skeleton").remove();
                let response = data.result.choices[0].message.content;
                // Hapus <think>\n dari respons
                let cleanedResponse = data.result.choices[0].message.content.replace("<think>\n\n</think>\n\n", "");
                // Ganti teks yang diapit oleh ** dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Ganti teks yang diapit oleh ``` dengan tag <code>
                cleanedResponse = cleanedResponse.replace(/```(.*?)```/gs, '<code>$1</code>');
                // Ganti teks yang diawali oleh ### dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/^###/, "<strong>").replace(/$/, "</strong>");
                messageElement.innerHTML = '';
                typeText(messageElement, cleanedResponse);
                // Tambahkan respons asisten ke riwayat percakapan
                addMessageToHistory('system', response);

                // Simpan id dari API jika belum ada
                if (!chatId) {
                    chatId = data.result.id;
                }
                console.log("Updated Payload with ID:", payload);
            })
            .catch(error => {
                console.error('Error:', error);
                document.querySelector(".div-skeleton").remove();
                messageElement.innerHTML = "Something went wrong."
            }).finally(
                () => {
                    chatSection.scrollTo(0, chatSection.scrollHeight)
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

function typeText(element, text, delay = 20) {
    chatBox.style.paddingBottom = "150px";
    const words = text.split(' ');
    let index = 0;
    function type() {
        if (index < words.length) {
            element.innerHTML += words[index] + ' ';
            index++;
            chatSection.scrollTo(0, chatSection.scrollHeight); // Tambahkan ini untuk menggulir setelah setiap kata ditambahkan
            setTimeout(type, delay);
        }
    }
    type();
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    chatSection.scrollTo(0, chatSection.scrollHeight);
    console.log(chatBox);

    const incomingChatLi = createChatLi("", "incoming");
    incomingChatLi.style.position = "relative"; // Tambahkan ini untuk memastikan skeleton loader dapat menimpa
    chatBox.appendChild(incomingChatLi);
    chatSection.scrollTo(0, chatSection.scrollHeight);
    generateResponse(incomingChatLi);
    chatInput.value = "";
}

sendChatBtn.addEventListener("click", handleChat);
