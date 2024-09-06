import jwt from 'jsonwebtoken';
export let IsAuthenticated = async (req, res, next) => {
    try {
        let token = req.cookies.uid

        if (!token) {
            return res.status(401).json({
                massage: "token is missing",
                success: false
            })
        }

        // token hai to sahi hai ya nahi check karo
        let decode = await jwt.verify(token, process.env.JWT_SECRET)

        if (!decode) {
            return res.status(401).json({
                massage: "token is not matched",
                success: false
            })
        }

        // every thing is right then set userId = req.id
       req.id = decode.userId 
        next()
    } catch (error) {
        console.log(error);
    }
}