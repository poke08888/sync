document.addEventListener('DOMContentLoaded', () => {
    // Basic navigation active state handling is done via class in HTML for simplicity in this static build.
    // However, we can add some interactions for buttons.

    // Date Filter Logic (Visual only)
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from siblings
            const parent = this.parentElement;
            parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Add to clicked
            this.classList.add('active');
        });
    });

    // File Upload Placeholder Interaction
    const uploadZone = document.querySelector('div[style*="border: 2px dashed"]');
    if (uploadZone) {
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.style.background = 'rgba(255, 255, 255, 0.05)';
            uploadZone.style.borderColor = 'var(--primary-color)';
        });

        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.style.background = 'rgba(255, 255, 255, 0.02)';
            uploadZone.style.borderColor = 'var(--glass-border)';
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.style.background = 'rgba(255, 255, 255, 0.02)';
            uploadZone.style.borderColor = 'var(--glass-border)';
            alert('Tính năng upload chưa được kết nối với backend!');
        });
    }

    // Form Submission Placeholder
    const form = document.getElementById('koc-form');
    if (form) {
        const submitBtn = form.querySelector('.btn-primary');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                alert('Đã lưu thông tin KOC (Mô phỏng)!');
                form.reset();
            });
        }
    }
});
