import { uploadImage } from './services/uploadService';
import { saveBufferAsFile } from './utils/fileHandling';

const createInterface = () => {
  const container = document.createElement('div');
  container.style.cssText = `
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  `;

  const controls = document.createElement('div');
  controls.style.cssText = 'margin: 20px 0;';
  controls.innerHTML = `
    <div style="margin-bottom: 20px;">
      <button id="pickImage" style="margin-right: 10px; padding: 8px 16px;">Pick Image</button>
      <input type="file" id="fileInput" accept="image/*" style="display: none;">
      <label style="margin-left: 20px;">Quality (1-100): 
        <input type="number" id="quality" value="80" min="1" max="100" style="width: 60px;">
      </label>
      <label style="margin-left: 10px;">Format: 
        <select id="format">
          <option value="jpeg">JPEG</option>
          <option value="png">PNG</option>
          <option value="webp">WebP</option>
        </select>
      </label>
    </div>
  `;

  const previewContainer = document.createElement('div');
  previewContainer.style.cssText = `
    display: flex;
    gap: 20px;
    margin: 20px 0;
  `;

  const originalPreview = document.createElement('div');
  originalPreview.innerHTML = `
    <h3>Original Image</h3>
    <img id="originalImg" style="max-width: 350px; max-height: 350px; display: none;">
    <div id="originalStats"></div>
  `;

  const compressedPreview = document.createElement('div');
  compressedPreview.innerHTML = `
    <h3>Compressed Image</h3>
    <img id="compressedImg" style="max-width: 350px; max-height: 350px; display: none;">
    <div id="compressedStats"></div>
    <button id="downloadBtn" style="margin-top: 10px; padding: 8px 16px; display: none;">Download Compressed Image</button>
  `;

  previewContainer.appendChild(originalPreview);
  previewContainer.appendChild(compressedPreview);

  const console = document.createElement('div');
  console.innerHTML = `
    <h3>Compression Results</h3>
    <pre id="compressionLog" style="
      background: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
      max-height: 200px;
      overflow-y: auto;
    "></pre>
  `;

  container.appendChild(controls);
  container.appendChild(previewContainer);
  container.appendChild(console);
  document.body.appendChild(container);
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const logResult = (message: string) => {
  const log = document.getElementById('compressionLog') as HTMLPreElement;
  const timestamp = new Date().toLocaleTimeString();
  log.innerHTML = `[${timestamp}] ${message}\n` + log.innerHTML;
};

const updateImageStats = (
  id: string,
  size: number,
  dimensions?: { width: number; height: number }
) => {
  const stats = document.getElementById(id) as HTMLDivElement;
  let info = `Size: ${formatBytes(size)}`;
  if (dimensions) {
    info += `<br>Dimensions: ${dimensions.width}x${dimensions.height}`;
  }
  stats.innerHTML = info;
};

const handleFileUpload = async (file: File) => {
  try {
    const originalImg = document.getElementById('originalImg') as HTMLImageElement;
    originalImg.style.display = 'block';
    originalImg.src = URL.createObjectURL(file);

    await new Promise((resolve) => {
      originalImg.onload = resolve;
    });

    updateImageStats('originalStats', file.size, {
      width: originalImg.naturalWidth,
      height: originalImg.naturalHeight
    });

    const quality = parseInt((document.getElementById('quality') as HTMLInputElement).value);
    const format = (document.getElementById('format') as HTMLSelectElement).value as 'jpeg' | 'png' | 'webp';

    const startTime = performance.now();
    const compressedImage = await uploadImage(file, { quality, format });
    const endTime = performance.now();

    const compressedImg = document.getElementById('compressedImg') as HTMLImageElement;
    compressedImg.style.display = 'block';
    const compressedBlob = new Blob([compressedImage]);
    compressedImg.src = URL.createObjectURL(compressedBlob);

    const downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;
    downloadBtn.style.display = 'block';
    downloadBtn.onclick = () => {
      const outputFilename = `compressed-${file.name.split('.')[0]}.${format}`;
      saveBufferAsFile(compressedImage, outputFilename);
    };

    await new Promise((resolve) => {
      compressedImg.onload = resolve;
    });

    updateImageStats('compressedStats', compressedBlob.size, {
      width: compressedImg.naturalWidth,
      height: compressedImg.naturalHeight
    });

    const compressionRatio = ((1 - compressedBlob.size / file.size) * 100).toFixed(2);
    const processingTime = (endTime - startTime).toFixed(2);
    
    logResult(
      `Compression complete:\n` +
      `Original: ${formatBytes(file.size)}\n` +
      `Compressed: ${formatBytes(compressedBlob.size)}\n` +
      `Reduction: ${compressionRatio}%\n` +
      `Processing time: ${processingTime}ms`
    );
  } catch (error) {
    logResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error('Failed to compress image:', error);
  }
};

if (typeof window !== 'undefined') {
  createInterface();
  
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  const pickImageBtn = document.getElementById('pickImage') as HTMLButtonElement;
  
  pickImageBtn.onclick = () => {
    fileInput.click();
  };
  
  fileInput.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };
}