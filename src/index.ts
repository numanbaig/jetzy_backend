import connectDB from './config/db.ts'
import app from './app.ts'
import { API_VERSION_PREFIX } from './utils/constants.ts';


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port  : ${process.env.PORT}`);
        console.log(`API Base URL: http://localhost:${process.env.PORT}${API_VERSION_PREFIX}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

