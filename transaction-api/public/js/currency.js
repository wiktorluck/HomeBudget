document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('currencyForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const amount = document.getElementById('amount').value;
        const fromCurrency = document.getElementById('fromCurrency').value.toUpperCase();
        const toCurrency = document.getElementById('toCurrency').value.toUpperCase();

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
