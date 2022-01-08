import { exec } from "child_process";

export class VideoService{
    public async generateScreenshot(seconds: number, url: string){
        //Promise wrapper for child process exec call because default only supports callbacks
        let result = await new Promise((resolve, reject) => {
            let fileName = Date.now();
            exec(`ffmpeg/ffmpeg -ss ${seconds} -i ${url} -frames:v 1 -codec:v png -an screenshots/${fileName}.png`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return reject({error: error, errorMsg: 'Something went wrong'});
                }else{
                    // handling error when the the number of given seconds exceeds the number of seconds of the video length
                    if(stderr.indexOf('Output file is empty') > -1){
                        console.log('file could not be generated', seconds, url)
                        console.log(`stderr: ${stderr}`);
                        return resolve({errorMsg: 'Please check if the number of seconds given is > the number of seconds of the video'});
                    }else{
                        // console.log(`stderr: ${stderr}`);
                        console.log(`stdout: ${JSON.stringify(stdout)}`);
                        return resolve({ msg: 'Generation successful', filename: `screenshots/${fileName}.png` });
                    }
                }
            });
        });
        return result;
    }
}