import Mailgen from "mailgen";
"₦"

const generateMail = new Mailgen({
  theme: "default",
  product: {
    name: `ROOM`,
    link: "https://hotel-youngmentor.vercel.app/"
  }
});

export default generateMail;