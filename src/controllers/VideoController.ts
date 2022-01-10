import {
    // Body,
    Controller,
    Get,
    Path,
    Query,
    Route,
    // SuccessResponse,
} from "tsoa";

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
                let fileData = await this.generateAndConvertScreenshot(timestamp, videoUrl);
                return fileData;
            }catch(err: any){
                console.log(err);
                return { errorMsg: 'Something went wrong!', error: err};
            }
        }
    }

    //absatracted service call for generation flow
    private async generateAndConvertScreenshot(timestamp: string, videoUrl: string){
        try{
            let extractedData = await new VideoService().generateScreenshot(parseInt(timestamp), videoUrl);
            let convertedFile = await new FileService().convertPNGToBase64((extractedData as {msg: string, filename: string})['filename']);
            return convertedFile;
        }catch(error: any){
            throw {errorMsg: 'Something went wrong', error: error};
        }
    }
}