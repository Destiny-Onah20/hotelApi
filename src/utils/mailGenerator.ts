import Mailgen from "mailgen";
"₦"

const generateMail = new Mailgen({
  theme: "default",
  product: {
    name: `ROOM`,
    link: "https://room-ka5k.onrender.com/",
    logo: "https://room-ka5k.onrender.com/assets/RoomLogo-removebg-preview-d6bc1e68.png"
  }
});

export default generateMail;