const palette = [
    [255, 255, 255], [228, 228, 228], [136, 136, 136], [34, 34, 34],
    [247, 171, 208], [217, 46, 20], [222, 153, 41], [229, 218, 58],
    [161, 222, 87], [72, 187, 45], [76, 208, 220], [40, 129, 195],
    [0, 0, 228], [198, 115, 224], [122, 20, 125], [155, 108, 70]
];

const imageLoader = document.getElementById('imageLoader');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

imageLoader.addEventListener('change', handleImage);

function handleImage(event) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            applyPalette();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

function applyPalette() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
        let closestColor = findClosestColor([r, g, b]);
        pixels[i] = closestColor[0];
        pixels[i + 1] = closestColor[1];
        pixels[i + 2] = closestColor[2];
    }

    ctx.putImageData(imageData, 0, 0);
}

function findClosestColor(color) {
    let minDist = Infinity, bestMatch = null;
    for (let i = 0; i < palette.length; i++) {
        let d = colorDistance(color, palette[i]);
        if (d < minDist) {
            minDist = d;
            bestMatch = palette[i];
        }
    }
    return bestMatch;
}

function colorDistance(c1, c2) {
    return Math.sqrt((c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2);
}

document.getElementById("downloadBtn").addEventListener("click", function() {
    const link = document.createElement("a");
    link.download = "image_pixelcanvas.png"; 
    link.href = canvas.toDataURL("image/png"); 
    link.click();
});

function updateGlowCircles(dominantColor) {
    const glowLeft = document.getElementById("glow-left");
    const glowRight = document.getElementById("glow-right");

    glowLeft.style.background = dominantColor;
    glowLeft.style.boxShadow = `0 0 60px 30px ${dominantColor}, 0 0 100px 60px rgba(255, 0, 255, 0.5), 0 0 140px 90px rgba(0, 255, 255, 0.5)`;

    glowRight.style.background = dominantColor;
    glowRight.style.boxShadow = `0 0 60px 30px ${dominantColor}, 0 0 100px 60px rgba(255, 255, 0, 0.5), 0 0 140px 90px rgba(0, 0, 255, 0.5)`;
}

const dominantColor = getDominantColor(ctx, canvas.width, canvas.height);
updateGlowCircles(dominantColor);
