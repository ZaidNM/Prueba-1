import { app } from './app.js'
import { PORT } from './config.js'

app.listen(PORT, () => {
    console.log(`API:   http://localhost:${PORT}/api`)
    console.log(`Docs:  http://localhost:${PORT}/docs`)
})
