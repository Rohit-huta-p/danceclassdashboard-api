 const localCookieConfig = {
    httpOnly: true

}
 const productionCookieConfig = {

    secure: true, // Set to true if using HTTPS
    sameSite: 'None', // Adjust according to your cross-site requirements
}


const corsConfigProduction = {
    origin: 'https://studioflowie.vercel.app',
    credentials: true,
}

const corsConfigLocal = {
    origin: 'http://localhost:3000',
    credentials: true,
}

module.exports = {localCookieConfig, productionCookieConfig,corsConfigProduction,corsConfigLocal}