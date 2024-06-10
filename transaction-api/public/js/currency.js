document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('currencyForm');

    // Load saved currencies from local storage
    const savedFromCurrency = localStorage.getItem('fromCurrency');
    const savedToCurrency = localStorage.getItem('toCurrency');

    if (savedFromCurrency) {
        document.getElementById('fromCurrency').value = savedFromCurrency;
    }
    if (savedToCurrency) {
        document.getElementById('toCurrency').value = savedToCurrency;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const amount = document.getElementById('amount').value;
        const fromCurrency = document.getElementById('fromCurrency').value.toUpperCase();
        const toCurrency = document.getElementById('toCurrency').value.toUpperCase();

        // Save currencies to local storage
        localStorage.setItem('fromCurrency', fromCurrency);
        localStorage.setItem('toCurrency', toCurrency);

        fetch(`/api/convert?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    document.getElementById('result').textContent = data.error;
                } else {
                    document.getElementById('result').textContent = `${amount} ${fromCurrency} = ${data.result} ${toCurrency}`;
                }
            })
            .catch(error => console.error('Error:', error));
    });
});
