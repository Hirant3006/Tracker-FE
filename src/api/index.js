let api = {}
let context = require.context('./', true, /\.js$/)

context.keys().forEach((filename)=>{
    if (filename === "./index.js") return
    let obj = context(filename).default || {}
    api = {...api, ...obj}
})

export default api