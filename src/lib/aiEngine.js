// In-browser LLM via WebLLM (MLC). No API keys, no server, no per-token cost —
// a real model runs on the user's device (WebGPU). Loaded lazily as a separate chunk.

let enginePromise = null
let chosenModel = null

export function webgpuAvailable() {
  return typeof navigator !== 'undefined' && 'gpu' in navigator
}

// Pick a small instruct model from WebLLM's prebuilt list (robust to id changes).
function pickModel(webllm) {
  const ids = (webllm.prebuiltAppConfig?.model_list || []).map((m) => m.model_id)
  const prefer = [
    'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
  ]
  for (const p of prefer) if (ids.includes(p)) return p
  return ids.find((id) => /1B-Instruct/i.test(id)) || ids.find((id) => /Instruct/i.test(id)) || ids[0]
}

export async function getEngine(onProgress) {
  if (!webgpuAvailable()) throw new Error('WebGPU не поддерживается этим браузером')
  if (!enginePromise) {
    enginePromise = (async () => {
      const webllm = await import('@mlc-ai/web-llm')
      chosenModel = pickModel(webllm)
      return webllm.CreateMLCEngine(chosenModel, {
        initProgressCallback: (r) => onProgress && onProgress(r),
      })
    })().catch((e) => {
      enginePromise = null // allow retry
      throw e
    })
  }
  return enginePromise
}

export function modelName() {
  return chosenModel
}

export async function chat(messages, onProgress) {
  const engine = await getEngine(onProgress)
  const res = await engine.chat.completions.create({ messages, temperature: 0.6, max_tokens: 512 })
  return res.choices?.[0]?.message?.content || ''
}
