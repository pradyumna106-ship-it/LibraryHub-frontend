function randomColor() {
  return {
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255),
    a: 255
  };
}

export function base64img(width, height, blocks) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  const cellWidth = width / blocks;
  const cellHeight = height / blocks;

  // Generate colors grid
  const colors = [];
  for (let i = 0; i < blocks; i++) {
    colors[i] = [];
    for (let j = 0; j < blocks; j++) {
      colors[i][j] = randomColor();
    }
  }

  // Draw pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const xx = Math.floor(x / cellWidth);
      const yy = Math.floor(y / cellHeight);

      const c = colors[xx][yy];
      ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a / 255})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Convert to Base64 (PNG)
  return canvas.toDataURL("image/png");
}