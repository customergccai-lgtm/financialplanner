/*************************************************
 * FINPLAN PRO - CAMERA SCANNER
 * OCR Receipt Scanner with Tesseract.js
 * Version: 9.1 PWA
 *************************************************/

class ReceiptScanner {
  constructor() {
    this.video = null;
    this.canvas = null;
    this.stream = null;
  }

  // Initialize camera
  async initCamera() {
    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera tidak didukung di browser ini');
      }

      // Request camera permission
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      return this.stream;
    } catch (error) {
      console.error('Camera error:', error);
      throw new Error('Gagal mengakses kamera: ' + error.message);
    }
  }

  // Capture photo from video stream
  capturePhoto(videoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.9);
  }

  // Stop camera
  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  // Process image with OCR (placeholder - will use Tesseract.js)
  async processReceipt(imageDataUrl) {
    // For now, return mock data
    // In production, integrate with Tesseract.js or Google Vision API
    return {
      total: 0,
      items: [],
      merchant: '',
      date: new Date().toISOString().split('T')[0]
    };
  }
}

// Export for use in main app
window.ReceiptScanner = ReceiptScanner;
