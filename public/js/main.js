document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('verificationForm');
    const resultDiv = document.getElementById('result');

    // Tarih formatı için maskeleme
    const dogumTarihiInput = document.getElementById('dogumTarihi');
    dogumTarihiInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 2) {
                value = value;
            } else if (value.length <= 4) {
                value = value.slice(0, 2) + '.' + value.slice(2);
            } else {
                value = value.slice(0, 2) + '.' + value.slice(2, 4) + '.' + value.slice(4, 8);
            }
        }
        e.target.value = value;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            tckn: document.getElementById('tckn').value,
            ad: document.getElementById('ad').value,
            soyad: document.getElementById('soyad').value,
            dogumTarihi: document.getElementById('dogumTarihi').value
        };

        try {
            resultDiv.innerHTML = '<p class="loading">Doğrulama yapılıyor...</p>';
            
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (data.success) {
                resultDiv.innerHTML = `
                    <p class="success">${data.data.message}</p>
                    <div class="result-details">
                        <p><strong>TC Kimlik No:</strong> ${data.data.tckn}</p>
                        <p><strong>Ad:</strong> ${data.data.ad}</p>
                        <p><strong>Soyad:</strong> ${data.data.soyad}</p>
                        <p><strong>Doğum Tarihi:</strong> ${data.data.dogumTarihi}</p>
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `<p class="error">${data.message}</p>`;
            }
        } catch (error) {
            console.error('Hata:', error);
            resultDiv.innerHTML = '<p class="error">Bir hata oluştu. Lütfen tekrar deneyin.</p>';
        }
    });
}); 