const drawer = document.getElementById("drawer")
const drawerButton = document.getElementById("header-drawer-button")

drawerButton.addEventListener('click', function () {
    drawer.classList.toggle('open');
    drawerButton.classList.toggle('open');
});

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

document.getElementById("dropzone-file").addEventListener("change", async () => {
    const fileInput = document.getElementById("dropzone-file");
    const file = fileInput.files[0];
    localStorage.setItem("uploadedImageUrl", fileInput.files[0]);
    let imageContainer = document.getElementById("image-container");
    let imageStatus = document.getElementById("image-status");
    let image = document.getElementById("image");
    imageContainer.classList.remove("hidden");
    imageContainer.classList.add("flex");
    image.src = URL.createObjectURL(file);
    imageStatus.textContent = "loading to upload...";

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

async function generate() {
    let skeleton = `
            <div class="div-skeleton h-full absolute top-0 left-0">
                <div class="skeleton" style="width: 90%;"></div>
                <div class="skeleton" style="width: 75%;"></div>
                <div class="skeleton" style="width: 80%;"></div>
                <div class="skeleton" style="width: 70%;"></div>
            </div>
    `;
    document.getElementById("result").innerHTML = skeleton;
    const uploadedImageUrl = localStorage.getItem("uploadedImageUrl");
    const API_URL = `https://fastrestapis.fasturl.cloud/aiexperience/screenshottocode?imageUrl=${uploadedImageUrl}`;

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        document.querySelector(".div-skeleton").remove();
        let messageElement = document.getElementById("result");

        // Membuat elemen <pre> dan <code>
        let preContainer = document.createElement("pre");
        let codeContainer = document.createElement("code");
        let imgContainer = document.createElement("img");
        let headerResult = document.createElement("h2");
        let codePreviewText = document.createElement("span");
        let copyButton = document.createElement("button");
        let previewContainer = document.createElement("div");

        imgContainer.src = data.result.previewImage;
        headerResult.innerHTML = "Image Preview";
        headerResult.classList.add("text-lg", "font-semibold", "mb-2");
        codeContainer.classList.add("language-html");
        codeContainer.id = "code";
        codeContainer.textContent = data.result.code;

        codePreviewText.innerHTML = "Code preview";
        codePreviewText.classList.add("text-lg", "font-semibold", "mb-2", "mr-2");

        copyButton.innerHTML = "Copy";
        copyButton.classList.add("copy-button", "ml-2", "px-2", "py-1", "border", "border-gray-400", "text-current", "rounded-lg");
        copyButton.addEventListener("click", () => {
            navigator.clipboard.writeText(data.result.code).then(() => {
                alert("Code copied to clipboard!");
            }).catch(err => {
                console.error("Failed to copy code: ", err);
            });
        });

        previewContainer.classList.add("flex", "items-center", "justify-between", "mb-2", "mt-4");
        previewContainer.appendChild(codePreviewText);
        previewContainer.appendChild(copyButton);

        preContainer.appendChild(codeContainer);
        messageElement.appendChild(headerResult);
        messageElement.appendChild(imgContainer);
        messageElement.appendChild(previewContainer);
        messageElement.appendChild(preContainer);

        Prism.highlightAll();
    } catch (error) {
        console.error('Error:', error);
        document.querySelector(".div-skeleton").remove();
        let messageElement = document.getElementById("result");
        messageElement.textContent = "Something went wrong.";
    }

    function typeText(element, text, delay = 20) {
        const words = text.split(' ');
        let index = 0;
        let currentHTML = '';

        function type() {
            if (index < words.length) {
                currentHTML += words[index] + ' ';
                element.textContent = currentHTML;
                index++;
                setTimeout(type, delay);
            }
        }
        type();
    }
}
