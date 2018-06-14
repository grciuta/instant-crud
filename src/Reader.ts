import * as fs from 'fs';

export class Reader {
    private static fileData: any = null;

    static __bindFile(path: string): boolean {
        if (fs.existsSync(path)) {
            this.fileData = JSON.parse(fs.readFileSync(path, 'utf8'));

            if (this.fileData) { return true; }
        }

        return false;
    }

    static __get(slug: string): any {
        if (this.fileData && this.fileData.hasOwnProperty(slug)) {
            return this.fileData[slug];
        } else if (this.fileData && !slug) {
            return this.fileData;
        }

        return null;
    }

    static __get_full(): any {
        return this.fileData;
    }
}