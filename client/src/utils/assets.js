export const ABSTRACT_IMAGES = [
  "OIG2 (1).jpg", "OIG2 (2).jpg", "OIG2.7k9IZ6.cHN (1).jpg", "OIG2.7k9IZ6.cHN.jpg",
  "OIG2.IK.jpg", "OIG2.jpg", "OIG2.qG6nKVgCu.jpg", "OIG3 (1).jpg", "OIG3 (2).jpg",
  "OIG3.ROiJ9BkmQmfnezWr.jpg", "OIG3.jpg", "OIG4 (1).jpg", "OIG4 (10).jpg",
  "OIG4 (2).jpg", "OIG4 (3).jpg", "OIG4 (4).jpg", "OIG4 (5).jpg", "OIG4 (6).jpg",
  "OIG4 (7).jpg", "OIG4 (8).jpg", "OIG4 (9).jpg", "OIG4.7dWmFVvT3lZloqy6.jpg",
  "OIG4.RV..jpg", "OIG4.U5FRsWzmZ.jpg", "OIG4.W.jpg", "OIG4.jpg", "OIG4.rgk.jpg"
];

export const getFallbackImage = (identifier) => {
  let index = 0;
  if (typeof identifier === 'number') {
    index = identifier;
  } else if (typeof identifier === 'string') {
    // Simple hash
    for (let i = 0; i < identifier.length; i++) {
      index += identifier.charCodeAt(i);
    }
  }
  const imgName = ABSTRACT_IMAGES[index % ABSTRACT_IMAGES.length];
  return `/abstract/${imgName}`;
};
