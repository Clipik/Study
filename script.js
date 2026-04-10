const modelSelect = document.querySelector('#model');
const inputText = document.querySelector('#input-text');
const webSearch = document.querySelector('#web-search');
const btn = document.querySelector('button');
const resultOutput = document.querySelector('#result');
const neuronPrice = 0.004;
const markup = 1.15;
const mTokens = 1000000;

btn.addEventListener('click', () => {
    let total = 0;
    let in_price = 0;
    let out_price = 0;
    let web_price = 0;
    let fixed_price = 0;
    let fallback_price = 0;
    let neuron = 0;

    if (modelSelect.value === 'ChatGPT 5.4 Pro') {
        in_price = 31.5;
        out_price = 189;
        web_price = 0.0105;
    }
    else if (modelSelect.value === 'ChatGPT 5.4') {
        in_price = 2.625;
        out_price = 15.75;
        web_price = 0.0105;
    }
    else if (modelSelect.value === 'ChatGPT 5.2 Pro') {
        in_price = 44.10;
        out_price = 352.8;
        web_price = 0;
    }
    else if (modelSelect.value === 'ChatGPT 5.3 Chat') {
        in_price = 1.837;
        out_price = 14.7;
        web_price = 0.105;
    }
    else if (modelSelect.value === 'Gemini 3.1 Pro') {
        in_price = 4.20;
        out_price = 25.2;
        web_price = 0;
    }
    else if (modelSelect.value === 'Gemini 3 Flash') {
        in_price = 1.05;
        out_price = 6.3;
        web_price = 0;
    }

    else if (modelSelect.value === 'Nano Banana Pro') {
        fixed_price = 80;
        web_price = 0;
    }
    else if (modelSelect.value === 'Nano Banana 2') {
        fixed_price = 25;
        web_price = 0;
    }

    else if (modelSelect.value === 'Kling 2.6 Pro') {
        fallback_price = 0.91;
        web_price = 0;
    }
    else if (modelSelect.value === 'Sora 2') {
        fallback_price = 1.04;
        web_price = 0;
    }
    else if (modelSelect.value === 'Veo 3.1 Fast') {
        fallback_price = 1.04;
        web_price = 0;
    }
    else if (modelSelect.value === 'LTXV 2 Fast') {
        fallback_price = 0.3;
        web_price = 0;
    }

    else if (modelSelect.value === 'Kling 2.6 Pro I2V') {
        fallback_price = 0.455;
        web_price = 0;
    }
    else if (modelSelect.value === 'Sora 2 I2V') {
        fallback_price = 0.65;
        web_price = 0;
    }
    else if (modelSelect.value === 'Veo 3.1 Fast I2V') {
        fallback_price = 1.04;
        web_price = 0;
    }

    if (in_price > 0) {
        const tokensIn = inputText.value.length * 1.3;
        const tokensOut = 500;

        let costInUsd = (tokensIn * in_price) / mTokens;
        let costOutUsd = (tokensOut * out_price) / mTokens;
        let currentWebPrice = webSearch.checked ? web_price : 0; // нейронка открыла мне простой способ записи if else

        neuron = Math.ceil((costInUsd +costOutUsd + currentWebPrice) / neuronPrice);
    }

    else if (fixed_price > 0) {
        neuron = fixed_price;
    }

    else if (fallback_price > 0) {
        neuron = Math.ceil((fallback_price * markup) / neuronPrice);
    }

    resultOutput.textContent = neuron;

    const rubRate = 0.5;
    const rubResult = (neuron * rubRate).toFixed(2);

    document.querySelector('#rubles').textContent = rubResult;
});