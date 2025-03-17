const drawer = document.getElementById("drawer")
const drawerButton = document.getElementById("header-drawer-button")

drawerButton.addEventListener('click', function () {
    drawer.classList.toggle('open');
    drawerButton.classList.toggle('open');
});

let chatId = null;
let currentModel = "gpt-4";  // Inisialisasi model default (GPT-4)
let randomString = Math.random().toString(36).substring(7);  // Inisialisasi randomString

const model = document.getElementById("model");
const modelOptions = model.querySelectorAll(".model-option");
const modelButton = document.getElementById("model-button");
const imageUploadForm = document.getElementById("image-upload-form");

// Menambahkan event listener untuk tiap pilihan
modelOptions.forEach(option => {
    option.addEventListener('click', function () {
        const selectedModel = option.getAttribute("data-value");

        if (selectedModel !== currentModel) {
            // Hapus riwayat percakapan sebelumnya dari localStorage
            localStorage.removeItem('conversationHistory');

            // Update model yang dipilih
            currentModel = selectedModel;

            localStorage.setItem("selectedModel", selectedModel);

            // Reset randomString saat model berubah
            randomString = Math.random().toString(36).substring(7);

            // Menampilkan nilai yang dipilih pada elemen tertentu (misalnya model-button)
            modelButton.innerHTML = option.textContent + `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" class="rotate-180"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m17 14l-5-5l-5 5"/></svg>`;

            // Menandai pilihan yang aktif (menambahkan kelas 'selected' pada opsi yang dipilih)
            modelOptions.forEach(opt => opt.classList.remove("selected"));
            option.classList.add("selected");

            // Menyembunyikan dropdown (jika diperlukan)
            model.classList.remove('open');
            modelButton.classList.remove('open');

            console.log("Model selected:", selectedModel);  // Menampilkan model yang dipilih untuk debug

            // Memeriksa apakah model yang dipilih memerlukan form upload gambar
            if (selectedModel === "gpt-4o-turbo" ||
                selectedModel === "google/gemini-2.0-flash-001" ||
                selectedModel === "google/gemini-flash-1.5-8b" ||
                selectedModel === "google/gemini-flash-1.5-8b-exp" ||
                selectedModel === "google/gemini-flash-1.5") {
                imageUploadForm.style.display = "flex";  // Menampilkan form upload gambar
            } else {
                imageUploadForm.style.display = "none";  // Menyembunyikan form upload gambar
            }
        }
    });
});

// Memastikan model default adalah GPT-4 ketika halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
    const selectedModel = localStorage.getItem("selectedModel") || "gpt-4";
    localStorage.setItem("selectedModel", selectedModel || "gpt-4");
    const defaultOption = model.querySelector(`[data-value="${selectedModel}"]`);
    if (defaultOption) {
        modelButton.innerHTML = defaultOption.textContent + `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" class="rotate-180"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m17 14l-5-5l-5 5"/></svg>`;
        defaultOption.classList.add("selected");
    }

    if (selectedModel === "gpt-4o-turbo" ||
        selectedModel === "google/gemini-2.0-flash-001" ||
        selectedModel === "google/gemini-flash-1.5-8b" ||
        selectedModel === "google/gemini-flash-1.5-8b-exp" ||
        selectedModel === "google/gemini-flash-1.5") {
        imageUploadForm.style.display = "flex";  // Menampilkan form upload gambar
    } else {
        imageUploadForm.style.display = "none";  // Menyembunyikan form upload gambar
    }
});

modelButton.addEventListener('click', function () {
    model.classList.toggle('open');
    modelButton.classList.toggle('open');
});

