import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const db = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  await db.orderItem.deleteMany()
  await db.order.deleteMany()
  await db.cartItem.deleteMany()
  await db.sustainabilityScore.deleteMany()
  await db.product.deleteMany()

  const products = await db.product.createMany({
    data: [
      {
        name: "Retro USB SNES-Style Controller",
        slug: "retro-usb-snes-controller",
        description:
          "Classic 16-bit feel with modern USB connectivity. Perfect for emulators and retro gaming on PC, Mac, and Switch. 8-button layout with turbo functions.",
        price: 19.99,
        stock: 120,
        category: "retro-gaming",
        imageUrl: "/images/snes-controller.jpg",
      },
      {
        name: "RGB Mechanical Gaming Keyboard (Brown Switches)",
        slug: "rgb-mechanical-keyboard",
        description:
          "Full layout with hot-swappable brown switches, per-key RGB lighting, and magnetic wrist rest. Programmable macros and aluminum top plate.",
        price: 89.99,
        stock: 45,
        category: "gaming-accessories",
        imageUrl: "/images/mechanical-keyboard.jpg",
      },
      {
        name: "Wireless Retro Arcade Fight Stick",
        slug: "wireless-arcade-fight-stick",
        description:
          "Authentic arcade feel with Sanwa-style joystick and 8 action buttons. Works wirelessly or wired on PC, PS4/5, and Switch. Remappable via software.",
        price: 129.99,
        stock: 30,
        category: "retro-gaming",
        imageUrl: "/images/arcade-stick.jpg",
      },
      {
        name: "Ergonomic Gaming Mouse - 16000 DPI",
        slug: "ergonomic-gaming-mouse",
        description:
          "Ambidextrous design with 6 programmable buttons, adjustable weights, and PixArt sensor. On-board memory for profiles and RGB underglow.",
        price: 49.99,
        stock: 100,
        category: "gaming-accessories",
        imageUrl: "/images/gaming-mouse.jpg",
      },
      {
        name: "Mini Retro Handheld Console",
        slug: "mini-retro-handheld",
        description:
          "Pre-loaded with 500+ classic games (8-bit to 16-bit era). 3.5” IPS screen, rechargeable battery, HDMI out, and two wireless controllers included.",
        price: 79.99,
        stock: 60,
        category: "retro-gaming",
        imageUrl: "/images/retro-handheld.jpg",
      },
      {
        name: "RGB Gaming Headset - 7.1 Surround",
        slug: "gaming-headset-7-1",
        description:
          "50mm drivers, virtual 7.1 surround sound, noise-canceling microphone, and memory foam ear cushions. Compatible with PC, PS4/5, Xbox, and Switch.",
        price: 59.99,
        stock: 80,
        category: "gaming-accessories",
        imageUrl: "/images/gaming-headset.jpg",
      },
      {
        name: "Retro Cartridge Display Stand (6-Slot)",
        slug: "retro-cartridge-stand",
        description:
          "Acrylic stand for displaying NES, SNES, or Sega Genesis cartridges. Stackable design with anti-scratch feet. Holds up to 6 cartridges.",
        price: 14.99,
        stock: 150,
        category: "retro-gaming",
        imageUrl: "/images/cartridge-stand.jpg",
      },
    ],
  })

  console.log(`Created ${products.count} products`)

  // Attach sustainability scores to three of the new products
  const retroController = await db.product.findUnique({
    where: { slug: "retro-usb-snes-controller" },
  })
  const mechKeyboard = await db.product.findUnique({
    where: { slug: "rgb-mechanical-keyboard" },
  })
  const arcadeStick = await db.product.findUnique({
    where: { slug: "wireless-arcade-fight-stick" },
  })

  if (retroController && mechKeyboard && arcadeStick) {
    await db.sustainabilityScore.createMany({
      data: [
        {
          productId: retroController.id,
          score: 88,
          reason:
            "USB controller reduces e-waste by working with existing devices. Durable construction with replaceable cable extends lifespan. No batteries required.",
        },
        {
          productId: mechKeyboard.id,
          score: 75,
          reason:
            "Hot-swappable switches allow repairs instead of full replacement. Aluminum frame is recyclable. RGB adds energy draw, and keycaps are still plastic.",
        },
        {
          productId: arcadeStick.id,
          score: 82,
          reason:
            "Wireless mode saves desk space but battery will eventually degrade. Sanwa-style parts are standardized and user-replaceable. Strong community support for modding keeps units in use longer.",
        },
      ],
    })
    console.log("Added sustainability scores to 3 products")
  }

  console.log("Seeding complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })