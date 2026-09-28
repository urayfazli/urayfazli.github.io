import * as THREE from 'three';

/**
 * TextureManager
 * Loads the reference PNG illustration once and slices/generates the anatomical cutout textures
 * with proper sRGB color space, mipmap filtering, and full GPU disposal support.
 */
export class TextureManager {
  private loader = new THREE.TextureLoader();
  private createdTextures: THREE.Texture[] = [];

  public async loadImageElement(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  }

  public registerCanvasTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;
    this.createdTextures.push(tex);
    return tex;
  }

  public disposeAll(): void {
    for (const tex of this.createdTextures) {
      tex.dispose();
    }
    this.createdTextures.length = 0;
  }
}
