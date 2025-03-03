async function fetchData(query) {
    const url = `https://jazxcode.biz.id/ai/blackbox?query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error, status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

const query = 'hello, how are you?';
fetchData(query)
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    })
