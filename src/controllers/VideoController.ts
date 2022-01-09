import {
    // Body,
    Controller,
    Get,
    Path,
    Query,
    Route,
    // SuccessResponse,
} from "tsoa";

import {promises as fs} from "fs";

import { VideoService } from '../services/VideoService';
import { FileService } from "../services/FileService";

// http://localhost:8070/ffmpeg/image?timestamp=${TIMESTAMP_IN_SECONDS}&url=${VIDEO_URL}
@Route("ffmpeg/image")
export class VideoController extends Controller{
    /**
     * 
     * looks like 2 query params are not yet implemented in tsoa
     * hence the current implementation is done by considering 1 query param as path variable
     * and the other one as the query param
     * Please see - 
     * https://github.com/lukeautry/tsoa/issues/353
     * https://giters.com/lukeautry/tsoa/issues/900
     * 
     */
    @Get("{timestamp}")
    public async extractImageAtTime(
        @Path() timestamp: string,
        @Query() videoUrl: string
    ): Promise<any> {
        //validation for required fields
        if(!timestamp || !videoUrl){
            return {errorMsg: 'Required details are not present'};
        }else{
            try{
                //if folder exists then proceed with generating the screenshot based on the given values
                await fs.access('screenshots');
                let fileData = await this.generateAndConvertScreenshot(timestamp, videoUrl);
                return fileData;
            }catch(err: any){
                //if error results because of folder not existing then create folder and proceed with generating the screenshot based on the given values
                //else handle the error through an error message
                if(err['code'] === 'ENOENT'){
                    console.log('Folder doesnt exist. Creating...');
                    await fs.mkdir('screenshots');
                    console.log('Folder created');
                    let fileData = await this.generateAndConvertScreenshot(timestamp, videoUrl);
                    return fileData;
                }else{
                    console.log(err['code']);
                    return { errorMsg: 'Something went wrong!', error: err};
                }
            }
        }
    }

    //absatracted service call for generation flow so that it can be called from multiple places
    private async generateAndConvertScreenshot(timestamp: string, videoUrl: string){
        try{
            let extractedData = await new VideoService().generateScreenshot(parseInt(timestamp), videoUrl);
            let convertedFile = await new FileService().convertPNGToBase64((extractedData as {msg: string, filename: string})['filename']);
            return convertedFile;
        }catch(error: any){
            throw {errorMsg: 'Something went wrong', error: error};
        }
    }

    // private async convertFileToBase64(fileName: string){
    //     let convertedFile = await new FileService().convertPNGToBase64(fileName);
    //     return convertedFile;
    // }
}