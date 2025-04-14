// utils/ipfs.ts;
export const uploadToIPFS = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT_TOKEN}`, // 🔁 Replace with your actual JWT token
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Pinata upload failed: ${error}`);
  }

  const data = await res.json();
  return data.IpfsHash;
};
