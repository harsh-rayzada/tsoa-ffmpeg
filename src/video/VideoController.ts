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

import { VideoService } from './VideoService';

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
                let generationResponse = await this.generateScreenshot(timestamp, videoUrl);
                return generationResponse;
            }catch(err: any){
                //if error results because of folder not existing then create folder and pproceed with generating the screenshot based on the given values
                //else handle the error through an error message
                if(err['code'] === 'ENOENT'){
                    console.log('Folder doesnt exist. Creating...');
                    await fs.mkdir('screenshots');
                    console.log('Folder created');
                    let generationResponse = await this.generateScreenshot(timestamp, videoUrl);
                    return generationResponse;
                }else{
                    console.log(err['code']);
                    return { errorMsg: 'Something went wrong!'};
                }
            }
        }
    }

    //absatracted service call for generation flow so that it can be called from multiple places
    private async generateScreenshot(timestamp: string, videoUrl: string){
        let extractedData = await new VideoService().generateScreenshot(parseInt(timestamp), videoUrl);
        // console.log('extraaaa', extractedData);
        return extractedData;
    }
}