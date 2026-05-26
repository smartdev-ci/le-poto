/**
 * QR Code Generator using external API
 * API: https://api.qrserver.com/v1/create-qr-code/
 */

interface QRCodeOptions {
  size?: number
  bgcolor?: string
  color?: string
}

export function useQRCode() {
  const API_BASE = 'https://api.qrserver.com/v1/create-qr-code/'

  /**
   * Generate QR code URL from data
   */
  function generateQRUrl(data: string, options: QRCodeOptions = {}): string {
    const {
      size = 200,
      bgcolor = 'ffffff',
      color = '000000'
    } = options

    const params = new URLSearchParams({
      size: `${size}x${size}`,
      data: data,
      bgcolor: bgcolor,
      color: color
    })

    return `${API_BASE}?${params.toString()}`
  }

  /**
   * Generate QR code image element
   */
  async function generateQRImage(
    data: string,
    options: QRCodeOptions = {}
  ): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = generateQRUrl(data, options)
    })
  }

  /**
   * Draw QR code on canvas
   */
  async function drawQRCode(
    canvas: HTMLCanvasElement,
    data: string,
    options: QRCodeOptions = {}
  ): Promise<void> {
    const { size = 200 } = options

    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    try {
      const img = await generateQRImage(data, options)
      ctx.drawImage(img, 0, 0, size, size)
    } catch (error) {
      console.error('Failed to load QR code:', error)
      // Fallback: draw placeholder
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = '#000000'
      ctx.font = '14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('QR Error', size / 2, size / 2)
    }
  }

  /**
   * Generate QR code as data URL
   */
  async function generateDataURL(data: string, options: QRCodeOptions = {}): Promise<string> {
    const canvas = document.createElement('canvas')
    await drawQRCode(canvas, data, options)
    return canvas.toDataURL('image/png')
  }

  return {
    generateQRUrl,
    generateQRImage,
    drawQRCode,
    generateDataURL
  }
}
