const axios = require('axios');
const {
    v4: uuidv4
} = require('uuid');

class CliptoAI {
    ytdl = async function ytdl(url) {
        try {
            const response = await axios.post('https://www.clipto.com/api/youtube', {
                url
            }, {
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'content-type': 'application/json',
                    'origin': 'https://www.clipto.com',
                    'referer': 'https://www.clipto.com/id/media-downloader/youtube-downloader',
                    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    transcript = async function transcript(input) {
        try {
            const sessionID = uuidv4();

            const downloadResponse = await axios.get('https://qnb7f6zqfubygjhvqljnsgco3u0uuxmb.lambda-url.us-west-1.on.aws/', {
                params: {
                    session_id: sessionID,
                    video_url: input,
                    is_trial: 1
                },
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Origin': 'https://www.clipto.com',
                    'Referer': 'https://www.clipto.com/',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36'
                }
            });

            if (!downloadResponse.data?.success) throw new Error('Download failed');

            const addTaskResponse = await axios.post('https://www.clipto.com/clipto-api/asrtask/addTrialTask', {
                urlType: 2,
                sessionID,
                url: downloadResponse.data.target,
                isCut: false,
                isNoVad: "",
                objectProvider: 2
            }, {
                headers: {
                    'authority': 'www.clipto.com',
                    'content-type': 'application/json',
                    'origin': 'https://www.clipto.com',
                    'referer': 'https://www.clipto.com/id/transcribe-audio-video-to-text-free'
                }
            });

            if (!addTaskResponse.data?.data?.taskID) throw new Error('Task creation failed');

            let retries = 3;
            let taskResult;

            while (retries-- > 0) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                taskResult = await axios.post('https://www.clipto.com/clipto-api/asrtask/getTrialTask', {
                    taskID: addTaskResponse.data.data.taskID
                }, {
                    headers: {
                        'authority': 'www.clipto.com',
                        'content-type': 'application/json',
                        'origin': 'https://www.clipto.com'
                    }
                });
                if (taskResult.data?.data?.status === 2) break;
            }

            const speakers = JSON.parse(taskResult.data.data.speakers);
            return speakers[0].text;

        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new CliptoAI();