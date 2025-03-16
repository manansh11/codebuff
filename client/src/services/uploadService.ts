export interface CompressionOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export const uploadImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<Uint8Array> => {
  const formData = new FormData();
  formData.append('image', file);
  
  // Add compression options to form data
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  const response = await fetch('http://localhost:3001/api/compress', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to compress image');
  }

  return new Uint8Array(await response.arrayBuffer());
};