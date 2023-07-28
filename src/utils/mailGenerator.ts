import Mailgen from "mailgen";
"₦"

const generateMail = new Mailgen({
  theme: "default",
  product: {
    name: `ROOM`,
    link: "https://hotel-youngmentor.vercel.app/",
    logo: "https://hotel-youngmentor.vercel.app/assets/RoomLogo-removebg-preview-d6bc1e68.png"
  }
});

export default generateMail;