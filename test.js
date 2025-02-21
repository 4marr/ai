const API_URL = "https://itzpire.com/ai/chat-gpt";
const payload = {
    message: [
        {
            "role": "assistant",
            "content": "Hello! How can I assist you today? 😊"
        },
        {
            "role": "user",
            "content": "How are you?"
        }
    ],
        query: "Hi Gpt",
        model: "gpt-4"
    };
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
            console.log(data)
        })
        .catch(error => {
            console.error('Error:', error);
            console.log(payload)
        })
