import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly defaultPathKey = 'gallia_default_save_path';

  constructor() {}

  getDefaultPath(): string {
    return localStorage.getItem(this.defaultPathKey) || 
           "C:\\Users\\21629\\My Pc\\Desktop\\Gallia";
  }

  setDefaultPath(path: string): void {
    localStorage.setItem(this.defaultPathKey, path);
  }

  validatePath(path: string): boolean {
    return /^[a-zA-Z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*$/.test(path);
  }

  suggestFilename(galliaId: number): string {
    const now = new Date();
    return `Gallia_${galliaId}_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}.png`;
  }
}
