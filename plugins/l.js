const { cmd } = require("../command");

// ═══════════════════════════════════════════════════════════
// COMMAND - RANDOM FUN PIC
// ═══════════════════════════════════════════════════════════
cmd(
    {
        pattern: "l",
        desc: "Send a random fun pic.",
        category: "attitude",
        react: "💪",
        filename: __filename,
        use: "",
    },
    async (conn, mek, m, { reply }) => {
        try {
            // Random pic array
            const pics = [
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg",
                "https://i.ibb.co/Zp9NrwPR/8ff3c4f8edcf.jpg"
            ];

            // Pick random pic
            const randomPic = pics[Math.floor(Math.random() * pics.length)];

            // Send image
            await conn.sendMessage(
                mek.chat,
                { 
                    image: { url: randomPic }, 
                    caption: `> BAGGA-SHER-MD 🖤` 
                },
                { quoted: mek }
            );

        } catch (error) {
            console.error("❌ Error in .jao command:", error);
            reply("❌ *Error in .jao command:*\n" + error.message);
        }
    }
);
