// İletişim sayfası işlevselliği
document.addEventListener('DOMContentLoaded', function() {
    // İletişim formu
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form verilerini al
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Formu gönder (gerçek uygulamada sunucuya gönder)
            console.log('Form gönderildi:', formData);
            
            // Başarı mesajı göster
            alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
            
            // Formu temizle
            contactForm.reset();
        });
    }
    
    // SSS (Sıkça Sorulan Sorular)
    setupFAQ();
});

// SSS işlevselliği
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Tüm soruları kapat
            document.querySelectorAll('.faq-question').forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = null;
            });
            
            // Eğer tıklanan soru aktif değilse, aç
            if (!isActive) {
                this.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}
