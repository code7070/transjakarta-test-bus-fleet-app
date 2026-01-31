export const getErrorMessage = (error: Error): string => {
  const message = error.message.toLowerCase();
  
  const errorMap: Record<string, string> = {
    'network error': 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
    'failed to fetch': 'Gagal mengambil data dari server. Periksa koneksi Anda.',
    'rate limit': 'Terlalu banyak permintaan. Silakan tunggu sebentar sebelum mencoba lagi.',
    'server error': 'Server sedang mengalami gangguan. Silakan coba lagi nanti.',
    'timeout': 'Permintaan waktu habis. Silakan coba lagi.',
    '404': 'Data tidak ditemukan.',
    '500': 'Terjadi kesalahan internal pada server MBTA.',
  };

  for (const [key, value] of Object.entries(errorMap)) {
    if (message.includes(key)) {
      return value;
    }
  }

  // Default fallback
  return 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.';
};