const fs = require('fs')

let images = [
    "series_6.png",
    "message-square.png",
    "pngwing-1.png",
    "pngwыing-1.png",
    "percent.png",
    "pфngegg-1.png",
    'logo.png',
    'search-icon.png',
    "cart.png",
    "compare.png",
    "like.png",
    "eye.png",
    'Frame-50.png',
    'menu-icon.png',
    'cart-niz.png',
    "search-icon-niz.png",
    "more.png",
    "icons-for-menu.png",
    "icons-for-menu-(1).png",
    "icons-for-menu-(2).png",
    "icons-for-menu-(3).png",
    "icons-for-menu-(4).png",
    "icons-for-menu-(5).png",
    "icons-for-menu-(6).png",
    "icons-for-menu-(7).png",
    "icons-for-menu-(8).png",
    "icons-for-menu-(9).png",
    "icons-for-menu-(10).png",
    "twitter.png",
    "facebook.png",
    "vk.png",
    "instagram.png",
    "aqua.png",
    "image-18.png",
    'star.png',
    'star-silver.png',
    'img.png',
    'Rectangle61.png',
    'Rectangle611.png',
    'Rectangle612.png',
    'avatar.png',
    'shipping.png',
    'purse.png',
    'delete.png',
    'icon-more.png',
    'image49.png',
    'pngwыing-1.png',
    'percent.png',
    'pфngegg-1.png',
    'pngwing-1.png',
    'x.png'
]

images = images.filter((item, index) => images.indexOf(item) == index).map((item, index) => {
    return {
        method: 'get',
        path: '/images/' + item,
        arrow: (req, res) => {
            const url = new URL('http://localhost' + req.url)
            const filename = url.pathname.split('/')[url.pathname.split('/').length - 1]
            fs.createReadStream('./src/img/' + filename).pipe(res)
        }
    }
}
)

module.exports = [...images]