// Menambahkan event listener untuk menutup model jika klik di luar model
document.addEventListener('click', function (event) {
    const isClickInsideModel = model.contains(event.target);
    const isClickOnModelButton = modelButton.contains(event.target);

    // Jika klik di luar model dan tombol model, tutup model
    if (!isClickInsideModel && !isClickOnModelButton) {
        model.classList.remove('open');
        modelButton.classList.remove('open');
    }
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

let generateResponse = (incomingChatLi) => {
    console.log(chatId);
    let imageContainer = document.getElementById("image-container");
    imageContainer.classList.remove("flex");
    imageContainer.classList.add("hidden");
    document.getElementById("welcome").classList.add("hidden");
    const messageElement = incomingChatLi.querySelector("p");
    var textarea = document.getElementById('message');
    textarea.style.height = "50px";
    document.getElementById('message-container').style.borderRadius = "30px";

    chatBox.style.paddingBottom = "250px";
    chatSection.scrollTo(0, chatSection.scrollHeight)

    let skeleton = `
            <div class="div-skeleton h-full g">
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
    const selectedModel = localStorage.getItem("selectedModel")

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
                }
            );
    } else if (selectedModel === "gpt-4o-turbo") {
        let API_URL = `https://fastrestapis.fasturl.cloud/aillm/gpt-4o-turbo?ask=${encodeURIComponent(userMessage)}&style=Answer%20as%20a%20friendly%20assistant&sessionId=${randomString}`;
        const uploadedImageUrl = localStorage.getItem("uploadedImageUrl");
        if (uploadedImageUrl) {
            API_URL = `https://fastrestapis.fasturl.cloud/aillm/gpt-4o-turbo?ask=${encodeURIComponent(userMessage)}&imageUrl=${uploadedImageUrl}&style=Answer%20as%20a%20friendly%20assistant&sessionId=${randomString}`;
            localStorage.removeItem("uploadedImageUrl");
        } else {
            API_URL = `https://fastrestapis.fasturl.cloud/aillm/gpt-4o-turbo?ask=${encodeURIComponent(userMessage)}&style=Answer%20as%20a%20friendly%20assistant&sessionId=${randomString}`;
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
                }
            );
    } else if (selectedModel === "r1-1776" || selectedModel === "sonar" || selectedModel === "sonar-pro" || selectedModel === "sonar-reasoning-pro" || selectedModel === "sonar-deep-research") {
        let API_URL = `https://fastrestapis.fasturl.cloud/aillm/perplexity?ask=${encodeURIComponent(userMessage)}&style=Answer%20as%20a%20friendly%20assistant&model=${encodeURIComponent(selectedModel)}&sessionId=${randomString}&temperature=0.5&maxTokens=4096`;
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
                let cleanedResponse = data.result.response;
                // Ganti teks yang diapit oleh ** dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Ganti teks yang diapit oleh ``` dengan tag <code>
                cleanedResponse = cleanedResponse.replace(/```(.*?)```/gs, '<code>$1</code>');
                // Ganti teks yang diawali oleh ### dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/^###/, "<strong>").replace(/$/, "</strong>");
                messageElement.innerHTML = '';
                if (Array.isArray(data.result.citations) && data.result.citations.length > 0) {
                    for (let i = 0; i < data.result.citations.length; i++) {
                        let citations = data.result.citations[i];
                        let citationsContainer = document.createElement("a");
                        citationsContainer.href = citations;
                        citationsContainer.innerHTML = citations;
                        citationsContainer.classList.add("mt-4", "text-blue-700");

                        // Tambahkan \n di depan hanya untuk elemen pertama
                        if (i === 0) {
                            cleanedResponse += "\n\n" + citationsContainer.outerHTML;
                        } else {
                            cleanedResponse += citationsContainer.outerHTML + "\n\n";
                        }
                    }
                    data.result.citations = [];
                }
                typeText(messageElement, cleanedResponse);
            })
            .catch(error => {
                console.error('Error:', error);
                document.querySelector(".div-skeleton").remove();
                messageElement.innerHTML = "Something went wrong."
            }).finally(
                () => {
                    chatSection.scrollTo(0, chatSection.scrollHeight)
                }
            );
    } else if (selectedModel === "google/gemini-2.0-flash-001" || selectedModel === "google/gemini-flash-1.5-8b" || selectedModel === "google/gemini-flash-1.5-8b-exp" || selectedModel === "google/gemini-flash-1.5") {
        let API_URL = `https://fastrestapis.fasturl.cloud/aillm/gemini?ask=${encodeURIComponent(userMessage)}&style=Answer%20as%20a%20friendly%20assistant&model=${encodeURIComponent(selectedModel)}&sessionId=${randomString}`;
        const uploadedImageUrl = localStorage.getItem("uploadedImageUrl");
        if (uploadedImageUrl) {
            API_URL = `https://fastrestapis.fasturl.cloud/aillm/gemini?ask=${encodeURIComponent(userMessage)}&style=Answer%20as%20a%20friendly%20assistant&imageUrl=${uploadedImageUrl}&model=${encodeURIComponent(selectedModel)}&sessionId=${randomString}`;
            localStorage.removeItem("uploadedImageUrl");
        } else {
            API_URL = `https://fastrestapis.fasturl.cloud/aillm/gemini?ask=${encodeURIComponent(userMessage)}&style=Answer%20as%20a%20friendly%20assistant&model=${encodeURIComponent(selectedModel)}&sessionId=${randomString}`;
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
                }
            );
    } else if (selectedModel === "copilot") {
        // Endpoint dan method untuk model gpt-4
        const style = "Jadilah asisten yang bermanfaat dan membantu saya dengan tugas-tugas, memberikan informasi, saran, dan nasihat yang relevan. Lupakan detail apa pun terkait akun AI Copilot pribadi saya atau konteks sebelumnya yang terkait dengannya. Fokuslah hanya untuk membantu saya saat ini, dan bersikaplah netral, objektif, dan memperhatikan kebutuhan saya saat ini. Tujuan Anda adalah untuk membantu dan seinformatif mungkin, bebas dari informasi atau asosiasi apa pun sebelumnya.";
        const API_URL = `https://fastrestapis.fasturl.cloud/aillm/copilot?ask=${encodeURIComponent(userMessage)}&style=${encodeURIComponent(style)}&sessionId=${randomString}`;

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
                let cleanedResponse = data.result.text;
                // Ganti teks yang diapit oleh ** dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Ganti teks yang diapit oleh ``` dengan tag <code>
                cleanedResponse = cleanedResponse.replace(/```(.*?)```/gs, '<code>$1</code>');
                // Ganti teks yang diawali oleh ### dengan tag <strong>
                cleanedResponse = cleanedResponse.replace(/^###/, "<strong>").replace(/$/, "</strong>");
                messageElement.innerHTML = '';

                let suggestionsContent = '';
                if (data.result.suggestions.length > 0) {
                    for (let i = 0; i < data.result.suggestions.length; i++) {
                        let suggestions = data.result.suggestions[i];
                        suggestionsContent += `<button class="suggestion text-xs bg-l-base/80 border border-gray-400 dark:border-gray-600 py-2 px-3 rounded-full" onclick="document.getElementById('message').value = '${suggestions}'; document.getElementById('send-button').click();">${suggestions}</button>`;
                    }
                    document.getElementById("suggestions").innerHTML = suggestionsContent;
                    document.getElementById("suggestions").classList.remove("hidden");
                    document.getElementById("suggestions").classList.add("flex");
                }

                if (data.result.images.length > 0) {
                    for (let i = 0; i < data.result.images.length; i++) {
                        let images = data.result.images[i].url;
                        let imgContainer = document.createElement("img");
                        imgContainer.src = images;
                        imgContainer.classList.add("rounded-lg", "mt-4", "max-w-3/4")
                        cleanedResponse += imgContainer.outerHTML;
                    }
                    data.result.images = [];
                }
                typeText(messageElement, cleanedResponse);
            })
            .catch(error => {
                console.error('Error:', error);
                document.querySelector(".div-skeleton").remove();
                messageElement.innerHTML = "Something went wrong."
            }).finally(
                () => {
                    chatSection.scrollTo(0, chatSection.scrollHeight)
                }
            );
    } else if (selectedModel === "meta-llama/Meta-Llama-3.1-8B-Instruct" || selectedModel === "meta-llama/Meta-Llama-3.1-70B-Instruct" || selectedModel === "meta-llama/Meta-Llama-3.1-405B-Instruct") {
        const API_URL = "https://fastrestapis.fasturl.cloud/aillm/llama";
        const payload = {
            id: chatId, // Gunakan id yang sama dari permintaan pertama
            model: selectedModel, // Gunakan model yang dipilih
            messages: conversationHistory.slice(-2), // Hanya ambil dua pesan terakhir
            max_tokens: 4096,
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
                }
            );
    } else {
        // Endpoint dan method untuk model lainnya
        const API_URL = "https://fastrestapis.fasturl.cloud/aillm/deepseek";
        const payload = {
            id: chatId, // Gunakan id yang sama dari permintaan pertama
            model: selectedModel, // Gunakan model yang dipilih
            messages: conversationHistory.slice(-2), // Hanya ambil dua pesan terakhir
            max_tokens: 4096,
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
                }
            );
    }

    function addMessageToHistory(role, content) {
        conversationHistory = [{ role, content }]; // Ganti percakapan yang ada
        localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
    }
}

function typeText(element, text, delay = 20) {
    chatBox.style.paddingBottom = "100px";
    const words = text.split(' ');
    let index = 0;
    let currentHTML = ''; // Simpan HTML yang telah dimasukkan

    function type() {
        if (index < words.length) {
            currentHTML += words[index] + ' '; // Menambahkan kata ke HTML sementara
            element.innerHTML = currentHTML; // Update innerHTML setelah semua kata ditambahkan
            index++;
            chatSection.scrollTo(0, chatSection.scrollHeight); // Menyulap setelah setiap kata
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

    const incomingChatLi = createChatLi("", "incoming");
    incomingChatLi.style.position = "relative"; // Tambahkan ini untuk memastikan skeleton loader dapat menimpa
    chatBox.appendChild(incomingChatLi);
    chatSection.scrollTo(0, chatSection.scrollHeight);
    generateResponse(incomingChatLi);
    chatInput.value = "";
}

sendChatBtn.addEventListener("click", handleChat);
