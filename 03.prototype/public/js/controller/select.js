(() => {

    const electron = require( 'electron' )
    const domify = require('domify')
    const {desktopCapturer, ipcRenderer} = electron
    const captureList = document.getElementById('captureList')
    console.log('captureList', captureList)
    desktopCapturer.getSources({types: ['window', 'screen']}, (err, sources) => {
        
        if (err) {
            throw err
        }

        for (let source of sources) {
            
            let thumb = source.thumbnail.toDataURL()
            if (!thumb) continue
            let title = source.name
            let el = domify(`
            <li><a href="#"><img src="${thumb}"><span>${title}</span></a></li>
            `)

            captureList.appendChild(el)
        }

        let links = captureList.querySelectorAll('a')
        
        for (let i = 0; i < links.length ; i ++) {

            links[i].onclick = (function (index) {
                return function (e) {
                    e.preventDefault()
                    console.log('zzzzzzzzzzz')
                    ipcRenderer.send('capture-control', {
                        command: 'capture:done',
                        id: sources[index].id,
                        title: sources[index].name
                    })
                 }
             })(i)
        }

        // for (let i = 0; i < sources.length; ++i) {
        //   console.log('sources[i].name', sources[i])
        //   if (sources[i].name === '카카오톡') {
        //     navigator.mediaDevices.getUserMedia({
        //       audio: false,
        //       video: {
        //         mandatory: {
        //           chromeMediaSource: 'desktop',
        //           chromeMediaSourceId: sources[i].id,
        //           minWidth: 500,
        //           maxWidth: 500,
        //           minHeight: 720,
        //           maxHeight: 720
        //         }
        //       }
        //     })
        //     .then((stream) => handleStream(stream))
        //     .catch((e) => handleError(e))
        //     return
        //   }
        // }
      });    
})()