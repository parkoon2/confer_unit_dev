'use strict'

const exec = require('child_process').exec
const spawn = require('child_process').spawn
const platform = process.platform

function deviceCheck(options, callback) {
	if(typeof options === 'function') {
		callback = options;
		options = null;
	} 
	options = options || {};
	const ffmpegPath = options.ffmpegPath || 'ffmpeg';
	const callbackExists = typeof callback === 'function';

	let inputDevice, prefix, audioSeparator, alternativeName, deviceParams;

	switch(platform) {
		case 'win32':
			inputDevice = 'dshow'
			prefix = /\[dshow/
			audioSeparator = /DirectShow\saudio\sdevices/
			alternativeName = /Alternative\sname\s*?\"(.*?)\"/
			deviceParams = /\"(.*?)\"/
			break;
		case 'darwin':
			inputDevice = 'avfoundation'
			prefix = /^\[AVFoundation/
			audioSeparator = /AVFoundation\saudio\sdevices/
			deviceParams = /^\[AVFoundation.*?\]\s\[(\d*?)\]\s(.*)$/
			break;
	}

	const searchPrefix = (line) => (line.search(prefix) > -1)
	const searchAudioSeparator = (line) => isVideo && (line.search(audioSeparator) > -1)
	const searchAlternativeName = (line) => (platform === 'win32') && (line.search(/Alternative\sname/) > -1)

	const videoDevices = []
	const audioDevices = []
	let isVideo = true;

	const execute = (resolve, reject) => {

		console.log(`${ffmpegPath} -f ${inputDevice} -list_devices true -i`)
		// fulfill / reject --> undefined
		const ls = spawn('ffmpeg', [
			'-list_devices', 'true',
			'-f', 'dshow',
			'-i', 'dummy'
		]);ls.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		  });
		  
		  ls.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
		  });
		  
		  ls.on('close', (code) => {
			console.log(`child process exited with code ${code}`);
		  });

			// exec(`@chcp 65001 >nul & cmd /d/s/c ${ffmpegPath} -f ${inputDevice} -list_devices true -i ""`, {'encoding': 'UTF-8'}, (err, stdout, stderr) => {
			// 	console.log('stderr', stderr)
			// 	stderr.split("\n")
			// 		.filter(searchPrefix)
			// 		.forEach((line) => {
			// 			const deviceList = isVideo ? videoDevices : audioDevices
			// 			if(searchAudioSeparator(line)) {
			// 				isVideo = false;
			// 				return;
			// 			}
			// 			if(searchAlternativeName(line)) {
			// 				const lastDevice = deviceList[deviceList.length - 1]
			// 				lastDevice.alternativeName = line.match(alternativeName)[1]
			// 				return;
			// 			} 
			// 			const params = line.match(deviceParams);
			// 			if (params) {
			// 				let device;
			// 				switch(platform) {
			// 					case 'win32':
			// 						device = {
			// 							name: params[1]
			// 						}
			// 						break;
			// 					case 'darwin':
			// 						device = {
			// 							id: parseInt(params[1]),
			// 							name: params[2]
			// 						};
			// 						break
			// 				}
			// 				deviceList.push(device);
			// 			}
			// 		});
	
			// 		//if (audioDevices) checkAudio()
	
			// 	const result = { 
			// 		videoDevices, 
			// 		audioDevices 
			// 	}
	
			// 	if(callbackExists) {
			// 		callback(result);
			// 	} else {
			// 		fulfill(result);
			// 	}
			// });

	};

	if(callbackExists) {
		execute();
	} else {
		return new Promise(execute);
	}
}

module.exports = { 
	deviceCheck,
}