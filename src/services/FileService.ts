import {promises as fs} from "fs";

export class FileService{
    public async convertPNGToBase64(fileName: string){
        let rawFile = await fs.readFile(fileName, 'base64');
        fs.unlink(fileName);
        return {file: "data:image/png;base64," + rawFile};
    }
}