import { exec } from "child_process";

export class VideoService{
    public async generateScreenshot(seconds: number, url: string){
        //Promise wrapper for child process exec call because default only supports callbacks
        let result = await new Promise((resolve, reject) => {
            let fileName = Date.now();
            /**
             * Strangely, 
             * when i run arch command on my mac, it gives me i386
             * when i run os.arch here in the node app on my mac, then it gives me x64
             * when i run os.arch in the node app on the docker image, then it gives me x64
             * but
             * when i run ffmpeg_i386 on my local either directly on the terminal or through the node app then it works but doesnt work on the docker image
             * and when i run ffmpeg_x86_64 on the docker image then it works but doesnt work on my local directly or through the node app
             */
            exec(`ffmpeg/ffmpeg_x86_64 -ss ${seconds} -i ${url} -frames:v 1 -codec:v png -an screenshots/${fileName}.png`, (error, stdout, stderr) => {
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
                        return resolve({ filename: `screenshots/${fileName}.png` });
                    }
                }
            });
        });
        return result;
    }
}