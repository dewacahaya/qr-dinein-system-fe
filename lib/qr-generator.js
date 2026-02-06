import templatePath from '@/assets/images/border-qr.png';

export const generatePrintableQr = (qrBlobUrl, tableName) => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const templateImg = new Image();
        const qrImg = new Image();

        templateImg.src = templatePath;

        templateImg.onload = () => {
            canvas.width = templateImg.width;
            canvas.height = templateImg.height;

            ctx.drawImage(templateImg, 0, 0);

            qrImg.src = qrBlobUrl;
            qrImg.onload = () => {
                const qrSize = 500;
                const qrX = (canvas.width - qrSize) / 2;
                const qrY = 375;

                ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

                ctx.font = 'bold 40px Poppins, sans-serif';
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';

                ctx.fillText(tableName, canvas.width / 2, qrY + qrSize + 100);

                const finalImageUrl = canvas.toDataURL('image/png');
                resolve(finalImageUrl);
            };

            qrImg.onerror = (err) => reject("Gagal memuat QR Code: " + err);
        };

        templateImg.onerror = (err) => reject("Gagal memuat Template: " + err);
    });
};