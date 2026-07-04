// useFFmpeg.js
import { ref } from 'vue'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

const ffmpeg = new FFmpeg()
const loaded = ref(false)
const progress = ref(0)
const currentTime = ref('00:00:00')

export function useFFmpeg() {
  const load = async () => {
    if (loaded.value) return

    const baseURL = 'esm'

    ffmpeg.on('log', ({ message }) => {
      console.log('FFmpeg log:', message)
      console.log('progress', progress.value)
      const match = message.match(/time=(\d{2}:\d{2}:\d{2}\.\d{2})/)
      if (match) {
        const time = match[1].split(':')
        currentTime.value = parseFloat(time[0]) * 60 * 60 + parseFloat(time[1]) * 60 + parseFloat(time[2])
      }
    })
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      // workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
    })
    console.log(2)
    loaded.value = true
  }

  // 通用压缩：输入文件，输出最大宽度、码率，返回 Blob，endTime必须穿
  const compressVideo = async (file, startTime = 0, endTime = 0) => {
    if (!loaded.value) await load()

    const inputName = 'input' + getExtension(file.name)
    const outputName = 'output.mp4'

    // 写入虚拟文件系统
    ffmpeg.writeFile(inputName, await fetchFile(file))

    // 参数
    const args = ['-i', inputName]
    if (startTime != '') {
      args.push('-ss', startTime.toString())
    }
    if (endTime != '') {
      args.push('-to', endTime.toString())
    }
    args.push(
      '-c:v',
      'libx264',
      '-crf',
      '23',
      '-r',
      '30',
      '-c:a',
      'copy',
      '-preset',
      'veryfast', // 编码速度
      '-movflags',
      '+faststart', // 网页快速播放
      outputName,
    )

    // 重置进度，-1代表未开始转码
    progress.value = 0
    currentTime.value = 0
    // 解析预期总时长（秒），用于计算百分比
    let totalDurationSec = 0
    totalDurationSec = endTime - startTime
    // 启动进度定时器，基于日志解析当前时间
    const updateProgress = () => {
      if (totalDurationSec > 0 && currentTime.value !== '0') {
        const currentSec = currentTime.value
        const pct = Math.min(100, Math.round((currentSec / totalDurationSec) * 100))
        progress.value = pct
      }
    }
    const progressTimer = setInterval(updateProgress, 200)

    // FFmpeg 命令：等比缩放、指定码率、用 H.264 编码
    await ffmpeg.exec(args)

    clearInterval(progressTimer)
    progress.value = 100 // 完成

    // 读取输出文件
    const data = await ffmpeg.readFile(outputName)
    // 删除临时文件，释放内存
    ffmpeg.deleteFile(inputName)
    ffmpeg.deleteFile(outputName)

    return new File([data], 'output.mp4', { type: 'video/mp4' })
  }

  return {
    loaded,
    progress,
    load,
    compressVideo,
  }
}

function getExtension(filename) {
  const i = filename.lastIndexOf('.')
  return i > 0 ? filename.substring(i) : '.mp4'
}
